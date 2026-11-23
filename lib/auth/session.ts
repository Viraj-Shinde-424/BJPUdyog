import { NextApiRequest } from 'next';
import { db } from '@/lib/db/store';
import { UserProfile, UserRole } from '@/lib/types';

export function getSessionUser(req: NextApiRequest): UserProfile | null {
  // Check cookie, query param or header for simulated user id
  const customUserId =
    (req.headers['x-user-id'] as string) ||
    (req.query.asUser as string) ||
    (req.cookies?.['bus_user_id'] as string);

  if (customUserId) {
    const profile = db.getProfileById(customUserId);
    if (profile) return profile;
  }

  // Default demo user if none specified (can be guest/visitor)
  return null;
}

export function isStaff(role?: UserRole): boolean {
  return ['office_bearer', 'state_office_bearer', 'coordinator', 'admin'].includes(role || '');
}
