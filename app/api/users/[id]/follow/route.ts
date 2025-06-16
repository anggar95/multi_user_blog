import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (userId === params.id) {
      return new NextResponse('Cannot follow yourself', { status: 400 });
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: params.id,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'FOLLOW',
        message: 'Someone started following you',
        userId: params.id,
      },
    });

    return NextResponse.json(follow);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: params.id,
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 