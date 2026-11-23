import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';
import { getSessionUser } from '@/lib/auth/session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const user = getSessionUser(req);
    const userId = (req.query.userId as string) || user?.id;
    const invitations = db.getInaugurations(userId);
    return res.status(200).json({ invitations });
  }

  if (req.method === 'POST') {
    const user = getSessionUser(req);
    const senderId = user?.id || (req.body.senderId as string) || 'user-anand-kulkarni';
    const profile = db.getProfileById(senderId);

    const {
      businessName,
      eventDate,
      eventTime,
      venue,
      district,
      intendedGuestName,
      intendedGuestKey,
      invitationType,
      description,
    } = req.body;

    if (!businessName || !eventDate || !venue || !intendedGuestName || !invitationType) {
      return res.status(400).json({ error: 'Missing required invitation fields' });
    }

    const invitation = db.createInauguration({
      senderId,
      senderName: profile?.fullName || 'उद्योजक',
      businessName,
      eventDate,
      eventTime: eventTime || 'सकाळी ११:००',
      venue,
      district: district || 'Maharashtra',
      intendedGuestName,
      intendedGuestKey: intendedGuestKey || 'general',
      invitationType,
      description: description || '',
    });

    return res.status(201).json({ success: true, invitation });
  }

  if (req.method === 'PATCH') {
    const user = getSessionUser(req);
    const { id, status, responseNotes, responderName } = req.body;

    if (!id || !['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status update parameters' });
    }

    const respondedBy = responderName || user?.fullName || 'नेते / समन्वयक कक्ष';
    const updated = db.respondToInauguration(id, status, responseNotes || '', respondedBy);

    if (!updated) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    return res.status(200).json({ success: true, invitation: updated });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
