import { prisma } from '../../../lib/prisma';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { auth } from '@clerk/nextjs';
import { PostStats } from '../../../components/blog/PostStats';
import { ReadingTime } from '../../../components/blog/ReadingTime';
import { RecommendedPosts } from '../../../components/blog/RecommendedPosts';

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: { name: true, image: true }
      },
      tags: true,
      _count: {
        select: { likes: true, comments: true }
      }
    }
  });

  if (!post) notFound();
  return post;
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  const { userId } = auth();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <article>
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center gap-2 mb-8 text-gray-500">
          <img
            src={post.author.image || '/default-avatar.png'}
            alt={post.author.name || 'Anonymous'}
            className="w-8 h-8 rounded-full"
          />
          <span>{post.author.name || 'Anonymous'}</span>
          <span>•</span>
          <time>{formatDistanceToNow(new Date(post.createdAt))} ago</time>
          <span>•</span>
          <ReadingTime content={post.content} />
        </div>

        <div className="prose max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <div className="flex gap-4 mb-8">
          {post.tags.map((tag) => (
            <a
              key={tag.id}
              href={`/tags/${tag.name}`}
              className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
            >
              {tag.name}
            </a>
          ))}
        </div>

        {userId === post.authorId && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Post Statistics</h2>
            <PostStats postId={post.id} />
          </div>
        )}

        <RecommendedPosts
          currentPostId={post.id}
          currentTags={post.tags.map(tag => tag.name)}
        />
      </article>
    </div>
  );
} 