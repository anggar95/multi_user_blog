import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    const tags = searchParams.get('tags')?.split(',') || [];

    const posts = await prisma.post.findMany({
      where: {
        AND: [
          { id: { not: postId } },
          { published: true },
          {
            tags: {
              some: {
                name: {
                  in: tags
                }
              }
            }
          }
        ]
      },
      include: {
        author: {
          select: {
            name: true,
            image: true
          }
        },
        tags: true
      },
      orderBy: {
        views: 'desc'
      },
      take: 5
    });

    return NextResponse.json({ posts });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 