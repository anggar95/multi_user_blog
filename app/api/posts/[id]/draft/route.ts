import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id }
    });

    if (!post) {
      return new NextResponse('Not Found', { status: 404 });
    }

    if (post.authorId !== userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, content, tags } = await req.json();

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        content,
        tags: {
          set: [],
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag }
          }))
        }
      },
      include: {
        tags: true
      }
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 