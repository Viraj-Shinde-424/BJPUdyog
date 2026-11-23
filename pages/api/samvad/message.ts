import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';
import { getSessionUser } from '@/lib/auth/session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = getSessionUser(req);
  const authorId = user?.id || (req.body.authorId as string) || 'user-anand-kulkarni';
  const profile = db.getProfileById(authorId);

  const { topicId, message } = req.body;
  if (!topicId || !message || !message.trim()) {
    return res.status(400).json({ error: 'Topic ID and message are required' });
  }

  const newMsg = db.addSamvadMessage(topicId, {
    authorId,
    authorName: profile?.fullName || 'उद्योजक सदस्य',
    authorRole: profile?.role || 'business_owner',
    isOfficeBearer: profile?.isOfficeBearer || false,
    officeBearerTitle: profile?.officeBearerTitle,
    message: message.trim(),
  });

  if (!newMsg) {
    return res.status(404).json({ error: 'Topic not found' });
  }

  return res.status(201).json({ success: true, message: newMsg });
}
