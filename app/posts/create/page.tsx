import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CreatePostForm } from "@/components/forms/create-post-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPostCreationData } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";

export default async function CreatePostPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { categories } = await getPostCreationData();

  return (
    <div className="page-shell space-y-8">
      <div className="space-y-4">
        <Link href="/">
          <Button variant="ghost" className="px-0 text-slate-600 hover:bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create New Post</h1>
          <p className="mt-2 text-slate-600">Share your thoughts with the community</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.75fr_0.8fr]">
        <Card className="border-border shadow-sm">
          <CardContent className="p-8">
            <CreatePostForm categories={categories} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardContent className="space-y-3 p-6">
              <h3 className="font-semibold text-slate-900">Writing Tips</h3>
              {[
                "Choose a clear, descriptive title",
                "Select the most relevant category",
                "Use proper formatting for readability",
                "Add code examples when applicable",
                "Be respectful and constructive"
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-0.5 text-primary">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="space-y-3 p-6">
              <h3 className="font-semibold text-slate-900">Markdown Guide</h3>
              {["# Heading", "**bold**", "*italic*", "`code`"].map((item) => (
                <code key={item} className="block rounded bg-muted px-2 py-1 text-xs text-slate-600">
                  {item}
                </code>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
