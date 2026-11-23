import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';
import { getSessionUser } from '@/lib/auth/session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const escalations = db.getEscalations();
    const settings = db.getSettings();
    return res.status(200).json({
      escalations,
      stateEscalationEnabled: settings.stateEscalationEnabled,
    });
  }

  if (req.method === 'POST') {
    const user = getSessionUser(req);
    const {
      grievanceId,
      senderId,
      senderName,
      senderDistrict,
      reason,
      forceEnable, // For testing both inactive and configured states
    } = req.body;

    if (!grievanceId || !reason) {
      return res.status(400).json({ error: 'Grievance ID and reason are required' });
    }

    if (forceEnable !== undefined) {
      db.updateSettings({ stateEscalationEnabled: Boolean(forceEnable) });
    }

    const sId = senderId || user?.id || 'user-sunil-gaikwad';
    const sName = senderName || user?.fullName || 'सुनील गायकवाड (पुणे जिल्हा संयोजक)';
    const sDistrict = senderDistrict || 'Pune';

    const result = db.escalateToState(grievanceId, sId, sName, sDistrict, reason);

    if (!result.success) {
      return res.status(403).json({
        success: false,
        error: result.message,
        isInactive: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      escalation: result.escalation,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
