import { updateUserRoleAction } from "@/actions/post";
import { SubmitButton } from "@/components/forms/submit-button";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { adminRoleOptions, getAdminUsers, userStatusOptions } from "@/lib/data";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Users Management</h1>
        <p className="mt-2 text-slate-600">Manage all registered users</p>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="border-b border-border p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search by name or email..." className="pl-10" />
          </div>
        </CardContent>
        <CardContent className="space-y-0 p-0">
        {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-4 border-b border-slate-100 p-6 last:border-0 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <form action={updateUserRoleAction} className="flex flex-col gap-3 md:flex-row">
                <input type="hidden" name="userId" value={user.id} />
                <Select name="role" defaultValue={user.role}>
                  {adminRoleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <Select name="status" defaultValue={user.status}>
                  {userStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <SubmitButton pendingLabel="保存中..." variant="outline">
                  保存
                </SubmitButton>
              </form>
            </div>
        ))}
        </CardContent>
      </Card>
    </div>
  );
}
