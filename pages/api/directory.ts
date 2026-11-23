import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';
import { getSessionUser } from '@/lib/auth/session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { sector, district, all } = req.query;
    let list = all === 'true' ? db.getBusinesses() : db.getDirectoryBusinesses();

    if (sector && sector !== 'all') {
      list = list.filter((b) => b.sector.toLowerCase() === (sector as string).toLowerCase());
    }
    if (district && district !== 'all') {
      list = list.filter((b) => b.district.toLowerCase() === (district as string).toLowerCase());
    }

    // Attach owner's office bearer status
    const profiles = db.getProfiles();
    const enriched = list.map((b) => {
      const owner = profiles.find((p) => p.id === b.ownerId);
      return {
        ...b,
        ownerName: owner?.fullName || 'उद्योजक',
        isOfficeBearer: owner?.isOfficeBearer || false,
        officeBearerTitle: owner?.officeBearerTitle,
        officeBearerScope: owner?.officeBearerScope,
        officeBearerVerified: owner?.officeBearerVerified || false,
      };
    });

    return res.status(200).json({ businesses: enriched });
  }

  if (req.method === 'POST') {
    const user = getSessionUser(req);
    const {
      ownerName,
      businessName,
      sector,
      district,
      taluka,
      phone,
      whatsappPhone,
      email,
      website,
      address,
      description,
      optInDirectory,
      userCategory = 'business_existing',
      isOfficeBearerClaim,
      officeBearerTitle,
      officeBearerScope,
      isAspiring,
    } = req.body;

    if (!businessName || !sector || !district || !phone) {
      return res.status(400).json({ error: 'Missing mandatory fields' });
    }

    const isOB = isOfficeBearerClaim || userCategory === 'padadhikari';
    const ownerId = user?.id || `user-${Date.now()}`;

    // If new user or profile update
    if (!user) {
      db.getProfiles().push({
        id: ownerId,
        fullName: ownerName || 'नवीन उद्योजक',
        email: email || `user-${Date.now()}@example.com`,
        phone,
        whatsappPhone: whatsappPhone || phone,
        role: isOB ? 'office_bearer' : 'business_owner',
        userCategory,
        isOfficeBearer: isOB,
        officeBearerTitle: isOB ? officeBearerTitle || 'जिल्हा पदाधिकारी, भाजप उद्योग आघाडी' : undefined,
        officeBearerScope: isOB ? officeBearerScope || district : undefined,
        officeBearerVerified: false, // Requires admin verification
      });
    }

    const slug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `biz-${Date.now()}`;

    const newBiz = db.createBusiness({
      ownerId,
      businessName,
      sector,
      district,
      taluka: taluka || '',
      isAspiring: Boolean(isAspiring || userCategory === 'business_aspiring'),
      phone,
      whatsappPhone: whatsappPhone || phone,
      email: email || '',
      website: website || '',
      address: address || '',
      description: description || '',
      optInDirectory: optInDirectory !== false,
      digitalCardSlug: `${slug}-${district.toLowerCase()}`,
    });

    return res.status(201).json({ success: true, business: newBiz });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
