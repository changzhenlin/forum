import Link from "next/link";
import { registerAction } from "@/actions/auth";
import { SubmitButton } from "@/components/forms/submit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  return (
    <div className="page-shell flex justify-center">
      <Card className="w-full max-w-lg">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <h1 className="font-serif text-4xl font-semibold">注册账号</h1>
            <p className="text-sm text-muted-foreground">创建一个论坛账号，开始发帖和互动。</p>
          </div>
          <form action={registerAction} className="space-y-4">
            <Input name="username" placeholder="用户名" required />
            <Input name="email" type="email" placeholder="邮箱" required />
            <Input name="password" type="password" placeholder="密码" required />
            <Input name="confirmPassword" type="password" placeholder="确认密码" required />
            <SubmitButton pendingLabel="注册中..." className="w-full">
              注册并登录
            </SubmitButton>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            已有账号？
            <Link href="/login" className="ml-2 font-medium text-foreground underline">
              去登录
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
