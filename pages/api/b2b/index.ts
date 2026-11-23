import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/store';
import { getSessionUser } from '@/lib/auth/session';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { sector, type, q } = req.query;
    let posts = db.getB2BPosts(sector as string);

    if (type && type !== 'all') {
      posts = posts.filter((p) => p.postType === type);
    }
    if (q) {
      const queryStr = (q as string).toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(queryStr) ||
          p.content.toLowerCase().includes(queryStr) ||
          p.tags.some((t) => t.toLowerCase().includes(queryStr))
      );
    }

    return res.status(200).json({ posts });
  }

  if (req.method === 'POST') {
    const user = getSessionUser(req);
    const authorId = user?.id || (req.body.authorId as string) || 'user-anand-kulkarni';
    const profile = db.getProfileById(authorId);

    const {
      postType,
      resourceCategory,
      title,
      content,
      sector,
      district,
      contactPhone,
      contactWhatsapp,
      tags,
      businessName,
    } = req.body;

    if (!postType || !title || !content || !sector) {
      return res.status(400).json({ error: 'Missing mandatory post fields' });
    }

    const newPost = db.createB2BPost({
      authorId,
      authorName: profile?.fullName || 'उद्योजक सदस्य',
      authorBusinessName: businessName || 'महाराष्ट्र उद्योग सदस्य',
      authorRole: profile?.role || 'business_owner',
      isOfficeBearer: profile?.isOfficeBearer || false,
      officeBearerTitle: profile?.officeBearerTitle,
      postType,
      resourceCategory: resourceCategory || 'general',
      title,
      content,
      sector,
      district: district || 'Maharashtra',
      contactPhone: contactPhone || profile?.phone,
      contactWhatsapp: contactWhatsapp || profile?.phone,
      tags: tags || [sector],
    });

    return res.status(201).json({ success: true, post: newPost });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
