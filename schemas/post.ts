import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(4, "标题至少 4 个字符").max(120, "标题最多 120 个字符"),
  categoryId: z.string().min(1, "请选择分类"),
  excerpt: z.string().min(12, "摘要至少 12 个字符").max(280, "摘要最多 280 个字符"),
  content: z.string().min(30, "正文至少 30 个字符")
});

export const commentSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(3, "评论至少 3 个字符").max(800, "评论最多 800 个字符")
});
