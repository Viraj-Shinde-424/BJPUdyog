// Core Type Definitions for BJP Udyog Setu

export type Language = 'mr' | 'hi' | 'en';

export type UserRole =
  | 'visitor'
  | 'business_owner'
  | 'office_bearer'
  | 'state_office_bearer'
  | 'coordinator'
  | 'admin';

export type UserCategory = 'padadhikari' | 'business_man' | 'business_existing' | 'business_aspiring';

export type OfficeBearerBadgeStyle = 'outlined' | 'solid' | 'accent-bar' | 'pill-fill';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsappPhone?: string;
  role: UserRole;
  userCategory?: UserCategory;
  isOfficeBearer: boolean;
  officeBearerTitle?: string;
  officeBearerScope?: string; // e.g. "पुणे जिल्हा" (Pune District) or "महाराष्ट्र राज्य" (Maharashtra State)
  officeBearerVerified: boolean;
  verifiedAt?: string;
  avatarUrl?: string;
}

export interface Business {
  id: string;
  ownerId: string;
  businessName: string;
  sector: string;
  district: string;
  taluka?: string;
  isAspiring?: boolean; // True if entrepreneur is starting a new business
  address?: string;
  phone: string;
  whatsappPhone?: string;
  email: string;
  website?: string;
  description?: string;
  optInDirectory: boolean;
  digitalCardSlug: string;
  udyamNumber?: string;
  establishedYear?: number;
  createdAt: string;
}

export type PostType = 'offer' | 'requirement' | 'update';
export type ResourceCategory = 'raw_material' | 'machinery' | 'services' | 'space' | 'general';

export interface B2BReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  isOfficeBearer: boolean;
  officeBearerTitle?: string;
  message: string;
  createdAt: string;
}

export interface B2BPost {
  id: string;
  authorId: string;
  authorName: string;
  authorBusinessName: string;
  authorRole: UserRole;
  isOfficeBearer: boolean;
  officeBearerTitle?: string;
  postType: PostType; // 'requirement' (buyer needs resources) or 'offer' (supplier provides)
  resourceCategory?: ResourceCategory;
  title: string;
  content: string;
  sector: string;
  district: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  tags: string[];
  createdAt: string;
  replies: B2BReply[];
}

export type InvitationType = 'attend' | 'inaugurate';
export type InvitationStatus = 'pending' | 'accepted' | 'declined';

export interface InaugurationInvitation {
  id: string;
  senderId: string;
  senderName: string;
  businessName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  district: string;
  intendedGuestName: string;
  intendedGuestKey: string; // 'modi' | 'fadnavis' | 'chavan' | office-bearer ID
  invitationType: InvitationType;
  description: string;
  status: InvitationStatus;
  responseNotes?: string;
  respondedBy?: string;
  respondedAt?: string;
  createdAt: string;
}

export type SamvadTopicType = 'scheduled_session' | 'open_discussion';
export type SamvadCategory = 'event' | 'discussion' | 'inauguration' | 'factory_tour';
export type OrganizerType = 'individual' | 'association';

export interface SamvadMessage {
  id: string;
  topicId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  isOfficeBearer: boolean;
  officeBearerTitle?: string;
  message: string;
  createdAt: string;
}

export interface SamvadTopic {
  id: string;
  creatorId: string;
  creatorName: string;
  category?: SamvadCategory; // 'event' | 'discussion' | 'inauguration' | 'factory_tour'
  organizerType?: OrganizerType; // 'individual' | 'association'
  associationName?: string;
  isPersonalInvitation?: boolean;
  invitedOfficeBearerId?: string;
  invitedOfficeBearerName?: string;
  invitedOfficeBearerTitle?: string;
  invitationType?: 'inaugurate' | 'attend';
  invitationStatus?: 'pending' | 'accepted' | 'declined';
  invitationResponseNotes?: string;
  invitationRespondedAt?: string;
  title: string;
  description: string;
  sector: string;
  district?: string;
  topicType: SamvadTopicType;
  scheduledDate?: string;
  locationOrLink?: string;
  status: 'active' | 'completed';
  createdAt: string;
  registeredUserIds: string[];
  messages: SamvadMessage[];
}

export type GrievanceType = 'unanswered_gov' | 'direct_industrial' | 'website_issue';

export type GrievanceStatus =
  | 'submitted'
  | 'under_review'
  | 'action_taken'
  | 'referred_to_state'
  | 'resolved'
  | 'closed';

export interface GrievanceUpdate {
  id: string;
  grievanceId: string;
  authorId: string;
  authorName: string;
  statusChange?: GrievanceStatus;
  updateNotes: string;
  isInternalNote: boolean;
  createdAt: string;
}

export interface LocalToStateEscalation {
  id: string;
  grievanceId: string;
  senderOfficeBearerId: string;
  senderName: string;
  senderDistrict: string; // e.g., 'Pune'
  recipientStateOfficeBearerId?: string;
  recipientName?: string;
  targetJurisdiction: string; // 'Maharashtra State'
  reason: string;
  status: 'pending_review' | 'accepted' | 'resolved';
  escalatedAt: string;
  actionNotes?: string;
}

export interface Grievance {
  id: string;
  trackingId: string; // e.g. BUS-GRV-2026-0814
  grievanceType?: GrievanceType;
  subject?: string;
  ownerId: string;
  ownerName: string;
  businessName: string;
  district: string;
  contactPhone: string;
  originalGrievanceLink?: string;
  originalReferenceNo?: string;
  originalFilingDate?: string;
  explanation: string;
  status: GrievanceStatus;
  assignedOfficeBearerId?: string;
  assignedOfficeBearerName?: string;
  assignedAt?: string;
  isEscalatedToState: boolean;
  escalationId?: string;
  createdAt: string;
  updatedAt: string;
  updates: GrievanceUpdate[];
}

export type LeaderMeetingStatus =
  | 'pending_review'
  | 'under_review'
  | 'approved'
  | 'declined'
  | 'scheduled';

export interface LeaderMeetingRequest {
  id: string;
  trackingId: string; // e.g. BUS-LDR-2026-0045
  requesterId: string;
  requesterName: string;
  leaderKey: 'narendra-modi' | 'devendra-fadnavis' | 'ravindra-chavan';
  leaderName: string;
  businessName: string;
  representativeName: string;
  designation: string;
  industrySector: string;
  district: string;
  contactPhone: string;
  contactEmail: string;
  purpose: string;
  delegationSize: number;
  preferredTimeframe: string;
  status: LeaderMeetingStatus;
  coordinatorNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocStatus = 'present' | 'missing' | 'needs_correction' | 'unreadable';

export interface DocumentItem {
  id: string;
  key: string;
  nameMr: string;
  nameHi: string;
  nameEn: string;
  required: boolean; // required or conditional
  conditionDetails?: {
    mr: string;
    hi: string;
    en: string;
  };
  sourceAuthority: string; // e.g. 'MIDC', 'MPCB', 'Industry Dept', 'Aaple Sarkar'
  sourceUrl: string;
  status: DocStatus;
  uploadedFileName?: string;
  uploadedFileSize?: number;
  reason?: {
    mr: string;
    hi: string;
    en: string;
  };
  nextAction?: {
    mr: string;
    hi: string;
    en: string;
  };
  lastChecked?: string;
}

export interface StartupStep {
  stepNumber: number;
  titleMr: string;
  titleHi: string;
  titleEn: string;
  descriptionMr: string;
  descriptionHi: string;
  descriptionEn: string;
  authority: string;
  officialPortal: string;
}

export interface StartupGuidance {
  sector: string;
  district: string;
  summaryMr: string;
  summaryHi: string;
  summaryEn: string;
  orderedSteps: StartupStep[];
  checklist: DocumentItem[];
}

export interface SchemeMatch {
  id: string;
  nameMr: string;
  nameHi: string;
  nameEn: string;
  departmentMr: string;
  departmentHi: string;
  departmentEn: string;
  isCurated: boolean; // true if curated in portal, false if discovered dynamically
  level: 'State (Maharashtra)' | 'Central (India)';
  whyFitMr: string;
  whyFitHi: string;
  whyFitEn: string;
  subsidyBenefitMr: string;
  subsidyBenefitHi: string;
  subsidyBenefitEn: string;
  officialLink: string;
  sourceAuthority: string;
  sourceCheckedAt: string;
}

export interface SchemeSearchResult {
  query: string;
  matches: SchemeMatch[];
  isSourceUnavailable: boolean;
  unavailableReason?: string;
  officialDirectoryFallbackLinks: { label: string; url: string }[];
}
