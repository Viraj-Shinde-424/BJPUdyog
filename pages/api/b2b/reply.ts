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

  const { postId, message } = req.body;
  if (!postId || !message || !message.trim()) {
    return res.status(400).json({ error: 'Post ID and reply message are required' });
  }

  const reply = db.addB2BReply(postId, {
    authorId,
    authorName: profile?.fullName || 'उद्योजक सदस्य',
    authorRole: profile?.role || 'business_owner',
    isOfficeBearer: profile?.isOfficeBearer || false,
    officeBearerTitle: profile?.officeBearerTitle,
    message: message.trim(),
  });

  if (!reply) {
    return res.status(404).json({ error: 'Post not found' });
  }

  return res.status(201).json({ success: true, reply });
}
