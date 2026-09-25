"use client";

import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DataTable from "@/components/dashboard/DataTable";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";

export default function AdminUsersPage() {
  const [deleteUser, setDeleteUser] = useState(null);
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers", query],
    queryFn: async () => {
      const res = await axiosSecure.get("/users", {
        params: { search: query || undefined, limit: 50 },
      });
      return res.data;
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      await axiosSecure.patch(`/users/${id}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setDeleteUser(null);
    },
  });

  const users = data?.users || [];

  const rows = users.map((u) => [
    <div className="avatar-sm" key={`av-${u.id}`}>
      {u.fullName?.split(" ").map((x) => x[0]).join("") || "U"}
    </div>,
    u.fullName,
    u.email,
    <Select
      key={`role-${u.id}`}
      defaultValue={u.role}
      className="w-28"
      onChange={(e) => roleMutation.mutate({ id: u.id, role: e.target.value })}
      disabled={roleMutation.isPending}
    >
      <option value="WORKER">Worker</option>
      <option value="BUYER">Buyer</option>
      <option value="ADMIN">Admin</option>
    </Select>,
    `${u.coins.toLocaleString()} coins`,
    <Button
      key={`del-${u.id}`}
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
        subtitle="Manage accounts, change roles, and remove users."
      />
      <main className="mx-auto max-w-[1500px] space-y-6 p-4 md:p-8">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading users...</div>
        ) : (
          <DataTable
            headers={["Avatar", "Name", "Email", "Role", "Coins", "Actions"]}
            rows={rows}
            total={users.length}
          />
        )}
      </main>

      {/* Delete User confirmation dialog */}
      {deleteUser && (
        <Dialog open={true} onOpenChange={() => setDeleteUser(null)}>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete {deleteUser.fullName} ({deleteUser.email})?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(deleteUser.id)}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
}
