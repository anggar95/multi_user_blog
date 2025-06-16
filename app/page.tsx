import { prisma } from '../lib/prisma';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

async function getPosts() {
  return prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true, image: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="border-b pb-8">
            <Link href={`/posts/${post.id}`}>
              <h2 className="text-xl font-semibold hover:text-gray-600">
                {post.title}
              </h2>
            </Link>
            
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <img
                src={post.author.image || '/default-avatar.png'}
                alt={post.author.name || 'Anonymous'}
                className="w-6 h-6 rounded-full"
              />
              <span>{post.author.name || 'Anonymous'}</span>
              <span>•</span>
              <time>{formatDistanceToNow(new Date(post.createdAt))} ago</time>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
} 