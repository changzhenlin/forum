import { Prisma, PostStatus, UserRole, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

const postBaseInclude = {
  author: true,
  category: true,
  _count: {
    select: {
      comments: true,
      likes: true
    }
  }
} satisfies Prisma.PostInclude;

const fallbackUser = {
  id: "fallback-admin",
  username: "admin",
  email: "admin@forum.local",
  passwordHash: "",
  avatar: null,
  bio: "Forum administrator and community curator.",
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE,
  postsCount: 1,
  commentsCount: 1,
  likesCount: 6,
  createdAt: new Date("2026-03-28T00:00:00.000Z"),
  updatedAt: new Date("2026-03-28T00:00:00.000Z")
};

const fallbackCategories = [
  {
    id: "category-design",
    name: "产品设计",
    slug: "design",
    description: "讨论界面、交互和设计系统。",
    sortOrder: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "category-fullstack",
    name: "全栈开发",
    slug: "fullstack",
    description: "分享 Next.js、数据库和工程实践。",
    sortOrder: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "category-community",
    name: "社区运营",
    slug: "community",
    description: "围绕增长、内容治理和用户体验展开。",
    sortOrder: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const fallbackPost = {
  id: "fallback-post",
  title: "欢迎来到 Minimal Modern Forum",
  slug: "welcome-to-minimal-modern-forum",
  excerpt: "这是论坛的第一篇示例帖子，用来展示首页、详情页和后台数据。",
  content:
    "这个论坛系统使用 Next.js、Prisma 和 MySQL 构建，页面结构按照 Figma 原型落地。你可以继续扩展帖子、评论和后台管理能力。",
  status: PostStatus.PUBLISHED,
  views: 128,
  commentsCount: 1,
  likesCount: 6,
  isPinned: true,
  publishedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  authorId: fallbackUser.id,
  categoryId: fallbackCategories[1].id
};

const fallbackComment = {
  id: "fallback-comment",
  content: "欢迎使用这个论坛模板，后续可以继续加搜索、审核和通知。",
  status: "VISIBLE" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  postId: fallbackPost.id,
  authorId: fallbackUser.id
};

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export async function getCategories() {
  if (!hasDatabaseUrl()) {
    return fallbackCategories;
  }

  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });
}

export async function getHomePageData() {
  if (!hasDatabaseUrl()) {
    const post = {
      ...fallbackPost,
      author: fallbackUser,
      category: fallbackCategories[1],
      _count: { comments: 1, likes: 6 }
    };

    return {
      categories: fallbackCategories,
      featuredPosts: [post],
      latestPosts: [post],
      trendingPosts: [post]
    };
  }

  const [categories, featuredPosts, latestPosts, trendingPosts] = await Promise.all([
    getCategories(),
    prisma.post.findMany({
      where: { status: PostStatus.PUBLISHED, isPinned: true },
      include: postBaseInclude,
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      take: 3
    }),
    prisma.post.findMany({
      where: { status: PostStatus.PUBLISHED },
      include: postBaseInclude,
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      take: 8
    }),
    prisma.post.findMany({
      where: { status: PostStatus.PUBLISHED },
      include: postBaseInclude,
      orderBy: [{ views: "desc" }, { likesCount: "desc" }, { publishedAt: "desc" }],
      take: 5
    })
  ]);

  return { categories, featuredPosts, latestPosts, trendingPosts };
}

export async function getPostBySlug(slug: string) {
  if (!hasDatabaseUrl()) {
    if (slug !== fallbackPost.slug) {
      return null;
    }

    return {
      ...fallbackPost,
      author: fallbackUser,
      category: fallbackCategories[1],
      comments: [
        {
          ...fallbackComment,
          author: fallbackUser
        }
      ],
      likes: []
    };
  }

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
      comments: {
        where: { status: "VISIBLE" },
        include: { author: true },
        orderBy: { createdAt: "asc" }
      },
      likes: true
    }
  });

  return post;
}

export async function getUserProfile(username: string) {
  if (!hasDatabaseUrl()) {
    if (username !== fallbackUser.username) {
      return null;
    }

    return {
      ...fallbackUser,
      posts: [
        {
          ...fallbackPost,
          category: fallbackCategories[1],
          _count: { comments: 1, likes: 6 }
        }
      ]
    };
  }

  return prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        where: { status: PostStatus.PUBLISHED },
        include: {
          category: true,
          _count: { select: { comments: true, likes: true } }
        },
        orderBy: { publishedAt: "desc" },
        take: 6
      }
    }
  });
}

export async function getAdminDashboardData() {
  if (!hasDatabaseUrl()) {
    return {
      stats: {
        usersCount: 1,
        postsCount: 1,
        commentsCount: 1,
        publishedCount: 1,
        draftCount: 0
      },
      recentUsers: [fallbackUser],
      recentPosts: [
        {
          ...fallbackPost,
          author: fallbackUser,
          category: fallbackCategories[1]
        }
      ]
    };
  }

  const [usersCount, postsCount, commentsCount, publishedCount, draftCount, recentUsers, recentPosts] =
    await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
      prisma.post.count({ where: { status: PostStatus.DRAFT } }),
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.post.findMany({
        include: { author: true, category: true },
        orderBy: { createdAt: "desc" },
        take: 5
      })
    ]);

  return {
    stats: { usersCount, postsCount, commentsCount, publishedCount, draftCount },
    recentUsers,
    recentPosts
  };
}

export async function getAdminUsers() {
  if (!hasDatabaseUrl()) {
    return [fallbackUser];
  }

  return prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export async function getAdminPosts() {
  if (!hasDatabaseUrl()) {
    return [
      {
        ...fallbackPost,
        author: fallbackUser,
        category: fallbackCategories[1]
      }
    ];
  }

  return prisma.post.findMany({
    include: { author: true, category: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function getPostCreationData() {
  if (!hasDatabaseUrl()) {
    return { categories: fallbackCategories };
  }

  const categories = await getCategories();
  return { categories };
}

export const adminRoleOptions = [
  { label: "普通用户", value: UserRole.USER },
  { label: "管理员", value: UserRole.ADMIN }
];

export const userStatusOptions = [
  { label: "启用", value: UserStatus.ACTIVE },
  { label: "禁用", value: UserStatus.DISABLED }
];

export const postStatusOptions = [
  { label: "草稿", value: PostStatus.DRAFT },
  { label: "已发布", value: PostStatus.PUBLISHED },
  { label: "已归档", value: PostStatus.ARCHIVED }
];
