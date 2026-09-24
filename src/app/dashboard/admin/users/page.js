"use client";

import { useState } from "react";
import { Filter, MoreHorizontal, Search, Trash2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DataTable from "@/components/dashboard/DataTable";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { users } from "@/lib/dashboardData";

export default function AdminUsersPage() {
  const [deleteUser, setDeleteUser] = useState(null);
  const [query, setQuery] = useState("");

  function handleRoleChange(user, newRole) {
    console.log("Update role:", { userName: user.name, email: user.email, oldRole: user.role, newRole });
    alert(`Role changed to ${newRole} for ${user.name}. Logged to console.`);
  }

  function handleDelete(user) {
    console.log("Delete user:", { name: user.name, email: user.email });
    alert(`User ${user.name} deleted. Logged to console.`);
    setDeleteUser(null);
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  const rows = filtered.map((u) => [
    <div className="avatar-sm" key={u.email}>
      {u.name.split(" ").map((x) => x[0]).join("")}
    </div>,
    u.name,
    u.email,
    <Select
      key={`role-${u.email}`}
      defaultValue={u.role}
      className="w-28"
      onChange={(e) => handleRoleChange(u, e.target.value)}
    >
      <option value="worker">Worker</option>
      <option value="buyer">Buyer</option>
      <option value="admin">Admin</option>
    </Select>,
    `${u.coins.toLocaleString()}`,
    <Button
      key={`del-${u.email}`}
      size="icon"
      variant="ghost"
      aria-label="Remove user"
      onClick={() => setDeleteUser(u)}
    >
      <Trash2 className="size-4 text-danger" />
    </Button>,
  ]);

  return (
    <>
      <DashboardHeader
        title="Manage users"
        subtitle="Control access, roles, and account health."
      />
      <main className="mx-auto max-w-[1500px] space-y-5 p-4 md:p-8">
        {/* Filter bar */}
        <div className="filter-bar">
          <div className="input-icon flex-1">
            <Search />
            <Input
              placeholder="Search name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="size-4" /> Role
          </Button>
          <Button>Export users</Button>
        </div>

        <DataTable
          headers={["Photo", "Name", "Email", "Role", "Coins", "Actions"]}
          rows={rows}
          total={filtered.length}
        />

        {/* Delete confirmation */}
        <Dialog open={!!deleteUser} onClose={() => setDeleteUser(null)}>
          <DialogHeader>
            <DialogTitle>Remove user?</DialogTitle>
            <DialogDescription>
              This will permanently delete <b>{deleteUser?.name}</b> ({deleteUser?.email}) from the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancel</Button>
            <Button
              className="bg-danger text-white hover:bg-danger/90"
              onClick={() => handleDelete(deleteUser)}
            >
              <Trash2 className="size-4" /> Remove
            </Button>
          </DialogFooter>
        </Dialog>
      </main>
    </>
  );
}
