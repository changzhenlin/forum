import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Heart, MessageSquare, Share2 } from "lucide-react";
import { addCommentAction, toggleLikeAction } from "@/actions/post";
import { CommentList } from "@/components/comment-list";
import { SubmitButton } from "@/components/forms/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getPostBySlug } from "@/lib/data";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export default async function PostDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const session = await auth();

  if (!post) {
    notFound();
  }

  return (
    <div className="page-shell">
      <Link
        href="/"
        className="mb-6 inline-flex items-center justify-center rounded-lg px-0 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-transparent hover:text-slate-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Link>
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.4fr_0.7fr]">
        <Card className="border-border shadow-sm">
          <CardContent className="space-y-8 p-8 md:p-10">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="border-0 bg-teal-50 text-teal-700">{post.category.name}</Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </span>
              </div>
              <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                {post.title}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
            </div>

            <div className="whitespace-pre-wrap text-base leading-8 text-slate-700">
              {post.content}
            </div>

            <div className="flex flex-wrap items-center gap-5 border-t border-border pt-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {post.views} 浏览
              </span>
              <span className="inline-flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {post.comments.length} 评论
              </span>
              <form action={toggleLikeAction}>
                <input type="hidden" name="postId" value={post.id} />
                <input type="hidden" name="slug" value={post.slug} />
                <Button variant="outline" type="submit" disabled={!session?.user}>
                  <Heart className="mr-2 h-4 w-4" />
                  {post.likesCount} 点赞
                </Button>
              </form>
              <Button variant="outline" type="button">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardContent className="space-y-4 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                About the Author
              </p>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-2xl font-semibold text-slate-700">
                  {post.author.username.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-semibold text-slate-900">{post.author.username}</h2>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {post.author.bio ?? "这个用户还没有留下个人简介。"}
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-lg font-semibold text-slate-900">{post.author.postsCount}</p>
                  <p className="text-xs text-slate-500">Posts</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-lg font-semibold text-slate-900">{post.author.likesCount}</p>
                  <p className="text-xs text-slate-500">Likes</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-lg font-semibold text-slate-900">{post.author.commentsCount}</p>
                  <p className="text-xs text-slate-500">Comments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold text-slate-900">发表评论</h2>
              {session?.user ? (
                <form action={addCommentAction} className="space-y-4">
                  <input type="hidden" name="postId" value={post.id} />
                  <Textarea name="content" placeholder="写下你的观点..." required />
                  <SubmitButton pendingLabel="提交中...">提交评论</SubmitButton>
                </form>
              ) : (
                <p className="text-sm text-muted-foreground">登录后即可参与评论与点赞。</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl space-y-5">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Comments</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            评论区 ({post.comments.length})
          </h2>
        </div>
        <CommentList comments={post.comments} />
      </div>
    </div>
  );
}
