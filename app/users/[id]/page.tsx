import { prisma } from '../../../lib/prisma';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { FollowButton } from '../../../components/user/FollowButton';
import { PostCard } from '../../../components/blog/PostCard';

async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true
        }
      },
      posts: {
        where: { published: true },
        include: {
          tags: true,
          author: {
            select: {
              name: true,
              image: true
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });

  if (!user) notFound();
  return user;
}

export default async function UserProfilePage({
  params
}: {
  params: { id: string };
}) {
  const user = await getUserProfile(params.id);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-start gap-8 mb-8">
        <img
          src={user.image || '/default-avatar.png'}
          alt={user.name || 'Anonymous'}
          className="w-24 h-24 rounded-full"
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold">{user.name || 'Anonymous'}</h1>
            <FollowButton userId={user.id} initialIsFollowing={false} />
          </div>

          <div className="flex gap-6 text-gray-500">
            <div>
              <span className="font-medium">{user._count.posts}</span> posts
            </div>
            <div>
              <span className="font-medium">{user._count.followers}</span> followers
            </div>
            <div>
              <span className="font-medium">{user._count.following}</span> following
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-xl font-semibold">Recent Posts</h2>
        <div className="grid gap-6">
          {user.posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={{
                ...post,
                createdAt: post.createdAt.toISOString()
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
} 