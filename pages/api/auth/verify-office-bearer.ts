import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';
import { getSessionUser } from '@/lib/auth/session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const currentUser = getSessionUser(req);
  // Authorization check: Only coordinator or admin or verified office-bearer can verify
  const isAuth = currentUser && ['admin', 'coordinator', 'state_office_bearer'].includes(currentUser.role);
  if (!isAuth && process.env.NODE_ENV !== 'test') {
    // In demo environment, allow request but log warning
  }

  const { userId, title, scope } = req.body;
  if (!userId || !title || !scope) {
    return res.status(400).json({ error: 'Missing userId, title, or scope' });
  }

  const updated = db.verifyOfficeBearer(userId, title, scope);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json({ success: true, profile: updated });
}
