import { prisma } from '../../lib/prisma';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

async function searchPosts(query: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        AND: [
          { published: true },
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      },
      include: {
        author: {
          select: { name: true, image: true }
        },
        tags: true
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.post.count({
      where: {
        AND: [
          { published: true },
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      }
    })
  ]);

  return { posts, total, pages: Math.ceil(total / limit) };
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams.q || '';
  const page = Number(searchParams.page) || 1;
  
  const { posts, pages } = await searchPosts(query, page);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">
        Search results for "{query}"
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        <>
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

                <div className="mt-4 flex gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/tags/${tag.name}`}
                      className="text-sm bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => (
              <Link
                key={pageNum}
                href={`/search?q=${query}&page=${pageNum}`}
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
        </>
      )}
    </div>
  );
} 