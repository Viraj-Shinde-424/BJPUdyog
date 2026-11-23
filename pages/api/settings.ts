import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(db.getSettings());
  }

  if (req.method === 'POST') {
    const { officeBearerBadgeStyle, stateEscalationEnabled } = req.body;
    const updated = db.updateSettings({
      ...(officeBearerBadgeStyle && { officeBearerBadgeStyle }),
      ...(stateEscalationEnabled !== undefined && { stateEscalationEnabled: Boolean(stateEscalationEnabled) }),
    });

    return res.status(200).json({ success: true, settings: updated });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
