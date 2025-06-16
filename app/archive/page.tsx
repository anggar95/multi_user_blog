import { prisma } from '../../lib/prisma';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

async function getArchivedPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true, image: true }
      },
      tags: true,
      _count: {
        select: { likes: true, comments: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const groupedPosts = posts.reduce((acc, post) => {
    const date = new Date(post.createdAt);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });

    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][month]) {
      acc[year][month] = [];
    }
    acc[year][month].push(post);
    return acc;
  }, {} as Record<number, Record<string, typeof posts>>);

  return groupedPosts;
}

export default async function ArchivePage() {
  const groupedPosts = await getArchivedPosts();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Archive</h1>

      <div className="space-y-12">
        {Object.entries(groupedPosts)
          .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
          .map(([year, months]) => (
            <div key={year}>
              <h2 className="text-xl font-semibold mb-6">{year}</h2>
              {Object.entries(months)
                .sort(([monthA], [monthB]) => {
                  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                  return months.indexOf(monthB) - months.indexOf(monthA);
                })
                .map(([month, posts]) => (
                  <div key={month} className="mb-8">
                    <h3 className="text-lg font-medium mb-4">{month}</h3>
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <article key={post.id} className="border-b pb-4">
                          <Link href={`/posts/${post.id}`}>
                            <h4 className="text-lg font-medium hover:text-gray-600">
                              {post.title}
                            </h4>
                          </Link>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <img
                              src={post.author.image || '/default-avatar.png'}
                              alt={post.author.name || 'Anonymous'}
                              className="w-5 h-5 rounded-full"
                            />
                            <span>{post.author.name || 'Anonymous'}</span>
                            <span>•</span>
                            <time>{formatDistanceToNow(new Date(post.createdAt))} ago</time>
                            <span>•</span>
                            <span>{post._count.likes} likes</span>
                            <span>•</span>
                            <span>{post._count.comments} comments</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
} 