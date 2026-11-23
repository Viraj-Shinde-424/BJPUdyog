import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    sessionKey = 'foundry-pune',
    docKey,
    fileName,
    fileSize = 250000,
    mimeType = 'application/pdf',
    action = 'validate', // 'validate' | 'replace'
  } = req.body;

  if (!docKey) {
    return res.status(400).json({ error: 'docKey is required' });
  }

  const updatedDoc = db.updateDocumentCheck(sessionKey, docKey, {
    fileName: fileName || `${docKey}_verified.pdf`,
    fileSize: Number(fileSize),
    mimeType,
  });

  if (!updatedDoc) {
    return res.status(404).json({ error: 'Document not found in checklist' });
  }

  return res.status(200).json({
    success: true,
    document: updatedDoc,
    aiCheckBadge: 'AI पूर्व-तपासणी निकाल (AI Preparation Check)',
    actionTaken: action,
  });
}
