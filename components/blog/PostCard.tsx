import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
      name: string | null;
      image: string | null;
    };
    tags: { name: string }[];
    _count: {
      likes: number;
      comments: number;
    };
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <Link href={`/posts/${post.id}`}>
        <h3 className="text-xl font-semibold hover:text-gray-600 mb-2">
          {post.title}
        </h3>
      </Link>

      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
        <img
          src={post.author.image || '/default-avatar.png'}
          alt={post.author.name || 'Anonymous'}
          className="w-6 h-6 rounded-full"
        />
        <span>{post.author.name || 'Anonymous'}</span>
        <span>•</span>
        <time>{formatDistanceToNow(new Date(post.createdAt))} ago</time>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {post.content.replace(/<[^>]*>/g, '')}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags/${tag.name}`}
            className="text-sm bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200"
          >
            {tag.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{post._count.likes} likes</span>
        <span>{post._count.comments} comments</span>
      </div>
    </article>
  );
} 