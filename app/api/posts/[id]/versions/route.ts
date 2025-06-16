import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        versions: {
          include: {
            createdBy: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!post) {
      return new NextResponse('Not Found', { status: 404 });
    }

    if (post.authorId !== userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.json({ versions: post.versions });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(
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

    const version = await prisma.postVersion.create({
      data: {
        title,
        content,
        tags,
        postId: params.id,
        userId
      }
    });

    return NextResponse.json(version);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 