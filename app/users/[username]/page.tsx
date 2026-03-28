import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PostCard } from "@/components/post-card";
import { getUserProfile } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function UserProfilePage({
  params
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getUserProfile(username);

  if (!profile) {
    notFound();
  }

  return (
    <div className="page-shell space-y-8">
      <Card>
        <CardContent className="grid gap-8 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-10">
          <div className="space-y-4">
            <Badge>{profile.role === "ADMIN" ? "管理员" : "社区成员"}</Badge>
            <h1 className="font-serif text-5xl font-semibold">{profile.username}</h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              {profile.bio ?? "这个用户还没有留下简介。"}
            </p>
            <p className="text-sm text-muted-foreground">加入时间：{formatDate(profile.createdAt)}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-3xl bg-secondary p-5">
              <p className="text-sm text-muted-foreground">帖子</p>
              <p className="mt-2 font-serif text-4xl font-semibold">{profile.postsCount}</p>
            </div>
            <div className="rounded-3xl bg-secondary p-5">
              <p className="text-sm text-muted-foreground">评论</p>
              <p className="mt-2 font-serif text-4xl font-semibold">{profile.commentsCount}</p>
            </div>
            <div className="rounded-3xl bg-secondary p-5">
              <p className="text-sm text-muted-foreground">获赞</p>
              <p className="mt-2 font-serif text-4xl font-semibold">{profile.likesCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-5">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Latest Posts</p>
          <h2 className="mt-2 font-serif text-4xl font-semibold">Ta 的最新帖子</h2>
        </div>
        <div className="space-y-5">
          {profile.posts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                author: profile,
                _count: {
                  comments: post._count.comments,
                  likes: post._count.likes
                }
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
