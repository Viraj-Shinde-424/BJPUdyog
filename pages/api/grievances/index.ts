import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';
import { getSessionUser } from '@/lib/auth/session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const user = getSessionUser(req);
    const userId = user?.id || (req.query.userId as string);
    const role = user?.role || (req.query.role as string) || 'business_owner';

    const grievances = db.getGrievances(userId, role);
    return res.status(200).json({ grievances });
  }

  if (req.method === 'POST') {
    const user = getSessionUser(req);
    const ownerId = user?.id || (req.body.ownerId as string) || 'user-anand-kulkarni';
    const profile = db.getProfileById(ownerId);

    const {
      businessName,
      district,
      contactPhone,
      grievanceType = 'unanswered_gov',
      subject,
      originalGrievanceLink,
      originalReferenceNo,
      originalFilingDate,
      explanation,
    } = req.body;

    if (!businessName || !district || !explanation) {
      return res.status(400).json({ error: 'Business name, district and explanation are required.' });
    }

    if (grievanceType === 'unanswered_gov' && !originalGrievanceLink) {
      return res.status(400).json({ error: 'Original government grievance link is required for government follow-up cases.' });
    }

    const newGrievance = db.createGrievance({
      ownerId,
      ownerName: profile?.fullName || 'उद्योजक',
      businessName,
      district,
      contactPhone: contactPhone || profile?.phone || '',
      grievanceType,
      subject,
      originalGrievanceLink: originalGrievanceLink || '',
      originalReferenceNo,
      originalFilingDate,
      explanation,
    });

    return res.status(201).json({ success: true, grievance: newGrievance });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
