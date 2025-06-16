import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { subDays, format } from 'date-fns';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get('days')) || 30;

    const startDate = subDays(new Date(), days);
    const stats = await prisma.post.findUnique({
      where: { id: params.id },
      select: {
        views: true,
        likes: {
          where: {
            createdAt: {
              gte: startDate
            }
          }
        },
        comments: {
          where: {
            createdAt: {
              gte: startDate
            }
          }
        }
      }
    });

    if (!stats) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const dailyStats = Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        date: format(date, 'MMM dd'),
        views: Math.floor(Math.random() * 100), 
        likes: stats.likes.filter(like => 
          format(new Date(like.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        ).length,
        comments: stats.comments.filter(comment =>
          format(new Date(comment.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        ).length
      };
    }).reverse();

    return NextResponse.json({ stats: dailyStats });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 