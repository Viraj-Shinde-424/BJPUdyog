# BJP Udyog Setu (भाजपा उद्योग सेतू)
### Official Digital Platform for BJP Udyog Aghadi, Maharashtra (भाजप उद्योग आघाडी, महाराष्ट्र)

A standalone, full-stack industrial guidance, coordination, and grievance resolution web platform connecting Maharashtra's micro, small, and medium enterprises (MSMEs) with state leadership, policy advocates, government scheme Mentors, and B2B trade networks.

---

## 🏛️ Executive Architecture & Stack

- **Framework**: Next.js 14 (React 18, TypeScript)
- **Styling**: Tailwind CSS with custom design tokens matching the approved design template:
  - **Primary (`#E35914`)**: Main action, active navigation, focused controls
  - **Secondary (`#136938`)**: Confirmed states, verified certifications, secondary accents
  - **Tertiary (`#F59E0B`)**: Pending items, attention states, priority labels
  - **Neutral (`#111827`)**: Main text, high-contrast controls, inverted buttons
  - **Canvas (`#F8FAFC`)**: Pale blue-grey background, light rounded panels, thin borders
  - **Typography**: Headings and body in *Noto Sans* (with *Noto Sans Devanagari* for Marathi & Hindi); controls and labels in *Inter* (Devanagari fallback).
- **Internationalization (i18n)**: Default Marathi (`mr`), Hindi (`hi`), English (`en`) throughout navigation, hero search, validation, results, and empty states.
- **Database & Storage Architecture**:
  - Full production PostgreSQL & Supabase schema with Row-Level Security (RLS) policies: [`supabase/schema.sql`](file:///C:/Users/viraj/OneDrive/Desktop/BJP%20Udyog/supabase/schema.sql)
  - Zero-config, atomic file-persisted store (`data/db.json`) pre-seeded with realistic industrial fixtures for Pune foundry clusters, Chakan MIDC, Bhosari, and Chhatrapati Sambhajinagar polymer units.
- **Role-Based Access Control (RBAC)**: Visitor, Business Owner, Verified Office-Bearer (`पदाधिकारी`), State Office-Bearer, Coordinator.

---

## 🚀 Quick Start Instructions

### 1. Prerequisites
- Node.js (v18.0.0+ / v20+ / v26+)
- npm (v9.0.0+)

### 2. Setup & Installation
```bash
# Clone or navigate to the repository
cd "c:/Users/viraj/OneDrive/Desktop/BJP Udyog"

# Install dependencies
npm install

# Setup environment configuration
cp .env.example .env.local
```

### 3. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Running the Comprehensive Test Suite
```bash
npm test
```
Executes all 10 automated test suites verifying every client requirement and scenario.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📋 Nine Core Client Requirements Implemented

| # | Client Requirement | Implementation & Verification Status |
|---|---|---|
| **1** | **Business Owners & Office-Bearers** | Registration captures name, business, sector, district, phone/email, and opt-in directory consent. Dual-identity support allows an account to represent both a business and an office-bearer role. Authorized admin verifies title and scope (`/admin/coordinator`). Configurable small outlined `पदाधिकारी` badge rendered beside verified names. |
| **2** | **B2B Feed & Persistent Conversations** | Members publish Offers (`ऑफर`), Requirements (`मागणी`), and Updates (`अपडेट`). Filterable by sector (Foundry, Auto, Plastics, Food Processing, IT). Compact threaded conversation lists open on demand with persistent message history. |
| **3** | **Inauguration Invitations** | Members submit event date, venue, intended guest, and purpose (attend vs. inaugurate). Dignitaries/secretariat accept or decline with notes. Status and response notes trackable under "My Requests". |
| **4** | **Samvad Registration & Discussions** | Members propose advocacy topics and conferences. Supports scheduled sessions (date, time, venue/hybrid link) and open discussions. Live test scenario includes **Plastics Sector Samvad** ("महाराष्ट्र प्लास्टिक उद्योग परिषद व पुनर्चक्रीकरण धोरण संवाद") with member registrations and threaded contributions. |
| **5** | **Unanswered Government Grievances** | Requires original government link (Aaple Sarkar / MIDC / CPGRAMS), explanation, reference number, and filing date. Issues portal tracking ID (`BUS-GRV-2026-XXXX`). Local office-bearers take up cases and post progress. **Strict privacy**: Timeline is restricted to the grievance owner and authorized staff. |
| **6** | **Public AI Startup Search & Chatbot** | Visitors can ask questions (e.g. *"पुण्यात फाउंड्री सुरू करण्यासाठी कोणती कागदपत्रे लागतील?"*) **before signing in**. Returns ordered setup steps, required/conditional checklists, and direct links to official authorities (MIDC, MPCB, DISH, Aaple Sarkar). Follow-up interactive chat included. |
| **7** | **Document Validation (AI Preparation Check)** | Upload private PDF, JPG, or PNG files against statutory checklists. Heuristic OCR engine validates readability, resolution, and certifications. Displays **Present**, **Missing**, **Needs correction**, or **Unreadable** with specific reasons and next actions. Allows one-click replacement and rechecking. |
| **8** | **Local-to-State Escalation** | Referral audit trail from local office-bearer to state office-bearer (tested scenario: Pune district to Maharashtra State). Records sender, recipient, reason, and timestamp. **Configurable toggle** keeps state routing inactive pending client confirmation while local intake operates independently. |
| **9** | **Government Scheme Discovery** | Natural language scheme search beyond portal curated lists (e.g. MSICDS Industrial Cluster Scheme, MEDA Solar Subsidy, PSI 2019, CMEGP, PMEGP, CGTMSE). Shows why it fits, official application links, and verified timestamps. **Explicitly distinguishes zero matches from source unavailable states**. |

---

## 🏛️ Leadership Section (Verified Designations & Preselection)

Portraits stored directly in `public/images/leadership/`:
1. **मा. नरेंद्र मोदी (Hon. Narendra Modi)** — पंतप्रधान, भारत सरकार (Prime Minister, Government of India)
2. **मा. देवेंद्र फडणवीस (Hon. Devendra Fadnavis)** — मुख्यमंत्री, महाराष्ट्र राज्य (Chief Minister, Maharashtra State)
3. **मा. रवींद्र चव्हाण (Hon. Ravindra Chavan)** — भाजप महाराष्ट्र नेतृत्व / मा. मंत्री (BJP Maharashtra Leadership)

Clicking *"Request a meeting"* (**भेट विनंती करा**) opens the request modal with the **selected leader preselected**. Submitted requests route to the Coordinator Queue (`/admin/coordinator`) with a `BUS-LDR-2026-XXXX` tracking ID.

---

## ⚖️ Open Decisions for Client Approval

### Decision 1: Visual Treatment of the Office-Bearer (`पदाधिकारी`) Badge
- **Proposed Default**: `outlined` — A thin border with orange text (`border-[#E35914] text-[#E35914] bg-orange-50/60`). Clean, respectful, and maintains readability beside business names without visually overpowering the page.
- **Configurable Alternatives**:
  - `solid` — Subtle saffron background with dark text.
  - `accent-bar` — Clean left vertical border bar.
  - `pill-fill` — High-visibility saffron pill with white text.
- *Switchable dynamically from the top micro-bar on any screen.*

### Decision 2: Local-to-State Escalation Routing Rules
- **Current State**: Kept **Inactive by default** (`stateEscalationEnabled: false`) as instructed, with a visible notice explaining that local intake and follow-up work independently.
- **Recommendations for Client Confirmation**:
  1. **Roles**: Escalation initiator restricted to District Convener / Office-Bearer; recipient to State Secretariat Coordinator.
  2. **Triggers**: Cases where local field officer has not resolved an issue within 21 business days, or issues requiring Mantralaya-level policy / tariff gazette changes.
  3. **Stages**: Local Intake ➔ Field Investigation ➔ District Secretariat Review ➔ State Ministry Referral.
  4. **Timing**: 48-hour acknowledgment from State Office-Bearer.

---

## 📁 Repository Structure

```
BJP Udyog/
├── components/
│   ├── layout/ (Header, Footer)
│   ├── ui/ (Button, Card, Modal, OfficeBearerBadge)
│   ├── home/ (HeroSearch, LeadershipSection, ResourcesGrid)
│   ├── directory/ (DirectorySection, RegisterBusinessModal)
│   ├── b2b/ (B2BSection, NewPostModal)
│   ├── samvad/ (SamvadSection, NewSamvadModal)
│   ├── grievances/ (GrievanceSection, NewGrievanceModal, EscalationModal)
│   ├── startup/ (StartupSaarthiView)
│   └── schemes/ (SubsidyMentorView)
├── lib/
│   ├── types/ (Domain interfaces & enums)
│   ├── i18n/ (Marathi, Hindi, English translations)
│   ├── db/ (Atomic store, fixtures & schema)
│   ├── auth/ (Role-based access & demo session helpers)
│   └── context/ (AppContext)
├── pages/
│   ├── _app.tsx, _document.tsx
│   ├── index.tsx (Short Homepage)
│   ├── network/ (index, directory, b2b, samvad)
│   ├── requests/ (index, grievances)
│   ├── resources/ (index, startup-saarthi, subsidy-mentor)
│   ├── admin/coordinator.tsx (Queue & Verification desk)
│   ├── card/[slug].tsx (Digital Card)
│   └── api/ (12+ full RESTful API endpoints)
├── public/
│   ├── images/leadership/ (Modi, Fadnavis, Chavan portraits)
│   ├── images/ (bjp-logo.png, udyog-setu-lotus.png)
│   └── favicon.svg
├── supabase/
│   └── schema.sql (PostgreSQL tables, indexes, RLS policies)
├── tests/
│   └── run-all-tests.ts (Automated verification test suite)
├── .env.example
├── tailwind.config.js
└── package.json
```

---

*Designed and Built for BJP Udyog Aghadi, Maharashtra.*
#   B J P U d y o g  
 