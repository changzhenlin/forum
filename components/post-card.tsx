import Link from "next/link";
import { Eye, Heart, MessageSquare } from "lucide-react";
import type { Category, Post, User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

type PostCardProps = {
  post: Post & {
    author: User;
    category: Category;
    _count?: {
      comments: number;
      likes: number;
    };
  };
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="border-border shadow-sm transition-colors hover:border-primary/20">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-center justify-between gap-3">
          <Badge className="border-0 bg-teal-50 text-teal-700">{post.category.name}</Badge>
          <span className="text-xs text-muted-foreground">
            {formatDate(post.publishedAt ?? post.createdAt)}
          </span>
        </div>

        <div className="space-y-2">
          <Link href={`/posts/${post.slug}`} className="block">
            <h3 className="text-xl font-semibold leading-tight text-slate-900 hover:text-primary">
              {post.title}
            </h3>
          </Link>
          <p className="text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <Link href={`/users/${post.author.username}`} className="font-medium text-slate-900">
            {post.author.username}
          </Link>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views}
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {post.likesCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {post._count?.comments ?? post.commentsCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
