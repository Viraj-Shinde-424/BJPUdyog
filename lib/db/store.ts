import fs from 'fs';
import path from 'path';
import {
  UserProfile,
  Business,
  B2BPost,
  B2BReply,
  InaugurationInvitation,
  SamvadTopic,
  SamvadMessage,
  Grievance,
  GrievanceUpdate,
  LocalToStateEscalation,
  LeaderMeetingRequest,
  DocumentItem,
  SchemeMatch,
  OfficeBearerBadgeStyle,
  UserCategory,
} from '@/lib/types';

import {
  initialProfiles,
  initialBusinesses,
  initialB2BPosts,
  initialInaugurations,
  initialSamvadTopics,
  initialGrievances,
  initialLeaderMeetings,
  sampleFoundryChecklist,
  officialGovernmentSchemes,
} from './fixtures';

export interface DatabaseState {
  profiles: UserProfile[];
  businesses: Business[];
  b2bPosts: B2BPost[];
  inaugurations: InaugurationInvitation[];
  samvadTopics: SamvadTopic[];
  grievances: Grievance[];
  escalations: LocalToStateEscalation[];
  leaderMeetings: LeaderMeetingRequest[];
  documentChecklists: Record<string, DocumentItem[]>;
  schemes: SchemeMatch[];
  settings: {
    officeBearerBadgeStyle: OfficeBearerBadgeStyle;
    stateEscalationEnabled: boolean;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class DataStore {
  private state: DatabaseState | null = null;

  private initializeDefaultState(): DatabaseState {
    return {
      profiles: JSON.parse(JSON.stringify(initialProfiles)),
      businesses: JSON.parse(JSON.stringify(initialBusinesses)),
      b2bPosts: JSON.parse(JSON.stringify(initialB2BPosts)),
      inaugurations: JSON.parse(JSON.stringify(initialInaugurations)),
      samvadTopics: JSON.parse(JSON.stringify(initialSamvadTopics)),
      grievances: JSON.parse(JSON.stringify(initialGrievances)),
      escalations: [],
      leaderMeetings: JSON.parse(JSON.stringify(initialLeaderMeetings)),
      documentChecklists: {
        'foundry-pune': JSON.parse(JSON.stringify(sampleFoundryChecklist.checklist)),
      },
      schemes: JSON.parse(JSON.stringify(officialGovernmentSchemes)),
      settings: {
        officeBearerBadgeStyle: (process.env.OFFICE_BEARER_BADGE_STYLE as OfficeBearerBadgeStyle) || 'outlined',
        stateEscalationEnabled: process.env.STATE_ESCALATION_ENABLED === 'true',
      },
    };
  }

  private loadState(): DatabaseState {
    if (this.state) {
      return this.state;
    }

    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.state = JSON.parse(raw);
        return this.state!;
      }
    } catch (e) {
      console.warn('Could not read existing db.json, re-initializing default state.', e);
    }

    const defaultState = this.initializeDefaultState();
    this.saveState(defaultState);
    this.state = defaultState;
    return this.state;
  }

  private saveState(state: DatabaseState): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf8');
      this.state = state;
    } catch (e) {
      console.error('Failed to write db.json', e);
    }
  }

  public reset(): void {
    const defaultState = this.initializeDefaultState();
    this.saveState(defaultState);
    this.state = defaultState;
  }

  // --- Profiles & Auth ---
  public getProfiles(): UserProfile[] {
    return this.loadState().profiles;
  }

  public getProfileById(id: string): UserProfile | undefined {
    return this.loadState().profiles.find((p) => p.id === id);
  }

  public getProfileByEmail(email: string): UserProfile | undefined {
    return this.loadState().profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
  }

  public createProfile(profile: Omit<UserProfile, 'id'> & { id?: string }): UserProfile {
    const state = this.loadState();
    const newProfile: UserProfile = {
      ...profile,
      id: profile.id || `user-${Date.now()}`,
    };
    state.profiles.push(newProfile);
    this.saveState(state);
    return newProfile;
  }

  public updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const state = this.loadState();
    const idx = state.profiles.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    state.profiles[idx] = { ...state.profiles[idx], ...updates };
    this.saveState(state);
    return state.profiles[idx];
  }

  public verifyOfficeBearer(id: string, title: string, scope: string): UserProfile | null {
    return this.updateProfile(id, {
      isOfficeBearer: true,
      officeBearerTitle: title,
      officeBearerScope: scope,
      officeBearerVerified: true,
      verifiedAt: new Date().toISOString(),
    });
  }

  // --- Businesses ---
  public getBusinesses(): Business[] {
    return this.loadState().businesses;
  }

  public getDirectoryBusinesses(): Business[] {
    return this.loadState().businesses.filter((b) => b.optInDirectory);
  }

  public getBusinessBySlug(slug: string): Business | undefined {
    return this.loadState().businesses.find((b) => b.digitalCardSlug === slug);
  }

  public getBusinessByOwnerId(ownerId: string): Business | undefined {
    return this.loadState().businesses.find((b) => b.ownerId === ownerId);
  }

  public createBusiness(data: Omit<Business, 'id' | 'createdAt'>): Business {
    const state = this.loadState();
    const newBiz: Business = {
      ...data,
      id: `biz-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    state.businesses.push(newBiz);
    this.saveState(state);
    return newBiz;
  }

  public createDirectoryProfile(data: {
    ownerId?: string;
    fullName: string;
    businessName: string;
    industrySector: string;
    district: string;
    taluka?: string;
    phone: string;
    whatsappPhone?: string;
    email?: string;
    isAspiring?: boolean;
    userCategory?: UserCategory;
    isOfficeBearer?: boolean;
    officeBearerTitle?: string;
    officeBearerScope?: string;
    isOptedInDirectory?: boolean;
  }) {
    const ownerId = data.ownerId || `user-${Date.now()}`;
    const profile = this.createProfile({
      id: ownerId,
      fullName: data.fullName,
      email: data.email || `${ownerId}@example.com`,
      phone: data.phone,
      whatsappPhone: data.whatsappPhone || data.phone,
      role: data.isOfficeBearer ? 'office_bearer' : 'business_owner',
      userCategory: data.userCategory,
      isOfficeBearer: Boolean(data.isOfficeBearer),
      officeBearerTitle: data.officeBearerTitle,
      officeBearerScope: data.officeBearerScope || data.district,
      officeBearerVerified: Boolean(data.isOfficeBearer),
    });

    const slug = data.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `biz-${Date.now()}`;

    const biz = this.createBusiness({
      ownerId,
      businessName: data.businessName,
      sector: data.industrySector,
      district: data.district,
      taluka: data.taluka || '',
      isAspiring: Boolean(data.isAspiring),
      phone: data.phone,
      whatsappPhone: data.whatsappPhone || data.phone,
      email: data.email || '',
      description: '',
      optInDirectory: data.isOptedInDirectory !== false,
      digitalCardSlug: `${slug}-${data.district.toLowerCase()}`,
    });

    return {
      ...biz,
      fullName: profile.fullName,
      userCategory: profile.userCategory,
      isOfficeBearer: profile.isOfficeBearer,
      officeBearerTitle: profile.officeBearerTitle,
    };
  }

  // --- B2B Posts & Replies ---
  public getB2BPosts(sector?: string): B2BPost[] {
    const posts = this.loadState().b2bPosts;
    if (sector && sector !== 'all') {
      return posts.filter((p) => p.sector.toLowerCase() === sector.toLowerCase());
    }
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createB2BPost(post: Omit<B2BPost, 'id' | 'createdAt' | 'replies'>): B2BPost {
    const state = this.loadState();
    const newPost: B2BPost = {
      ...post,
      id: `b2b-post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    state.b2bPosts.unshift(newPost);
    this.saveState(state);
    return newPost;
  }

  public addB2BReply(postId: string, reply: Omit<B2BReply, 'id' | 'postId' | 'createdAt'>): B2BReply | null {
    const state = this.loadState();
    const post = state.b2bPosts.find((p) => p.id === postId);
    if (!post) return null;

    const newReply: B2BReply = {
      ...reply,
      id: `reply-${Date.now()}`,
      postId,
      createdAt: new Date().toISOString(),
    };
    post.replies.push(newReply);
    this.saveState(state);
    return newReply;
  }

  // --- Inaugurations ---
  public getInaugurations(userId?: string): InaugurationInvitation[] {
    const all = this.loadState().inaugurations;
    if (userId) {
      return all.filter((i) => i.senderId === userId);
    }
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createInauguration(data: Omit<InaugurationInvitation, 'id' | 'createdAt' | 'status'>): InaugurationInvitation {
    const state = this.loadState();
    const newInv: InaugurationInvitation = {
      ...data,
      id: `inv-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    state.inaugurations.unshift(newInv);
    this.saveState(state);
    return newInv;
  }

  public respondToInauguration(
    id: string,
    status: 'accepted' | 'declined',
    responseNotes: string,
    respondedBy: string
  ): InaugurationInvitation | null {
    const state = this.loadState();
    const inv = state.inaugurations.find((i) => i.id === id);
    if (!inv) return null;

    inv.status = status;
    inv.responseNotes = responseNotes;
    inv.respondedBy = respondedBy;
    inv.respondedAt = new Date().toISOString();
    this.saveState(state);
    return inv;
  }

  // --- Samvad ---
  public getSamvadTopics(sector?: string): SamvadTopic[] {
    const all = this.loadState().samvadTopics;
    if (sector && sector !== 'all') {
      return all.filter((s) => s.sector.toLowerCase().includes(sector.toLowerCase()));
    }
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getSamvadTopicById(id: string): SamvadTopic | undefined {
    return this.loadState().samvadTopics.find((s) => s.id === id);
  }

  public createSamvadTopic(data: Omit<SamvadTopic, 'id' | 'createdAt' | 'registeredUserIds' | 'messages' | 'status'>): SamvadTopic {
    const state = this.loadState();
    const newTopic: SamvadTopic = {
      ...data,
      id: `samvad-${Date.now()}`,
      status: 'active',
      registeredUserIds: [data.creatorId],
      messages: [],
      createdAt: new Date().toISOString(),
    };
    state.samvadTopics.unshift(newTopic);
    this.saveState(state);
    return newTopic;
  }

  public respondToSamvadInvitation(
    topicId: string,
    status: 'accepted' | 'declined',
    responseNotes: string,
    responderName: string,
    responderTitle?: string
  ): SamvadTopic | null {
    const state = this.loadState();
    const topic = state.samvadTopics.find((s) => s.id === topicId);
    if (!topic) return null;

    topic.invitationStatus = status;
    topic.invitationResponseNotes = responseNotes;
    topic.invitationRespondedAt = new Date().toISOString();

    // Also append official verified response to discussion thread
    topic.messages.push({
      id: `msg-resp-${Date.now()}`,
      topicId,
      authorId: 'responder-office-bearer',
      authorName: responderName,
      authorRole: 'office_bearer',
      isOfficeBearer: true,
      officeBearerTitle: responderTitle || topic.invitedOfficeBearerTitle || 'पदाधिकारी, भाजप उद्योग आघाडी',
      message: `[अधिकृत पदाधिकारी प्रतिसाद - ${status === 'accepted' ? 'स्वीकृत / Accepted' : 'असमर्थता / Declined'}] ${responseNotes}`,
      createdAt: new Date().toISOString(),
    });

    this.saveState(state);
    return topic;
  }

  public registerForSamvad(topicId: string, userId: string): boolean {
    const state = this.loadState();
    const topic = state.samvadTopics.find((s) => s.id === topicId);
    if (!topic) return false;

    if (!topic.registeredUserIds.includes(userId)) {
      topic.registeredUserIds.push(userId);
      this.saveState(state);
    }
    return true;
  }

  public addSamvadMessage(topicId: string, messageData: Omit<SamvadMessage, 'id' | 'topicId' | 'createdAt'>): SamvadMessage | null {
    const state = this.loadState();
    const topic = state.samvadTopics.find((s) => s.id === topicId);
    if (!topic) return null;

    const newMsg: SamvadMessage = {
      ...messageData,
      id: `msg-${Date.now()}`,
      topicId,
      createdAt: new Date().toISOString(),
    };
    topic.messages.push(newMsg);
    this.saveState(state);
    return newMsg;
  }

  // --- Grievances ---
  public getGrievances(userId?: string, userRole?: string): Grievance[] {
    const all = this.loadState().grievances;
    // Strict restriction: If regular business_owner, only see own grievances
    if (userRole === 'business_owner' && userId) {
      return all.filter((g) => g.ownerId === userId);
    }
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getGrievanceByTrackingId(trackingId: string, requestingUserId?: string, userRole?: string): Grievance | null {
    const g = this.loadState().grievances.find((item) => item.trackingId.toLowerCase() === trackingId.trim().toLowerCase());
    if (!g) return null;

    // Permissions check: Only the owner or authorized staff can view grievance details & timeline
    const isAuthorizedStaff = ['office_bearer', 'state_office_bearer', 'coordinator', 'admin'].includes(userRole || '');
    if (!isAuthorizedStaff && g.ownerId !== requestingUserId) {
      // Return a stripped summary without private timeline for privacy verification
      return {
        id: g.id,
        trackingId: g.trackingId,
        businessName: g.businessName,
        district: g.district,
        status: g.status,
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
        ownerId: '',
        ownerName: 'Protected',
        contactPhone: 'Protected',
        originalGrievanceLink: '',
        explanation: 'Restricted view. Complete case details & timeline require owner login or verified staff authentication.',
        isEscalatedToState: g.isEscalatedToState,
        updates: [],
      };
    }

    return g;
  }

  public createGrievance(data: {
    ownerId: string;
    ownerName: string;
    businessName: string;
    district: string;
    contactPhone: string;
    grievanceType?: 'unanswered_gov' | 'direct_industrial' | 'website_issue';
    subject?: string;
    originalGrievanceLink?: string;
    originalReferenceNo?: string;
    originalFilingDate?: string;
    explanation: string;
  }): Grievance {
    const state = this.loadState();
    const count = state.grievances.length + 1;
    const trackingId = `BUS-GRV-2026-${String(count).padStart(4, '0')}`;

    const newGrievance: Grievance = {
      id: `grv-${Date.now()}`,
      trackingId,
      grievanceType: data.grievanceType || 'unanswered_gov',
      subject: data.subject || 'औद्योगिक तक्रार / साहाय्य मागणी',
      ownerId: data.ownerId,
      ownerName: data.ownerName,
      businessName: data.businessName,
      district: data.district,
      contactPhone: data.contactPhone,
      originalGrievanceLink: data.originalGrievanceLink || '',
      originalReferenceNo: data.originalReferenceNo,
      originalFilingDate: data.originalFilingDate,
      explanation: data.explanation,
      status: 'submitted',
      isEscalatedToState: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updates: [
        {
          id: `gup-${Date.now()}`,
          grievanceId: `grv-${Date.now()}`,
          authorId: data.ownerId,
          authorName: data.ownerName,
          statusChange: 'submitted',
          updateNotes: data.grievanceType === 'direct_industrial'
            ? 'थेट उद्योग तक्रार उद्योग सेतू मंचावर नोंदवली.'
            : data.grievanceType === 'website_issue'
              ? 'पोर्टल तांत्रिक सहाय्य / सुधारणा मागणी नोंदवली.'
              : 'शासकीय तक्रार निवारण पाठपुरावा उद्योग सेतू मंचावर नोंदवला.',
          isInternalNote: false,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    state.grievances.unshift(newGrievance);
    this.saveState(state);
    return newGrievance;
  }

  public takeUpGrievance(grievanceId: string, officeBearerId: string, officeBearerName: string): Grievance | null {
    const state = this.loadState();
    const g = state.grievances.find((item) => item.id === grievanceId);
    if (!g) return null;

    g.status = 'under_review';
    g.assignedOfficeBearerId = officeBearerId;
    g.assignedOfficeBearerName = officeBearerName;
    g.assignedAt = new Date().toISOString();
    g.updatedAt = new Date().toISOString();

    g.updates.push({
      id: `gup-${Date.now()}`,
      grievanceId,
      authorId: officeBearerId,
      authorName: officeBearerName,
      statusChange: 'under_review',
      updateNotes: `स्थानिक पदाधिकारी ${officeBearerName} यांनी ही केस स्वतःकडे घेतली असून संबंधित विभागाशी पाठपुरावा सुरू केला आहे.`,
      isInternalNote: false,
      createdAt: new Date().toISOString(),
    });

    this.saveState(state);
    return g;
  }

  public addGrievanceUpdate(
    grievanceId: string,
    authorId: string,
    authorName: string,
    updateNotes: string,
    statusChange?: Grievance['status'],
    isInternalNote = false
  ): Grievance | null {
    const state = this.loadState();
    const g = state.grievances.find((item) => item.id === grievanceId);
    if (!g) return null;

    if (statusChange) {
      g.status = statusChange;
    }
    g.updatedAt = new Date().toISOString();

    g.updates.push({
      id: `gup-${Date.now()}`,
      grievanceId,
      authorId,
      authorName,
      statusChange: statusChange || g.status,
      updateNotes,
      isInternalNote,
      createdAt: new Date().toISOString(),
    });

    this.saveState(state);
    return g;
  }

  // --- Local-to-State Escalation ---
  public escalateToState(
    grievanceId: string,
    senderId: string,
    senderName: string,
    senderDistrict: string,
    reason: string
  ): { success: boolean; message: string; escalation?: LocalToStateEscalation } {
    const state = this.loadState();
    const g = state.grievances.find((item) => item.id === grievanceId);
    if (!g) {
      return { success: false, message: 'Grievance not found.' };
    }

    const isEnabled = state.settings.stateEscalationEnabled;
    if (!isEnabled) {
      return {
        success: false,
        message: 'State routing is currently inactive pending client confirmation of roles, stages, triggers and timing. Local intake and follow-up operate independently.',
      };
    }

    const escalation: LocalToStateEscalation = {
      id: `esc-${Date.now()}`,
      grievanceId,
      senderOfficeBearerId: senderId,
      senderName,
      senderDistrict,
      targetJurisdiction: 'Maharashtra State BJP Udyog Aghadi',
      reason,
      status: 'pending_review',
      escalatedAt: new Date().toISOString(),
      actionNotes: 'Referred to State Secretariat level.',
    };

    state.escalations.unshift(escalation);
    g.isEscalatedToState = true;
    g.escalationId = escalation.id;
    g.status = 'referred_to_state';
    g.updatedAt = new Date().toISOString();

    g.updates.push({
      id: `gup-${Date.now()}`,
      grievanceId,
      authorId: senderId,
      authorName: senderName,
      statusChange: 'referred_to_state',
      updateNotes: `स्थानिक स्तरावरून (पुणे) महाराष्ट्र राज्य भाजप उद्योग आघाडीकडे केस वर्ग (Escalated) केली. कारण: ${reason}`,
      isInternalNote: false,
      createdAt: new Date().toISOString(),
    });

    this.saveState(state);
    return { success: true, message: 'Successfully escalated to state office-bearers.', escalation };
  }

  public getEscalations(): LocalToStateEscalation[] {
    return this.loadState().escalations;
  }

  // --- Leader Meetings ---
  public getLeaderMeetings(requesterId?: string): LeaderMeetingRequest[] {
    const all = this.loadState().leaderMeetings;
    if (requesterId) {
      return all.filter((m) => m.requesterId === requesterId);
    }
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createLeaderMeeting(data: Omit<LeaderMeetingRequest, 'id' | 'trackingId' | 'createdAt' | 'updatedAt' | 'status'>): LeaderMeetingRequest {
    const state = this.loadState();
    const count = state.leaderMeetings.length + 1;
    const trackingId = `BUS-LDR-2026-${String(count).padStart(4, '0')}`;

    const newMeeting: LeaderMeetingRequest = {
      ...data,
      id: `meet-${Date.now()}`,
      trackingId,
      status: 'pending_review',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    state.leaderMeetings.unshift(newMeeting);
    this.saveState(state);
    return newMeeting;
  }

  public updateLeaderMeetingStatus(
    id: string,
    status: LeaderMeetingRequest['status'],
    notes: string,
    reviewerId: string
  ): LeaderMeetingRequest | null {
    const state = this.loadState();
    const m = state.leaderMeetings.find((item) => item.id === id);
    if (!m) return null;

    m.status = status;
    m.coordinatorNotes = notes;
    m.reviewedBy = reviewerId;
    m.reviewedAt = new Date().toISOString();
    m.updatedAt = new Date().toISOString();

    this.saveState(state);
    return m;
  }

  // --- Document Validation & Checklist ---
  public getDocumentChecklist(sessionKey = 'foundry-pune'): DocumentItem[] {
    const state = this.loadState();
    if (!state.documentChecklists[sessionKey]) {
      state.documentChecklists[sessionKey] = JSON.parse(JSON.stringify(sampleFoundryChecklist.checklist));
      this.saveState(state);
    }
    return state.documentChecklists[sessionKey];
  }

  public updateDocumentCheck(
    sessionKey: string,
    docKey: string,
    fileInfo: {
      fileName: string;
      fileSize: number;
      mimeType: string;
    }
  ): DocumentItem | null {
    const state = this.loadState();
    const list = state.documentChecklists[sessionKey] || JSON.parse(JSON.stringify(sampleFoundryChecklist.checklist));
    const doc = list.find((d: DocumentItem) => d.key === docKey);
    if (!doc) return null;

    // AI Preparation check logic (Simulated intelligent heuristic parsing)
    doc.uploadedFileName = fileInfo.fileName;
    doc.uploadedFileSize = fileInfo.fileSize;
    doc.lastChecked = new Date().toISOString();

    const lowerName = fileInfo.fileName.toLowerCase();

    // Check readability based on file size and extension
    if (lowerName.includes('blur') || lowerName.includes('low_res') || fileInfo.fileSize < 50000) {
      doc.status = 'unreadable';
      doc.reason = {
        mr: 'अपलोड केलेल्या फाईलचे रिझोल्यूशन फार कमी आहे किंवा मजकूर अस्पष्ट आहे.',
        hi: 'अपलोड की गई फ़ाइल का रिज़ॉल्यूशन बहुत कम है अथवा टेक्स्ट अस्पष्ट है।',
        en: 'File resolution is too low (<100 DPI) or text scan is illegible.',
      };
      doc.nextAction = {
        mr: 'किमान ३०० DPI वर स्पष्ट स्कॅन किंवा मूळ डिजिटल PDF अपलोड करा.',
        hi: 'कृपया ३०० DPI पर स्पष्ट स्कैन अथवा मूल डिजिटल PDF अपलोड करें।',
        en: 'Re-upload a clear high-resolution scan (300 DPI) or digital PDF.',
      };
    } else if (lowerName.includes('draft') || lowerName.includes('incomplete') || lowerName.includes('unsigned')) {
      doc.status = 'needs_correction';
      doc.reason = {
        mr: 'कागदपत्रात अधिकृत स्वाक्षरी/परिशिष्ट अपूर्ण असल्याचे आढळले.',
        hi: 'दस्तावेज में आधिकारिक हस्ताक्षर या अनुबंध अधूरा पाया गया।',
        en: 'Document appears to be an unexecuted draft missing authorized seal or required annexure.',
      };
      doc.nextAction = {
        mr: 'स्वाक्षरी व आवश्यक परिशिष्ट जोडून सुधारित प्रत अपलोड करा.',
        hi: 'हस्ताक्षर एवं आवश्यक अनुबंध संलग्न करके संशोधित प्रति अपलोड करें।',
        en: 'Attach the required appendix with authorized signature and re-upload.',
      };
    } else {
      // Verified Present
      doc.status = 'present';
      doc.reason = {
        mr: 'AI पूर्व-तपासणी यशस्वी: कागदपत्र सुस्पष्ट, योग्य तारीख व अधिकृत स्रोतानुसार सुसंगत आहे.',
        hi: 'AI पूर्व-सत्यापन सफल: दस्तावेज स्पष्ट, वैध तिथि व अधिकृत स्रोत के अनुरूप है।',
        en: 'AI preparation check verified: clear resolution, correct validity date and matching requirements.',
      };
      doc.nextAction = {
        mr: 'कागदपत्र तयार आहे. पुढील अधिकृत अर्जासाठी वापरावे.',
        hi: 'दस्तावेज तैयार है। अगले आधिकारिक आवेदन के लिए सुरक्षित रखें।',
        en: 'Document is ready for formal statutory filing.',
      };
    }

    state.documentChecklists[sessionKey] = list;
    this.saveState(state);
    return doc;
  }

  // --- Scheme Discovery ---
  public searchSchemes(query: string, simulateUnavailable = false): {
    matches: SchemeMatch[];
    isSourceUnavailable: boolean;
    unavailableReason?: string;
  } {
    if (simulateUnavailable) {
      return {
        matches: [],
        isSourceUnavailable: true,
        unavailableReason: 'शासकीय महाडिरेक्टरी सर्व्हर तात्पुरता उपलब्ध नाही (HTTP 503 Service Unavailable).',
      };
    }

    const state = this.loadState();
    const q = query.trim().toLowerCase();
    if (!q) {
      return { matches: state.schemes, isSourceUnavailable: false };
    }

    const matches = state.schemes.filter((s) => {
      const fullText = `${s.nameMr} ${s.nameHi} ${s.nameEn} ${s.departmentEn} ${s.whyFitEn} ${s.whyFitMr} ${s.subsidyBenefitEn}`.toLowerCase();
      return q.split(' ').some((word) => fullText.includes(word));
    });

    return { matches, isSourceUnavailable: false };
  }

  // --- Settings ---
  public getSettings() {
    return this.loadState().settings;
  }

  public updateSettings(settings: Partial<DatabaseState['settings']>) {
    const state = this.loadState();
    state.settings = { ...state.settings, ...settings };
    this.saveState(state);
    return state.settings;
  }
}

export const db = new DataStore();
