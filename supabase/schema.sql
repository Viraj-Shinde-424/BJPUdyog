-- BJP Udyog Setu (भाजपा उद्योग सेतू)
-- Supabase / PostgreSQL Production Database Schema
-- Includes RLS (Row Level Security), RBAC roles, tables, indexes, and audit logs.

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM (
  'visitor',
  'business_owner',
  'office_bearer',
  'state_office_bearer',
  'coordinator',
  'admin'
);

CREATE TYPE post_type AS ENUM ('offer', 'requirement', 'update');
CREATE TYPE invitation_type AS ENUM ('attend', 'inaugurate');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'declined');
CREATE TYPE grievance_status AS ENUM ('submitted', 'under_review', 'action_taken', 'referred_to_state', 'resolved', 'closed');
CREATE TYPE leader_meeting_status AS ENUM ('pending_review', 'under_review', 'approved', 'declined', 'scheduled');
CREATE TYPE doc_status AS ENUM ('present', 'missing', 'needs_correction', 'unreadable');

-- 2. USERS & PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE, -- References auth.users(id) in Supabase
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  role user_role DEFAULT 'business_owner',
  is_office_bearer BOOLEAN DEFAULT FALSE,
  office_bearer_title VARCHAR(255),
  office_bearer_scope VARCHAR(255), -- e.g. 'Pune District', 'Maharashtra State'
  office_bearer_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BUSINESSES (Opt-in Directory)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  sector VARCHAR(100) NOT NULL, -- e.g. 'Foundry & Metallurgy', 'Plastics', 'Auto & Engineering'
  district VARCHAR(100) NOT NULL, -- e.g. 'Pune', 'Nashik', 'Chhatrapati Sambhajinagar'
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  description TEXT,
  opt_in_directory BOOLEAN DEFAULT TRUE,
  digital_card_slug VARCHAR(100) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. B2B POSTS & THREADED CONVERSATIONS
CREATE TABLE IF NOT EXISTS b2b_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id),
  post_type post_type NOT NULL, -- 'offer', 'requirement', 'update'
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  sector VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS b2b_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES b2b_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INAUGURATION & EVENT INVITATIONS
CREATE TABLE IF NOT EXISTS inauguration_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  event_time VARCHAR(50),
  venue TEXT NOT NULL,
  district VARCHAR(100) NOT NULL,
  intended_guest_name VARCHAR(255) NOT NULL, -- Leader / Office-bearer invited
  intended_guest_key VARCHAR(100) NOT NULL, -- 'modi', 'fadnavis', 'chavan', or office-bearer profile ID
  invitation_type invitation_type NOT NULL, -- 'attend' or 'inaugurate'
  description TEXT,
  status invitation_status DEFAULT 'pending',
  response_notes TEXT,
  responded_by UUID REFERENCES profiles(id),
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SAMVAD (Discussions & Conferences)
CREATE TABLE IF NOT EXISTS samvad_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  sector VARCHAR(100) NOT NULL,
  topic_type VARCHAR(50) DEFAULT 'open_discussion', -- 'scheduled_session' or 'open_discussion'
  scheduled_date TIMESTAMPTZ,
  location_or_link VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS samvad_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES samvad_topics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(topic_id, user_id)
);

CREATE TABLE IF NOT EXISTS samvad_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES samvad_topics(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. GOVERNMENT GRIEVANCES (Unanswered Grievances Redressal)
CREATE TABLE IF NOT EXISTS grievances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'BUS-GRV-2026-0042'
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  district VARCHAR(100) NOT NULL,
  original_grievance_link TEXT NOT NULL, -- Link to Aaple Sarkar / CPGRAMS / MIDC
  original_reference_no VARCHAR(100),
  original_filing_date DATE,
  explanation TEXT NOT NULL, -- What remains unanswered
  status grievance_status DEFAULT 'submitted',
  assigned_office_bearer_id UUID REFERENCES profiles(id),
  assigned_at TIMESTAMPTZ,
  is_escalated_to_state BOOLEAN DEFAULT FALSE,
  escalation_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS grievance_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grievance_id UUID NOT NULL REFERENCES grievances(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status_change grievance_status,
  update_notes TEXT NOT NULL,
  is_internal_note BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. LOCAL-TO-STATE ESCALATION AUDIT LOG
CREATE TABLE IF NOT EXISTS local_to_state_escalations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grievance_id UUID NOT NULL REFERENCES grievances(id) ON DELETE CASCADE,
  sender_office_bearer_id UUID NOT NULL REFERENCES profiles(id),
  recipient_state_office_bearer_id UUID REFERENCES profiles(id),
  sender_district VARCHAR(100) NOT NULL, -- e.g. 'Pune'
  target_jurisdiction VARCHAR(100) NOT NULL DEFAULT 'Maharashtra State',
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending_review',
  escalated_at TIMESTAMPTZ DEFAULT NOW(),
  action_notes TEXT
);

-- 9. LEADER MEETING REQUESTS
CREATE TABLE IF NOT EXISTS leader_meeting_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'BUS-LDR-2026-0019'
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  leader_key VARCHAR(50) NOT NULL, -- 'narendra-modi', 'devendra-fadnavis', 'ravindra-chavan'
  business_name VARCHAR(255) NOT NULL,
  representative_name VARCHAR(255) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  industry_sector VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  purpose TEXT NOT NULL,
  delegation_size INT DEFAULT 1,
  preferred_timeframe VARCHAR(100),
  status leader_meeting_status DEFAULT 'pending_review',
  coordinator_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DOCUMENT VALIDATION SESSIONS (AI Preparation Check)
CREATE TABLE IF NOT EXISTS document_validation_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES profiles(id),
  sector VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  document_key VARCHAR(100) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  file_name VARCHAR(255),
  file_url TEXT,
  file_size INT,
  mime_type VARCHAR(100),
  status doc_status NOT NULL, -- 'present', 'missing', 'needs_correction', 'unreadable'
  reason TEXT NOT NULL,
  next_action TEXT NOT NULL,
  source_authority VARCHAR(100), -- 'MIDC', 'MPCB', 'Aaple Sarkar', etc.
  source_url TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INDEXES FOR HIGH-PERFORMANCE QUERIES
CREATE INDEX IF NOT EXISTS idx_businesses_sector ON businesses(sector);
CREATE INDEX IF NOT EXISTS idx_businesses_district ON businesses(district);
CREATE INDEX IF NOT EXISTS idx_b2b_posts_sector ON b2b_posts(sector);
CREATE INDEX IF NOT EXISTS idx_grievances_tracking ON grievances(tracking_id);
CREATE INDEX IF NOT EXISTS idx_grievances_owner ON grievances(owner_id);
CREATE INDEX IF NOT EXISTS idx_samvad_sector ON samvad_topics(sector);
CREATE INDEX IF NOT EXISTS idx_leader_meetings_leader ON leader_meeting_requests(leader_key);
CREATE INDEX IF NOT EXISTS idx_leader_meetings_tracking ON leader_meeting_requests(tracking_id);

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE inauguration_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE samvad_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE samvad_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE samvad_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievance_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_to_state_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leader_meeting_requests ENABLE ROW LEVEL SECURITY;

-- Grievances: Only owner and authorized staff/office-bearers can view
CREATE POLICY grievance_owner_read ON grievances
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY grievance_staff_read ON grievances
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.auth_id = auth.uid()
      AND profiles.role IN ('office_bearer', 'state_office_bearer', 'coordinator', 'admin')
    )
  );
