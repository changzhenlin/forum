import type { Comment, User } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function CommentList({
  comments
}: {
  comments: Array<Comment & { author: User }>;
}) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
            {comment.author.username.charAt(0).toUpperCase()}
          </div>
          <Card className="flex-1 border-border shadow-sm">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{comment.author.username}</p>
              <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {comment.content}
            </p>
          </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
