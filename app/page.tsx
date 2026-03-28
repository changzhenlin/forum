import Link from "next/link";
import { Flame, PenSquare, Search, TrendingUp, Users } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getHomePageData } from "@/lib/data";

export default async function HomePage() {
  const { categories, featuredPosts, latestPosts } = await getHomePageData();
  const communityNames = ["Design Systems", "Web Development", "Product Management", "Open Source"];
  const topUsers = latestPosts.slice(0, 3).map((post) => post.author);

  return (
    <div className="page-shell space-y-12">
      <section className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-blue-50 px-8 py-12 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">
            Welcome to the Community
          </h1>
          <p className="mb-8 text-lg text-slate-600">
            Share knowledge, connect with experts, and grow together
          </p>
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search for topics, questions, or discussions..."
              className="h-14 rounded-xl bg-white pl-12 text-base shadow-sm"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-slate-900">Trending Topics</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              className="cursor-pointer rounded-lg border border-transparent px-4 py-2 text-sm hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            >
              {category.name}
            </Badge>
          ))}
          {featuredPosts.map((post) => (
            <Badge
              key={post.id}
              className="cursor-pointer rounded-lg border border-transparent px-4 py-2 text-sm hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            >
              #{post.category.slug}
            </Badge>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.85fr_0.95fr]">
        <div className="space-y-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Latest Discussions</h2>
            <select className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-primary/20">
              <option>Latest</option>
              <option>Popular</option>
              <option>Trending</option>
            </select>
          </div>
          {latestPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                  <PenSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">Share Your Ideas</h3>
                <p className="mb-4 text-sm text-slate-600">
                  Start a new discussion and engage with the community
                </p>
                <Link href="/posts/create">
                  <Button className="w-full">Create Post</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="space-y-4 p-6">
              <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <Users className="h-4 w-4 text-primary" />
                Popular Communities
              </h3>
              {communityNames.map((community) => (
                <button
                  key={community}
                  className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 text-xs font-semibold text-white">
                      {community.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{community}</span>
                  </div>
                  <span className="text-xs text-slate-500">{community.length * 42}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="space-y-4 p-6">
              <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <Flame className="h-4 w-4 text-primary" />
                Top Contributors
              </h3>
              {topUsers.map((user) => (
                <Link
                  key={user.id}
                  href={`/users/${user.username}`}
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{user.username}</p>
                    <p className="text-xs text-slate-500">{user.postsCount} posts</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="space-y-4 p-6">
              <h3 className="text-base font-semibold text-slate-900">Pinned</h3>
              {featuredPosts.map((post) => (
                <div key={post.id} className="rounded-lg bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">{post.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{post.excerpt}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
