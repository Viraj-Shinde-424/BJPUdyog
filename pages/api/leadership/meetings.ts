import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';
import { getSessionUser, isStaff } from '@/lib/auth/session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const user = getSessionUser(req);
    const requesterId = (req.query.requesterId as string) || (user?.role === 'business_owner' ? user.id : undefined);

    // Case-management access: staff can see all queue requests
    const isStaffUser = isStaff(user?.role);
    const list = isStaffUser ? db.getLeaderMeetings() : db.getLeaderMeetings(requesterId);

    return res.status(200).json({ meetings: list, isStaff: isStaffUser });
  }

  if (req.method === 'POST') {
    const user = getSessionUser(req);
    const requesterId = user?.id || (req.body.requesterId as string) || 'user-anand-kulkarni';
    const profile = db.getProfileById(requesterId);

    const {
      leaderKey,
      leaderName,
      businessName,
      representativeName,
      designation,
      industrySector,
      district,
      contactPhone,
      contactEmail,
      purpose,
      delegationSize = 1,
      preferredTimeframe = 'लवकरच (Soon)',
    } = req.body;

    if (!leaderKey || !businessName || !representativeName || !purpose) {
      return res.status(400).json({ error: 'Leader, business, representative and purpose are required.' });
    }

    const meeting = db.createLeaderMeeting({
      requesterId,
      requesterName: profile?.fullName || representativeName,
      leaderKey,
      leaderName: leaderName || leaderKey,
      businessName,
      representativeName,
      designation: designation || 'उद्योजक / प्रतिनिधी',
      industrySector: industrySector || 'Engineering & Manufacturing',
      district: district || 'Maharashtra',
      contactPhone: contactPhone || profile?.phone || '',
      contactEmail: contactEmail || profile?.email || '',
      purpose,
      delegationSize: Number(delegationSize),
      preferredTimeframe,
    });

    return res.status(201).json({ success: true, meeting });
  }

  if (req.method === 'PATCH') {
    const user = getSessionUser(req);
    const { id, status, coordinatorNotes } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: 'Meeting ID and status are required' });
    }

    const reviewerId = user?.fullName || 'सचिन जोशी (समन्वयक)';
    const updated = db.updateLeaderMeetingStatus(id, status, coordinatorNotes || '', reviewerId);

    if (!updated) {
      return res.status(404).json({ error: 'Meeting request not found' });
    }

    return res.status(200).json({ success: true, meeting: updated });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
