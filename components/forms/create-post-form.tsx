"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { createPostAction, type PostFormState } from "@/actions/post";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState: PostFormState = {};

type CategoryOption = {
  id: string;
  name: string;
};

export function CreatePostForm({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const [state, formAction] = useActionState(createPostAction, initialState);

  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [router, state.redirectTo]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-900">Title</label>
        <Input
          name="title"
          placeholder="Enter a descriptive title..."
          required
          minLength={4}
          className="h-12 text-lg"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-900">Category</label>
      <Select name="categoryId" required defaultValue="">
        <option value="" disabled>
          选择一个分类
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-900">Excerpt</label>
        <Textarea name="excerpt" placeholder="Write a short summary..." required className="min-h-[110px]" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-900">Content</label>
        <Textarea
          name="content"
          placeholder="Write your post content here..."
          className="min-h-[400px]"
          required
        />
        <p className="text-xs text-muted-foreground">Markdown supported</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-900">Cover Image (Optional)</label>
        <div className="cursor-pointer rounded-lg border-2 border-dashed border-border bg-muted p-8 text-center transition-colors hover:border-primary/40">
          <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
          <p className="mt-1 text-xs text-slate-500">PNG, JPG up to 5MB</p>
        </div>
      </div>
      {state.error ? (
        <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <div className="flex gap-3 pt-2">
        <SubmitButton pendingLabel="发布中..." size="lg" className="flex-1">
          Publish Post
        </SubmitButton>
      </div>
    </form>
  );
}
