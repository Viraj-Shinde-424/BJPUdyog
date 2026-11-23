import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';
import { getSessionUser, isStaff } from '@/lib/auth/session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Can be internal ID or trackingId
  const trackingId = id as string;

  const user = getSessionUser(req);
  const requestingUserId = user?.id || (req.query.userId as string);
  const userRole = user?.role || (req.query.role as string);

  if (req.method === 'GET') {
    const grievance = db.getGrievanceByTrackingId(trackingId, requestingUserId, userRole);
    if (!grievance) {
      return res.status(404).json({ error: 'Grievance not found' });
    }

    // Flag if current viewer is authorized for full view
    const isOwner = requestingUserId && grievance.ownerId === requestingUserId;
    const isAuthorizedStaff = isStaff(userRole as any);

    return res.status(200).json({
      grievance,
      isOwner,
      isAuthorizedStaff,
      isRestrictedView: !isOwner && !isAuthorizedStaff,
    });
  }

  if (req.method === 'PATCH') {
    const { action, officeBearerId, officeBearerName, updateNotes, statusChange, isInternalNote } = req.body;
    const authorId = user?.id || officeBearerId || 'user-sunil-gaikwad';
    const authorName = user?.fullName || officeBearerName || 'स्थानिक पदाधिकारी';

    // Find grievance
    const existing = db.getGrievances().find((g) => g.trackingId.toLowerCase() === trackingId.toLowerCase() || g.id === trackingId);
    if (!existing) {
      return res.status(404).json({ error: 'Grievance not found' });
    }

    if (action === 'take_up') {
      const updated = db.takeUpGrievance(existing.id, authorId, authorName);
      return res.status(200).json({ success: true, grievance: updated });
    }

    if (action === 'add_update') {
      if (!updateNotes || !updateNotes.trim()) {
        return res.status(400).json({ error: 'Update notes are required' });
      }
      const updated = db.addGrievanceUpdate(
        existing.id,
        authorId,
        authorName,
        updateNotes.trim(),
        statusChange,
        Boolean(isInternalNote)
      );
      return res.status(200).json({ success: true, grievance: updated });
    }

    return res.status(400).json({ error: 'Unknown action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
