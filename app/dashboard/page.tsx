import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { prisma } from '../../lib/prisma';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

async function getUserPosts(userId: string) {
  return prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function DashboardPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const posts = await getUserPosts(userId);


  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <Link
          href="/dashboard/new"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Write New Post
        </Link>
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="border-b pb-8">
            <div className="flex justify-between items-start">
              <div>
                <Link href={`/posts/${post.id}`}>
                  <h2 className="text-xl font-semibold hover:text-gray-600">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-500 mt-2">
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </p>
              </div>
              
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/edit/${post.id}`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Edit
                </Link>
              </div>
            </div>

            <div className="mt-4">
              <span
                className={`text-sm ${
                  post.published ? 'text-green-600' : 'text-yellow-600'
                }`}
              >
                {post.published ? 'Published' : 'Draft'}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
} 