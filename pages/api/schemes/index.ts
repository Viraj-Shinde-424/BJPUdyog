import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = (req.query.q as string) || '';
  const simulateUnavailable = req.query.simulateUnavailable === 'true';

  const result = db.searchSchemes(query, simulateUnavailable);

  const fallbackLinks = [
    { label: 'MAITRI Maharashtra Single Window Portal', url: 'https://maitri.maharashtra.gov.in/' },
    { label: 'Directorate of Industries, Maharashtra Policy Portal', url: 'https://di.maharashtra.gov.in/' },
    { label: 'MSME Champions Portal (Central Govt)', url: 'https://champions.gov.in/' },
    { label: 'MyScheme National Portal', url: 'https://www.myscheme.gov.in/' },
  ];

  if (result.isSourceUnavailable) {
    return res.status(503).json({
      query,
      matches: [],
      isSourceUnavailable: true,
      serviceStatus: 'unavailable',
      errorMessage: result.unavailableReason || 'शासकीय महाडिरेक्टरी सर्व्हर तात्पुरता उपलब्ध नाही (HTTP 503).',
      fallbackLinks,
    });
  }

  return res.status(200).json({
    query,
    matches: result.matches,
    totalCount: result.matches.length,
    isSourceUnavailable: false,
    serviceStatus: 'online',
    fallbackLinks,
  });
}
