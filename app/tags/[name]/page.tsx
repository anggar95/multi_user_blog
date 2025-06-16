import { prisma } from '../../../lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

async function getTagPosts(tagName: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [tag, total] = await Promise.all([
    prisma.tag.findUnique({
      where: { name: tagName },
      include: {
        posts: {
          where: { published: true },
          include: {
            author: {
              select: { name: true, image: true }
            }
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }
      }
    }),
    prisma.post.count({
      where: {
        tags: { some: { name: tagName } },
        published: true
      }
    })
  ]);

  if (!tag) notFound();

  return {
    tag,
    total,
    pages: Math.ceil(total / limit)
  };
}

export default async function TagPage({
  params,
  searchParams
}: {
  params: { name: string };
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const { tag, pages } = await getTagPosts(params.name, page);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Posts tagged with "{tag.name}"</h1>

      <div className="space-y-8">
        {tag.posts.map((post) => (
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

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => (
          <Link
            key={pageNum}
            href={`/tags/${tag.name}?page=${pageNum}`}
            className={`px-3 py-1 rounded ${
              pageNum === page
                ? 'bg-black text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {pageNum}
          </Link>
        ))}
      </div>
    </div>
  );
} 