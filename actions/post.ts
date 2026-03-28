"use server";

import { revalidatePath } from "next/cache";
import { PostStatus, UserRole, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin, requireUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { commentSchema, createPostSchema } from "@/schemas/post";

export type PostFormState = {
  error?: string;
  redirectTo?: string;
};

export async function createPostAction(
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  let user;

  try {
    user = await requireUser();
  } catch {
    return { error: "请先登录后再发布帖子" };
  }

  const parsed = createPostSchema.safeParse({
    title: formData.get("title"),
    categoryId: formData.get("categoryId"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "帖子创建失败" };
  }

  const baseSlug = slugify(parsed.data.title);
  const similarCount = await prisma.post.count({
    where: {
      slug: {
        startsWith: baseSlug
      }
    }
  });
  const slug = similarCount ? `${baseSlug}-${similarCount + 1}` : baseSlug;

  const post = await prisma.post.create({
    data: {
      ...parsed.data,
      slug,
      authorId: user.id,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date()
    }
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { postsCount: { increment: 1 } }
  });

  revalidatePath("/");
  revalidatePath(`/users/${user.username}`);
  return {
    redirectTo: `/posts/${post.slug}`
  };
}

export async function addCommentAction(formData: FormData) {
  const user = await requireUser();

  const parsed = commentSchema.safeParse({
    postId: formData.get("postId"),
    content: formData.get("content")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "评论失败");
  }

  const post = await prisma.post.findUnique({ where: { id: parsed.data.postId } });

  if (!post) {
    throw new Error("帖子不存在");
  }

  await prisma.comment.create({
    data: {
      postId: parsed.data.postId,
      authorId: user.id,
      content: parsed.data.content
    }
  });

  await prisma.post.update({
    where: { id: post.id },
    data: { commentsCount: { increment: 1 } }
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { commentsCount: { increment: 1 } }
  });

  revalidatePath(`/posts/${post.slug}`);
}

export async function toggleLikeAction(formData: FormData) {
  const user = await requireUser();
  const postId = String(formData.get("postId") ?? "");
  const slug = String(formData.get("slug") ?? "");

  if (!postId || !slug) {
    throw new Error("参数缺失");
  }

  const existing = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: user.id
      }
    }
  });

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
    await prisma.post.update({
      where: { id: postId },
      data: { likesCount: { decrement: 1 } }
    });
  } else {
    await prisma.postLike.create({
      data: { postId, userId: user.id }
    });
    await prisma.post.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } }
    });
  }

  revalidatePath(`/posts/${slug}`);
  revalidatePath("/");
}

export async function updateUserRoleAction(formData: FormData) {
  await requireAdmin();

  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "") as UserRole;
  const status = String(formData.get("status") ?? "") as UserStatus;

  if (!userId) {
    throw new Error("用户不存在");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role, status }
  });

  revalidatePath("/admin/users");
}

export async function updatePostMetaAction(formData: FormData) {
  await requireAdmin();

  const postId = String(formData.get("postId") ?? "");
  const status = String(formData.get("status") ?? "") as PostStatus;
  const isPinned = formData.get("isPinned") === "true";

  if (!postId) {
    throw new Error("帖子不存在");
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      status,
      isPinned,
      publishedAt: status === PostStatus.PUBLISHED ? new Date() : null
    }
  });

  revalidatePath("/admin/posts");
  revalidatePath("/");
}
