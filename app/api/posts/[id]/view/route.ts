import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        views: {
          increment: 1
        }
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 