import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';
import { sampleFoundryChecklist } from '@/lib/db/fixtures';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET' || req.method === 'POST') {
    const query = (req.query.q as string) || (req.body?.query as string) || '';
    const sessionKey = (req.query.sessionKey as string) || (req.body?.sessionKey as string) || 'foundry-pune';

    // Retrieve live checklist from database
    const liveChecklist = db.getDocumentChecklist(sessionKey);

    const isFoundryQuery =
      query.toLowerCase().includes('foundry') ||
      query.includes('फाउंड्री') ||
      query.includes('ओतकाम') ||
      !query.trim();

    // Generate response matching query
    const guidance = {
      sector: isFoundryQuery ? 'Foundry & Metallurgy' : 'Industrial Manufacturing',
      district: query.includes('पुणे') || query.toLowerCase().includes('pune') ? 'Pune' : 'Maharashtra',
      summaryMr: sampleFoundryChecklist.summaryMr,
      summaryHi: sampleFoundryChecklist.summaryHi,
      summaryEn: sampleFoundryChecklist.summaryEn,
      orderedSteps: sampleFoundryChecklist.orderedSteps,
      checklist: liveChecklist,
      officialSources: [
        { name: 'MIDC Land Bank & Infrastructure', url: 'https://midc.maharashtra.gov.in/land-bank' },
        { name: 'Ministry of MSME Udyam Portal', url: 'https://udyamregistration.gov.in/' },
        { name: 'Maharashtra Pollution Control Board (MPCB)', url: 'https://www.mpcb.gov.in/' },
        { name: 'DISH Directorate of Industrial Safety & Health', url: 'https://labour.maharashtra.gov.in/en/labour-rts-services' },
        { name: 'MAITRI Single Window Clearances', url: 'https://maitri.maharashtra.gov.in/' },
        { name: 'Aaple Sarkar Citizen Services', url: 'https://aaplesarkar.mahaonline.gov.in/' },
      ],
      aiBadge: 'AI पूर्व-तपासणी प्रणाली (AI Preparation Check)',
    };

    return res.status(200).json({ success: true, guidance });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
