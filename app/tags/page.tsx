import { prisma } from '../../lib/prisma';
import Link from 'next/link';

async function getTags() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    },
    orderBy: {
      posts: {
        _count: 'desc'
      }
    }
  });
  return tags;
}

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Tags</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tags/${tag.name}`}
            className="p-4 border rounded-lg hover:bg-gray-50"
          >
            <h2 className="font-medium">{tag.name}</h2>
            <p className="text-sm text-gray-500">
              {tag._count.posts} posts
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
} 