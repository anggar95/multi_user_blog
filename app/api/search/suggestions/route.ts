import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ suggestions: [] });
    }

    const [posts, tags, users] = await Promise.all([
      prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } }
          ],
          published: true
        },
        take: 3,
        select: {
          id: true,
          title: true
        }
      }),
      prisma.tag.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' }
        },
        take: 3,
        select: {
          id: true,
          name: true
        }
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 3,
        select: {
          id: true,
          name: true
        }
      })
    ]);

    const suggestions = [
      ...posts.map(post => ({
        id: post.id,
        title: post.title,
        type: 'post' as const
      })),
      ...tags.map(tag => ({
        id: tag.id,
        title: tag.name,
        type: 'tag' as const
      })),
      ...users.map(user => ({
        id: user.id,
        title: user.name || 'Anonymous',
        type: 'user' as const
      }))
    ];

    return NextResponse.json({ suggestions });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 