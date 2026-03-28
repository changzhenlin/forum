import { updatePostMetaAction } from "@/actions/post";
import { SubmitButton } from "@/components/forms/submit-button";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getAdminPosts, postStatusOptions } from "@/lib/data";

export default async function AdminPostsPage() {
  const posts = await getAdminPosts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Posts Management</h1>
        <p className="mt-2 text-slate-600">Manage all forum posts</p>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="border-b border-border p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search posts..." className="pl-10" />
          </div>
        </CardContent>
        <CardContent className="space-y-0 p-0">
        {posts.map((post) => (
            <div key={post.id} className="space-y-4 border-b border-slate-100 p-6 last:border-0">
              <div className="space-y-1">
                <p className="font-medium text-slate-900">{post.title}</p>
                <p className="text-sm text-muted-foreground">
                  {post.author.username} · {post.category.name}
                </p>
              </div>
              <form action={updatePostMetaAction} className="flex flex-col gap-3 md:flex-row">
                <input type="hidden" name="postId" value={post.id} />
                <input type="hidden" name="isPinned" value={String(!post.isPinned)} />
                <Select name="status" defaultValue={post.status}>
                  {postStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <SubmitButton pendingLabel="保存中..." variant="outline">
                  {post.isPinned ? "取消置顶并保存" : "置顶并保存"}
                </SubmitButton>
              </form>
            </div>
        ))}
        </CardContent>
      </Card>
    </div>
  );
}
