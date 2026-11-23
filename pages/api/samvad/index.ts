import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';
import { getSessionUser } from '@/lib/auth/session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { sector, id, category, organizerType, q } = req.query;
    if (id) {
      const topic = db.getSamvadTopicById(id as string);
      if (!topic) return res.status(404).json({ error: 'Topic not found' });
      return res.status(200).json({ topic });
    }

    let topics = db.getSamvadTopics(sector as string);

    if (category && category !== 'all') {
      topics = topics.filter((t) => t.category === category);
    }

    if (organizerType && organizerType !== 'all') {
      topics = topics.filter((t) => t.organizerType === organizerType);
    }

    if (q) {
      const queryStr = (q as string).toLowerCase();
      topics = topics.filter(
        (t) =>
          t.title.toLowerCase().includes(queryStr) ||
          t.description.toLowerCase().includes(queryStr) ||
          (t.associationName && t.associationName.toLowerCase().includes(queryStr)) ||
          (t.locationOrLink && t.locationOrLink.toLowerCase().includes(queryStr)) ||
          (t.district && t.district.toLowerCase().includes(queryStr))
      );
    }

    return res.status(200).json({ topics });
  }

  if (req.method === 'POST') {
    const user = getSessionUser(req);
    const creatorId = user?.id || (req.body.creatorId as string) || 'user-prashant-mahajan';
    const profile = db.getProfileById(creatorId);

    const {
      title,
      description,
      sector,
      category = 'discussion',
      organizerType = 'individual',
      associationName,
      isPersonalInvitation,
      invitedOfficeBearerId,
      invitedOfficeBearerName,
      invitedOfficeBearerTitle,
      invitationType,
      invitationStatus,
      invitationResponseNotes,
      topicType,
      scheduledDate,
      locationOrLink,
      district,
    } = req.body;

    if (!title || !description || !sector) {
      return res.status(400).json({ error: 'Title, description and sector are required' });
    }

    const newTopic = db.createSamvadTopic({
      creatorId,
      creatorName: profile?.fullName || 'उद्योजक सदस्य',
      category,
      organizerType,
      associationName: organizerType === 'association' ? associationName : undefined,
      isPersonalInvitation: organizerType === 'individual' ? (isPersonalInvitation ?? true) : false,
      invitedOfficeBearerId: organizerType === 'individual' ? invitedOfficeBearerId : undefined,
      invitedOfficeBearerName: organizerType === 'individual' ? invitedOfficeBearerName : undefined,
      invitedOfficeBearerTitle: organizerType === 'individual' ? invitedOfficeBearerTitle : undefined,
      invitationType: organizerType === 'individual' ? invitationType || 'attend' : undefined,
      invitationStatus: organizerType === 'individual' ? (invitationStatus || 'pending') : undefined,
      invitationResponseNotes: organizerType === 'individual' ? invitationResponseNotes : undefined,
      title,
      description,
      sector,
      district: district || 'Maharashtra',
      topicType: topicType || 'open_discussion',
      scheduledDate: scheduledDate || undefined,
      locationOrLink: locationOrLink || undefined,
    });

    return res.status(201).json({ success: true, topic: newTopic });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
