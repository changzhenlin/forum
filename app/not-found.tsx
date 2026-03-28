import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">404</p>
      <h1 className="font-serif text-6xl font-semibold">页面不存在</h1>
      <p className="max-w-xl text-muted-foreground">
        这个链接可能已经失效，或者内容尚未发布。你可以回到首页继续浏览论坛。
      </p>
      <Link href="/">
        <Button size="lg">返回首页</Button>
      </Link>
    </div>
  );
}
