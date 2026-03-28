import Link from "next/link";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/forms/submit-button";

export default function LoginPage() {
  return (
    <div className="page-shell flex justify-center">
      <Card className="w-full max-w-lg">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <h1 className="font-serif text-4xl font-semibold">登录论坛</h1>
            <p className="text-sm text-muted-foreground">使用邮箱和密码进入你的讨论空间。</p>
          </div>
          <form
            action={async (formData) => {
              "use server";
              await signIn("credentials", {
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
                redirectTo: "/"
              });
            }}
            className="space-y-4"
          >
            <Input type="email" name="email" placeholder="邮箱" required />
            <Input type="password" name="password" placeholder="密码" required />
            <SubmitButton pendingLabel="登录中..." className="w-full">
              登录
            </SubmitButton>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            还没有账号？
            <Link href="/register" className="ml-2 font-medium text-foreground underline">
              立即注册
            </Link>
          </div>
          <Link href="/">
            <Button variant="ghost" className="w-full">
              返回首页
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
