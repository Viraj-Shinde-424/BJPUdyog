import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';
import { getSessionUser } from '@/lib/auth/session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = getSessionUser(req);
  const userId = user?.id || (req.body.userId as string) || 'user-anand-kulkarni';
  const { topicId } = req.body;

  if (!topicId) {
    return res.status(400).json({ error: 'Topic ID is required' });
  }

  const ok = db.registerForSamvad(topicId, userId);
  if (!ok) {
    return res.status(404).json({ error: 'Topic not found' });
  }

  const updatedTopic = db.getSamvadTopicById(topicId);
  return res.status(200).json({ success: true, topic: updatedTopic });
}
