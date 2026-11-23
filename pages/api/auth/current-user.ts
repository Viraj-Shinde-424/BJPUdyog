import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';
import { getSessionUser } from '@/lib/auth/session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const user = getSessionUser(req);
    return res.status(200).json({
      user: user || null,
      allProfiles: db.getProfiles(),
    });
  }

  if (req.method === 'POST') {
    const { userId } = req.body;
    const profile = db.getProfileById(userId);
    if (!profile && userId !== 'visitor') {
      return res.status(404).json({ error: 'User not found' });
    }

    // Set cookie
    res.setHeader('Set-Cookie', `bus_user_id=${userId || ''}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
    return res.status(200).json({ success: true, user: profile || null });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
