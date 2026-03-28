"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/schemas/auth";
import { signIn } from "@/lib/auth";

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "注册失败");
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: parsed.data.email }, { username: parsed.data.username }]
    }
  });

  if (existing) {
    throw new Error("用户名或邮箱已存在");
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      username: parsed.data.username,
      email: parsed.data.email,
      passwordHash
    }
  });

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirect: false
  });

  redirect("/");
}
