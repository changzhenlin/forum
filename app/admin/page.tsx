import { FileText, MessageCircle, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminDashboardData } from "@/lib/data";

export default async function AdminDashboardPage() {
  const { stats, recentUsers, recentPosts } = await getAdminDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Welcome back! Here&apos;s what&apos;s happening with your forum.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: stats.usersCount, icon: Users, tone: "bg-blue-100 text-blue-600", change: "+12%" },
          { label: "Total Posts", value: stats.postsCount, icon: FileText, tone: "bg-teal-100 text-teal-600", change: "+8%" },
          { label: "Total Comments", value: stats.commentsCount, icon: MessageCircle, tone: "bg-purple-100 text-purple-600", change: "+15%" },
          { label: "Engagement", value: `${stats.publishedCount > 0 ? 73 : 0}%`, icon: TrendingUp, tone: "bg-green-100 text-green-600", change: "+5%" }
        ].map((stat) => (
          <Card key={stat.label} className="border-border shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.tone}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border shadow-sm">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Recent Users</h2>
            {recentUsers.map((user) => (
              <div key={user.id} className="rounded-lg border-b border-slate-100 pb-4 last:border-0">
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Recent Posts</h2>
            {recentPosts.map((post) => (
              <div key={post.id} className="rounded-lg border-b border-slate-100 pb-4 last:border-0">
                <p className="font-medium">{post.title}</p>
                <p className="text-sm text-muted-foreground">
                  {post.author.username} · {post.category.name}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
