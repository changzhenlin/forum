import Link from "next/link";
import { Search } from "lucide-react";
import type { Route } from "next";
import { BarChart3, FileText, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

const links = [
  { href: "/admin", label: "仪表盘", icon: BarChart3 },
  { href: "/admin/users", label: "用户管理", icon: Users },
  { href: "/admin/posts", label: "帖子管理", icon: FileText }
] satisfies Array<{ href: Route; label: string; icon: typeof BarChart3 }>;

export function AdminShell({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-border bg-[#f8fafc] p-5">
        <p className="mb-4 text-xl font-semibold text-slate-900">Admin Panel</p>
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search..." className="pl-10" />
        </div>
        <nav className="space-y-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
