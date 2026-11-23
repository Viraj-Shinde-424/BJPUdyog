/**
 * Automated Verification & Demonstration Test Suite
 * BJP Udyog Setu (भाजपा उद्योग सेतू)
 * 
 * Verifies all client requirements:
 * 1. Guest Foundry Search (Public AI startup clearance checklist & ordered steps)
 * 2. Document Validation & Correction (Missing / Needs Correction -> Recheck / Replaced -> Present)
 * 3. Scheme Discovery (Discovered dynamic scheme beyond curated list, 0 match vs 503)
 * 4. B2B Post & Persistent Thread Reply
 * 5. Registration for Plastics-sector Samvad Conference
 * 6. Inauguration Invitation & Response (Accept / Decline)
 * 7. Leader Meeting Request with preselected dignitary (Narendra Modi / Devendra Fadnavis / Ravindra Chavan)
 * 8. Private Grievance Tracking & Timeline Restriction (Owner vs Unauthorized Viewer)
 * 9. Local-to-State Escalation in both Inactive (Blocked) and Configured (Active) states
 * 10. Office-Bearer Dual Identity & Configurable Badge Styling
 * 11. Registration Dual Modes: Padadhikari Highlighted vs Business Men (Aspiring/Existing)
 * 12. B2B Resource Requirements (Buyer Demands) & Direct Supplier Connect
 * 13. Udyog Sanvad Categorization (Events, Discussions, Inaugurations), Association Badges & Search
 * 14. Dual Grievance Types: Unanswered Gov Grievance vs Direct Industrial Grievance
 */

import assert from 'assert';
import { db } from '../lib/db/store';
import { sampleFoundryChecklist } from '../lib/db/fixtures';
import { DocumentItem } from '../lib/types';

let testsPassed = 0;
let testsFailed = 0;

function runTest(name: string, fn: () => void) {
  try {
    process.stdout.write(`TEST: ${name} ... `);
    fn();
    console.log(`\x1b[32mPASSED\x1b[0m`);
    testsPassed++;
  } catch (err) {
    console.log(`\x1b[31mFAILED\x1b[0m`);
    console.error(err);
    testsFailed++;
  }
}

async function runAll() {
  console.log('\n======================================================');
  console.log('BJP Udyog Setu - Client Requirements Verification Suite');
  console.log('======================================================\n');

  // TEST 1: Public Guest Foundry Search
  runTest('1. Guest Foundry Search (Ordered steps & official sources before login)', () => {
    const checklist = db.getDocumentChecklist('foundry-pune');
    assert(checklist.length >= 4, 'Checklist should contain all required compliance items');
    
    // Check MPCB, DISH, Fire NOC, Udyam presence
    const keys = checklist.map(c => c.key);
    assert(keys.includes('udyam_cert'), 'Should include Udyam Certificate');
    assert(keys.includes('mpcb_cte'), 'Should include MPCB Consent to Establish');
    assert(keys.includes('fire_noc'), 'Should include Fire Safety NOC');
    assert(keys.includes('land_possession'), 'Should include MIDC Land Possession');

    // Verify ordered steps
    assert(sampleFoundryChecklist.orderedSteps.length >= 6, 'Should have 6 ordered setup steps');
    assert(sampleFoundryChecklist.orderedSteps[0].stepNumber === 1, 'First step should be MIDC Land');
  });

  // TEST 2: Document Correction & AI Preparation Check
  runTest('2. Correction of a Missing / Needs-Correction Document (AI Preparation Check)', () => {
    const sessionKey = 'foundry-pune';
    
    // Initial state check
    const initialList = db.getDocumentChecklist(sessionKey);
    const mpcbDoc = initialList.find(d => d.key === 'mpcb_cte');
    assert(mpcbDoc, 'MPCB doc must exist');

    // Simulate replacement with corrected Annexure IV dossier
    const updated = db.updateDocumentCheck(sessionKey, 'mpcb_cte', {
      fileName: 'MPCB_CTE_Annexure_IV_Stamped_Certified.pdf',
      fileSize: 1850000,
      mimeType: 'application/pdf',
    });

    assert(updated, 'Updated doc must exist');
    assert.strictEqual(updated.status, 'present', 'Corrected file should update status to "present"');
    assert(updated.reason?.mr.includes('यशस्वी'), 'Should indicate AI preparation check success');
    assert(updated.uploadedFileName?.includes('Stamped_Certified'), 'File name should be recorded');

    // Test unreadable file check
    const unreadableUpdate = db.updateDocumentCheck(sessionKey, 'land_possession', {
      fileName: 'blur_scan_camera.jpg',
      fileSize: 32000,
      mimeType: 'image/jpeg',
    });
    assert(unreadableUpdate, 'Unreadable doc update must exist');
    assert.strictEqual(unreadableUpdate.status, 'unreadable', 'Low-res file should report "unreadable"');
  });

  // TEST 3: Scheme Discovery Beyond Curated List & Distinct Unavailable State
  runTest('3. Discovery of a Scheme Outside Curated List & Zero/Unavailable distinction', () => {
    // 3A: Search matches discovered scheme outside curated list
    const clusterResult = db.searchSchemes('क्लस्टर विकास MSICDS');
    assert(clusterResult.matches.length > 0, 'Should find MSICDS cluster scheme');
    const msicds = clusterResult.matches.find(m => m.id === 'scheme-msicds-cluster');
    assert(msicds, 'MSICDS cluster scheme must match');
    assert.strictEqual(msicds.isCurated, false, 'MSICDS must be flagged as dynamically discovered beyond curated list');
    assert(msicds.sourceCheckedAt, 'Must include verified date');

    // 3B: Zero matches query
    const zeroResult = db.searchSchemes('nonexistenttermxyz9999');
    assert.strictEqual(zeroResult.matches.length, 0, 'Should return 0 matches');
    assert.strictEqual(zeroResult.isSourceUnavailable, false, 'Zero matches must NOT be flagged as unavailable');

    // 3C: Source unavailable simulation
    const unavailableResult = db.searchSchemes('solar', true);
    assert.strictEqual(unavailableResult.isSourceUnavailable, true, 'Should flag source as unavailable');
    assert(unavailableResult.unavailableReason?.includes('503'), 'Should state 503 service unavailable');
  });

  // TEST 4: B2B Reply & Persistent Threaded Conversation
  runTest('4. B2B Post & Persistent Conversation Thread', () => {
    // Anand Kulkarni posts an offer
    const newPost = db.createB2BPost({
      authorId: 'user-anand-kulkarni',
      authorName: 'आनंद कुलकर्णी',
      authorBusinessName: 'कुलकर्णी कास्टिंग्स',
      authorRole: 'business_owner',
      isOfficeBearer: false,
      postType: 'offer',
      title: 'CNC फॅब्रिकेशन क्षमता उपलब्ध',
      content: 'चाकण एमआयडीसीत मासिक २० टन फॅब्रिकेशन काम हवे आहे.',
      sector: 'Auto & Engineering',
      district: 'Pune',
      tags: ['Engineering', 'Fabrication'],
    });

    assert(newPost.id, 'New post must be created');

    // Sunil Gaikwad (Office Bearer) replies to post
    const reply = db.addB2BReply(newPost.id, {
      authorId: 'user-sunil-gaikwad',
      authorName: 'सुनील गायकवाड',
      authorRole: 'office_bearer',
      isOfficeBearer: true,
      officeBearerTitle: 'जिल्हा संयोजक, भाजप उद्योग आघाडी',
      message: 'आम्ही ड्रॉईंग्स तपासले आहेत. कोटेशन पाठवावे.',
    });

    assert(reply, 'Reply must be created');
    
    // Retrieve post and ensure reply is in persistent thread
    const postWithThread = db.getB2BPosts('Auto & Engineering').find(p => p.id === newPost.id);
    assert(postWithThread, 'Post must exist in feed');
    assert.strictEqual(postWithThread.replies.length, 1, 'Post must contain persistent reply');
    assert.strictEqual(postWithThread.replies[0].message, 'आम्ही ड्रॉईंग्स तपासले आहेत. कोटेशन पाठवावे.');
  });

  // TEST 5: Registration for Plastics-Sector Samvad
  runTest('5. Registration for Plastics-Sector Samvad Discussion', () => {
    const plasticsTopic = db.getSamvadTopicById('samvad-plastics-2026');
    assert(plasticsTopic, 'Plastics sector topic must exist');
    assert.strictEqual(plasticsTopic.sector, 'Plastics & Polymers');
    assert.strictEqual(plasticsTopic.topicType, 'scheduled_session');

    // Register user-anand-kulkarni for plastics samvad
    const registered = db.registerForSamvad('samvad-plastics-2026', 'user-anand-kulkarni');
    assert.strictEqual(registered, true, 'User should successfully register');

    const updatedTopic = db.getSamvadTopicById('samvad-plastics-2026');
    assert(updatedTopic?.registeredUserIds.includes('user-anand-kulkarni'), 'User ID must be in registered list');

    // Add contribution to plastics discussion thread
    const msg = db.addSamvadMessage('samvad-plastics-2026', {
      authorId: 'user-anand-kulkarni',
      authorName: 'आनंद कुलकर्णी',
      authorRole: 'business_owner',
      isOfficeBearer: false,
      message: 'प्लास्टिक क्लस्टरसाठी सांडपाणी प्रक्रिया केंद्राचा प्रस्ताव शासनाकडे पाठवावा.',
    });

    assert(msg?.id, 'Message in samvad thread must be saved');
  });

  // TEST 6: Inauguration Invitation & Response
  runTest('6. Inauguration Invitation & Response (Accept / Decline Under My Requests)', () => {
    const inv = db.createInauguration({
      senderId: 'user-anand-kulkarni',
      senderName: 'आनंद कुलकर्णी',
      businessName: 'कुलकर्णी कास्टिंग्स प्रायव्हेट लिमिटेड',
      eventDate: '2026-12-20',
      eventTime: '११:०० सकाळी',
      venue: 'चाकण एमआयडीसी, पुणे',
      district: 'Pune',
      intendedGuestName: 'मा. रवींद्र चव्हाण',
      intendedGuestKey: 'ravindra-chavan',
      invitationType: 'inaugurate',
      description: 'नवीन टेस्टिंग लॅबचे उद्घाटन.',
    });

    assert.strictEqual(inv.status, 'pending', 'Initial status must be pending');

    // Guest / Coordinator accepts
    const responded = db.respondToInauguration(
      inv.id,
      'accepted',
      'मंत्रालय समन्वय कक्षाने तारीख मंजूर केली आहे.',
      'मा. रवींद्र चव्हाण कार्यालय'
    );

    assert(responded, 'Responded inv must exist');
    assert.strictEqual(responded.status, 'accepted');
    assert.strictEqual(responded.responseNotes, 'मंत्रालय समन्वय कक्षाने तारीख मंजूर केली आहे.');

    // Verify under sender's invitations
    const userInvs = db.getInaugurations('user-anand-kulkarni');
    const matched = userInvs.find(i => i.id === inv.id);
    assert(matched, 'Matched inv must exist');
    assert.strictEqual(matched.status, 'accepted');
  });

  // TEST 7: Leader Meeting Request with Preselected Leader
  runTest('7. Leader Meeting Request with Preselected Dignitary', () => {
    // Request meeting with Hon. Devendra Fadnavis
    const req = db.createLeaderMeeting({
      requesterId: 'user-anand-kulkarni',
      requesterName: 'आनंद कुलकर्णी',
      leaderKey: 'devendra-fadnavis',
      leaderName: 'मा. देवेंद्र फडणवीस (मुख्यमंत्री, महाराष्ट्र राज्य)',
      businessName: 'पुणे फाउंड्री असोसिएशन',
      representativeName: 'आनंद कुलकर्णी',
      designation: 'उपाध्यक्ष',
      industrySector: 'Foundry & Metallurgy',
      district: 'Pune',
      contactPhone: '+91 98220 11223',
      contactEmail: 'anand@kulkarnicastings.in',
      purpose: 'फाउंड्री क्लस्टर ऊर्जा अनुदान धोरणावर निवेदन.',
      delegationSize: 4,
      preferredTimeframe: 'डिसेंबर २०२६',
    });

    assert(req.trackingId.startsWith('BUS-LDR-2026-'), 'Must issue BUS-LDR tracking ID');
    assert.strictEqual(req.leaderKey, 'devendra-fadnavis', 'Devendra Fadnavis must be recorded');
    assert.strictEqual(req.status, 'pending_review');

    // Coordinator schedules meeting
    const scheduled = db.updateLeaderMeetingStatus(
      req.id,
      'scheduled',
      'सह्याद्री अतिथीगृह, मुंबई येथे वेळ निश्चित झाली.',
      'सचिन जोशी (समन्वयक)'
    );
    assert(scheduled, 'Scheduled meeting must exist');
    assert.strictEqual(scheduled.status, 'scheduled');
  });

  // TEST 8: Unanswered Grievance Tracking & Strict Privacy Restriction
  runTest('8. Private Grievance Tracking & Strict Timeline Access Control', () => {
    const trackingId = 'BUS-GRV-2026-0814';

    // 8A: Access as owner (Anand Kulkarni)
    const ownerView = db.getGrievanceByTrackingId(trackingId, 'user-anand-kulkarni', 'business_owner');
    assert(ownerView, 'Owner must receive grievance details');
    assert(ownerView.updates.length > 0, 'Owner must see full updates timeline');
    assert(ownerView.originalGrievanceLink?.includes('aaplesarkar'), 'Owner must see full government link');

    // 8B: Access as staff (Sunil Gaikwad, office_bearer)
    const staffView = db.getGrievanceByTrackingId(trackingId, 'user-sunil-gaikwad', 'office_bearer');
    assert(staffView, 'Staff must receive view');
    assert(staffView.updates.length > 0, 'Staff must see full updates timeline');

    // 8C: Access as unauthorized stranger / unauthenticated visitor
    const visitorView = db.getGrievanceByTrackingId(trackingId, 'unauthorized-stranger', 'business_owner');
    assert(visitorView, 'Visitor receives response');
    assert.strictEqual(visitorView.updates.length, 0, 'Unauthorized viewer must NOT see timeline');
    assert.strictEqual(visitorView.ownerName, 'Protected', 'Owner name must be masked for privacy');
    assert.strictEqual(visitorView.originalGrievanceLink, '', 'Gov link must be masked for privacy');
  });

  // TEST 9: Local-to-State Escalation Inactive vs Configured
  runTest('9. Local-to-State Escalation (Inactive Blocked vs Configured Active)', () => {
    const grievance = db.getGrievances()[0];
    assert(grievance, 'Grievance must exist');

    // Step 9A: Inactive State (Default flag = false)
    db.updateSettings({ stateEscalationEnabled: false });
    const blockedResult = db.escalateToState(
      grievance.id,
      'user-sunil-gaikwad',
      'सुनील गायकवाड (पुणे जिल्हा संयोजक)',
      'Pune',
      'Requires State Ministry policy intervention'
    );
    assert.strictEqual(blockedResult.success, false, 'Must fail when state routing is inactive');
    assert(blockedResult.message.includes('inactive pending client confirmation'), 'Must explain inactive policy');

    // Step 9B: Configured State (Flag enabled)
    db.updateSettings({ stateEscalationEnabled: true });
    const activeResult = db.escalateToState(
      grievance.id,
      'user-sunil-gaikwad',
      'सुनील गायकवाड (पुणे जिल्हा संयोजक)',
      'Pune',
      'Requires State Ministry policy intervention for Chakan HT substation'
    );
    assert.strictEqual(activeResult.success, true, 'Must succeed when state routing is configured');
    assert(activeResult.escalation?.id, 'Must create escalation audit record');
    assert.strictEqual(activeResult.escalation?.senderDistrict, 'Pune');
    assert.strictEqual(activeResult.escalation?.targetJurisdiction, 'Maharashtra State BJP Udyog Aghadi');

    // Verify grievance status changed to 'referred_to_state'
    const updatedGrievance = db.getGrievances().find(g => g.id === grievance.id);
    assert(updatedGrievance, 'Updated grievance must exist');
    assert.strictEqual(updatedGrievance.status, 'referred_to_state');
    assert.strictEqual(updatedGrievance.isEscalatedToState, true);
  });

  // TEST 10: Office-Bearer Role Verification & Configurable Badge Style
  runTest('10. Office-Bearer Role Verification & Configurable Badge Style', () => {
    // Admin verifies Anand Kulkarni as an office-bearer
    const verified = db.verifyOfficeBearer(
      'user-anand-kulkarni',
      'अध्यक्ष, उद्योग आघाडी चाकण क्लस्टर',
      'चाकण एमआयडीसी'
    );
    assert(verified, 'Verified user must exist');
    assert.strictEqual(verified.isOfficeBearer, true);
    assert.strictEqual(verified.officeBearerVerified, true);
    assert.strictEqual(verified.officeBearerTitle, 'अध्यक्ष, उद्योग आघाडी चाकण क्लस्टर');

    // Test Configurable Badge Styles
    const styles = ['outlined', 'solid', 'accent-bar', 'pill-fill'] as const;
    for (const s of styles) {
      const updatedSettings = db.updateSettings({ officeBearerBadgeStyle: s });
      assert.strictEqual(updatedSettings.officeBearerBadgeStyle, s, `Should support badge style ${s}`);
    }
  });

  // TEST 11: Registration Dual Modes: Padadhikari Highlighted vs Business Men (Aspiring/Existing)
  runTest('11. Registration Dual Modes (Highlighted Padadhikari vs Aspiring/Existing Business Men)', () => {
    // 11A: Register Aspiring Business Man
    const aspiringProfile = db.createDirectoryProfile({
      ownerId: 'user-aspiring-entrepreneur',
      fullName: 'रोहित जोशी',
      businessName: 'प्रस्तावित स्मार्ट ॲग्रो फूड्स',
      industrySector: 'Food Processing',
      district: 'Kolhapur',
      taluka: 'शिरोळ',
      phone: '+91 98223 99887',
      whatsappPhone: '+91 98223 99887',
      email: 'rohit.joshi@agrofoods.in',
      isAspiring: true,
      userCategory: 'business_man',
      isOfficeBearer: false,
      isOptedInDirectory: true,
    });
    assert(aspiringProfile.id, 'Aspiring business profile must be created');
    assert.strictEqual(aspiringProfile.isAspiring, true);
    assert.strictEqual(aspiringProfile.taluka, 'शिरोळ');

    // 11B: Register Office-Bearer (पदाधिकारी)
    const officeBearerProfile = db.createDirectoryProfile({
      ownerId: 'user-padadhikari-sangli',
      fullName: 'विजय पाटील',
      businessName: 'पाटील इंजिनिअरिंग वर्क्स',
      industrySector: 'Auto & Engineering',
      district: 'Sangli',
      taluka: 'मिरज',
      phone: '+91 98900 12345',
      whatsappPhone: '+91 98900 12345',
      email: 'vijay.patil@sangliudyog.org',
      isAspiring: false,
      userCategory: 'padadhikari',
      isOfficeBearer: true,
      officeBearerTitle: 'जिल्हा उपाध्यक्ष, भाजप उद्योग आघाडी',
      isOptedInDirectory: true,
    });
    assert(officeBearerProfile.id, 'Office-bearer profile must be created');
    assert.strictEqual(officeBearerProfile.isOfficeBearer, true);
    assert.strictEqual(officeBearerProfile.userCategory, 'padadhikari');
    assert.strictEqual(officeBearerProfile.officeBearerTitle, 'जिल्हा उपाध्यक्ष, भाजप उद्योग आघाडी');
  });

  // TEST 12: B2B Marketplace - Buyer Resource Requirements & Supplier Direct Connect
  runTest('12. B2B Marketplace (Buyer Requirements & Supplier Direct Connect)', () => {
    // Buyer posts what resource they need
    const buyerPost = db.createB2BPost({
      authorId: 'user-anand-kulkarni',
      authorName: 'आनंद कुलकर्णी',
      authorBusinessName: 'कुलकर्णी कास्टिंग्स प्रायव्हेट लिमिटेड',
      authorRole: 'business_owner',
      isOfficeBearer: false,
      postType: 'requirement',
      resourceCategory: 'raw_material',
      title: 'दरमहा ३० टन पिग आयर्न व कास्टिंग स्क्रॅप तातडीने हवे',
      content: 'चाकण प्लांटसाठी नियमित पुरवठादार हवा आहे. उच्च दर्जाचा पिग आयर्न ग्रेड-१ आवश्यक.',
      sector: 'Foundry & Metallurgy',
      district: 'Pune',
      contactPhone: '+91 98220 11223',
      contactWhatsapp: '+91 98220 11223',
      tags: ['Foundry & Metallurgy', 'raw_material', 'Pig Iron'],
    });

    assert(buyerPost.id, 'Buyer post must exist');
    assert.strictEqual(buyerPost.postType, 'requirement');
    assert.strictEqual(buyerPost.resourceCategory, 'raw_material');
    assert(buyerPost.contactPhone, 'Direct call contact phone must be available for suppliers');
    assert(buyerPost.contactWhatsapp, 'WhatsApp contact must be available for instant connect');

    // Filter feed specifically for buyer requirements
    const allPosts = db.getB2BPosts('Foundry & Metallurgy');
    const requirements = allPosts.filter(p => p.postType === 'requirement');
    assert(requirements.length > 0, 'Feed must allow suppliers to find buyer requirements');
    const found = requirements.find(p => p.id === buyerPost.id);
    assert(found, 'Created requirement must appear in filtered feed');
  });

  // TEST 13: Udyog Sanvad Categorization, Association Badges & Search
  runTest('13. Udyog Sanvad (Events, Discussions, Inaugurations & Association Filtering)', () => {
    // Association posts an industrial event
    const associationEvent = db.createSamvadTopic({
      creatorId: 'user-anand-kulkarni',
      creatorName: 'आनंद कुलकर्णी',
      category: 'event',
      organizerType: 'association',
      associationName: 'पुणे फाउंड्री असोसिएशन (PFA)',
      title: 'महाराष्ट्र फाउंड्री ऊर्जा परिषद २०२६',
      description: 'ऊर्जा दर, सौर ऊर्जा नेट मीटरिंग आणि प्रदूषण नियंत्रण मानकांवर राज्यस्तरीय परिषद.',
      sector: 'Foundry & Metallurgy',
      district: 'Pune',
      topicType: 'scheduled_session',
      scheduledDate: '2026-12-18T10:00:00Z',
      locationOrLink: 'ऑटो क्लस्टर, चिंचवड, पुणे',
    });

    assert(associationEvent.id, 'Association event must be created');
    assert.strictEqual(associationEvent.category, 'event');
    assert.strictEqual(associationEvent.organizerType, 'association');
    assert.strictEqual(associationEvent.associationName, 'पुणे फाउंड्री असोसिएशन (PFA)');

    // Search topics by keyword "ऊर्जा"
    const topics = db.getSamvadTopics();
    const matched = topics.filter(t => 
      t.title.includes('ऊर्जा') || 
      t.description.includes('ऊर्जा') || 
      (t.associationName && t.associationName.includes('पुणे'))
    );
    assert(matched.length > 0, 'Keyword search across events and associations must succeed');
  });

  // TEST 15: Individual Initiative Personal Padadhikari Invitation & Official Response Cycle
  runTest('15. Individual Initiative (Personal Dignitary Invitations & Padadhikari Response)', () => {
    // 15A: Individual owner creates factory inauguration inviting specific Padadhikari
    const personalInviteTopic = db.createSamvadTopic({
      creatorId: 'user-anand-kulkarni',
      creatorName: 'आनंद कुलकर्णी',
      category: 'inauguration',
      organizerType: 'individual',
      isPersonalInvitation: true,
      invitedOfficeBearerId: 'leader-chavan',
      invitedOfficeBearerName: 'मा. रवींद्र चव्हाण',
      invitedOfficeBearerTitle: 'सार्वजनिक बांधकाम मंत्री व प्रदेश समन्वयक',
      invitationType: 'inaugurate',
      invitationStatus: 'pending',
      title: 'नवीन सीएनसी मशीनिंग व हायड्रॉलिक युनिट उद्घाटन सोहळा',
      description: 'आमच्या चाकण येथील नवीन विस्तारित सीएनसी वर्कशॉपचे उद्घाटन मा. रवींद्र चव्हाण यांच्या शुभहस्ते व्हावे ही नम्र विनंती.',
      sector: 'Auto & Engineering',
      district: 'Pune',
      topicType: 'scheduled_session',
      scheduledDate: '2026-12-28T11:00:00Z',
      locationOrLink: 'प्लॉट क्र. ९, चाकण एमआयडीसी टप्पा-२',
    });

    assert(personalInviteTopic.id, 'Personal invitation topic must be created');
    assert.strictEqual(personalInviteTopic.organizerType, 'individual');
    assert.strictEqual(personalInviteTopic.isPersonalInvitation, true);
    assert.strictEqual(personalInviteTopic.invitedOfficeBearerName, 'मा. रवींद्र चव्हाण');
    assert.strictEqual(personalInviteTopic.invitationType, 'inaugurate');
    assert.strictEqual(personalInviteTopic.invitationStatus, 'pending');

    // 15B: Dignitary accepts the personal invitation with official remark
    const updated = db.respondToSamvadInvitation(
      personalInviteTopic.id,
      'accepted',
      'निमंत्रण स्वीकारले आहे. नियोजित वेळेत उद्घाटनास उपस्थित राहीन. नवीन प्रकल्पासाठी मनःपूर्वक शुभेच्छा.',
      'मा. रवींद्र चव्हाण',
      'सार्वजनिक बांधकाम मंत्री व प्रदेश समन्वयक'
    );

    assert(updated, 'Topic must be updated after invitation response');
    assert.strictEqual(updated.invitationStatus, 'accepted');
    assert(updated.invitationResponseNotes?.includes('निमंत्रण स्वीकारले आहे'), 'Response note must be stored');
    assert(updated.invitationRespondedAt, 'Responded timestamp must be populated');

    // 15C: Thread must contain official response message
    const responseMsg = updated.messages.find(m => m.authorRole === 'office_bearer' && m.isOfficeBearer);
    assert(responseMsg, 'Discussion thread must contain the official office-bearer reply');
    assert(responseMsg.message.includes('अधिकृत पदाधिकारी प्रतिसाद'), 'Message must indicate verified response');
  });

  // TEST 14: Dual Grievance Types (Unanswered Gov vs Direct Industrial Grievance)
  runTest('14. Dual Grievance Support (Unanswered Gov Grievance vs Direct Industrial Issue)', () => {
    // 14A: Unanswered Gov Grievance (Gov Link mandatory)
    const govGrievance = db.createGrievance({
      ownerId: 'user-anand-kulkarni',
      ownerName: 'आनंद कुलकर्णी',
      businessName: 'कुलकर्णी कास्टिंग्स प्रायव्हेट लिमिटेड',
      district: 'Pune',
      contactPhone: '+91 98220 11223',
      grievanceType: 'unanswered_gov',
      subject: 'आपले सरकार महावितरण वीज जोडणी प्रलंबित',
      originalGrievanceLink: 'https://aaplesarkar.mahaonline.gov.in/en/Grievance/Track/AS-2026-778899',
      originalReferenceNo: 'AS-2026-778899',
      originalFilingDate: '2026-09-01',
      explanation: '३ महिन्यांपासून उपविभागाकडून तपासणी अहवाल दिला गेलेला नाही.',
    });
    assert(govGrievance.trackingId.startsWith('BUS-GRV-2026-'), 'Must issue tracking ID');
    assert.strictEqual(govGrievance.grievanceType, 'unanswered_gov');
    assert(govGrievance.originalGrievanceLink, 'Gov link must be preserved');

    // 14B: Direct Industrial Grievance (Gov Link not required)
    const directGrievance = db.createGrievance({
      ownerId: 'user-anand-kulkarni',
      ownerName: 'आनंद कुलकर्णी',
      businessName: 'कुलकर्णी कास्टिंग्स प्रायव्हेट लिमिटेड',
      district: 'Pune',
      contactPhone: '+91 98220 11223',
      grievanceType: 'direct_industrial',
      subject: 'चाकण एमआयडीसी अंतर्गत रस्ते व पाणी पुरवठा वारंवार खंडित',
      explanation: 'फेज २ मधील अंतर्गत रस्ता खचला असून अवजड वाहतूक बंद झाली आहे.',
    });
    assert(directGrievance.trackingId.startsWith('BUS-GRV-2026-'), 'Direct grievance must issue tracking ID');
    assert.strictEqual(directGrievance.grievanceType, 'direct_industrial');
    assert(!directGrievance.originalGrievanceLink, 'Direct grievance does not require gov link');
  });

  console.log('\n------------------------------------------------------');
  console.log(`Results: ${testsPassed} passed, ${testsFailed} failed out of ${testsPassed + testsFailed} tests.`);
  console.log('------------------------------------------------------\n');

  // Clean up database so test fixtures do not leave duplicate sample records
  db.reset();

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runAll();
