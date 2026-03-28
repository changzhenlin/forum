import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@forum.local" },
    update: {},
    create: {
      username: "admin",
      email: "admin@forum.local",
      passwordHash,
      role: UserRole.ADMIN,
      bio: "Forum administrator and community curator."
    }
  });

  const categories = await Promise.all(
    [
      {
        name: "产品设计",
        slug: "design",
        description: "讨论界面、交互和设计系统。"
      },
      {
        name: "全栈开发",
        slug: "fullstack",
        description: "分享 Next.js、数据库和工程实践。"
      },
      {
        name: "社区运营",
        slug: "community",
        description: "围绕增长、内容治理和用户体验展开。"
      }
    ].map((category, index) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: { ...category, sortOrder: index + 1 }
      })
    )
  );

  const demoPost = await prisma.post.upsert({
    where: { slug: "welcome-to-minimal-modern-forum" },
    update: {},
    create: {
      title: "欢迎来到 Minimal Modern Forum",
      slug: "welcome-to-minimal-modern-forum",
      excerpt: "这是论坛的第一篇示例帖子，用来展示首页、详情页和后台数据。",
      content:
        "这个论坛系统使用 Next.js、Prisma 和 MySQL 构建，页面结构按照 Figma 原型落地。你可以继续扩展帖子、评论和后台管理能力。",
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: categories[1].id,
      views: 128,
      likesCount: 6
    }
  });

  await prisma.comment.upsert({
    where: { id: "seed-comment-1" },
    update: {},
    create: {
      id: "seed-comment-1",
      content: "欢迎使用这个论坛模板，后续可以继续加搜索、审核和通知。",
      postId: demoPost.id,
      authorId: admin.id
    }
  });

  await prisma.user.update({
    where: { id: admin.id },
    data: {
      postsCount: await prisma.post.count({ where: { authorId: admin.id } }),
      commentsCount: await prisma.comment.count({ where: { authorId: admin.id } }),
      likesCount: await prisma.postLike.count({ where: { userId: admin.id } })
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
