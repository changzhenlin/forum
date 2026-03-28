# Minimal Modern Forum

一个基于 Next.js、Prisma 和 MySQL 的全栈论坛系统，按照 Figma 原型的信息架构实现，包含前台论坛与后台管理。

## 技术栈

- Next.js App Router
- TypeScript
- Prisma
- MySQL
- Auth.js Credentials
- Tailwind CSS

## 本地启动

1. 安装依赖
   `npm install`
2. 复制环境变量
   `cp .env.example .env`
3. 修改 `.env` 中的 `DATABASE_URL` 和 `AUTH_SECRET`
4. 初始化数据库
   `npm run db:setup`
5. 启动开发环境
   `npm run dev`

## 默认种子账号

- 邮箱: `admin@forum.local`
- 密码: `Admin123!`

## 主要页面

- `/` 首页
- `/login` 登录
- `/register` 注册
- `/posts/create` 发帖
- `/posts/[slug]` 帖子详情
- `/users/[username]` 用户主页
- `/admin` 后台仪表盘
- `/admin/users` 用户管理
- `/admin/posts` 帖子管理

## 数据库说明

- 建库脚本位于 [scripts/db-setup.ts](/Users/tyler/Project/codex/forum/scripts/db-setup.ts)
- Prisma schema 位于 [prisma/schema.prisma](/Users/tyler/Project/codex/forum/prisma/schema.prisma)
- 可直接执行的 SQL 位于 [prisma/migrations/20260328130000_init/migration.sql](/Users/tyler/Project/codex/forum/prisma/migrations/20260328130000_init/migration.sql)
