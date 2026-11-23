import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';
import { getSessionUser } from '@/lib/auth/session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topicId, status, responseNotes, responderName, responderTitle } = req.body;

  if (!topicId || !status) {
    return res.status(400).json({ error: 'topicId and status (accepted | declined) are required' });
  }

  const user = getSessionUser(req);
  const name = responderName || user?.fullName || 'मा. पदाधिकारी, भाजप उद्योग आघाडी';
  const title = responderTitle || user?.officeBearerTitle || 'जिल्हा / प्रदेश पदाधिकारी';

  const updatedTopic = db.respondToSamvadInvitation(
    topicId,
    status as 'accepted' | 'declined',
    responseNotes || (status === 'accepted' ? 'निमंत्रण स्वीकारण्यात आले आहे. वेळेनुसार उपस्थित राहू.' : 'अनिवार्य व्यस्ततेमुळे उपस्थित राहता येत नाही. मनःपूर्वक शुभेच्छा.'),
    name,
    title
  );

  if (!updatedTopic) {
    return res.status(404).json({ error: 'Topic not found' });
  }

  return res.status(200).json({ success: true, topic: updatedTopic });
}
