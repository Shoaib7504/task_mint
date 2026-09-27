"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Hourglass,
  UserRoundCog,
  SlidersHorizontal,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import Avatar from "@/components/ui/Avatar";

const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

const statusTone = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

const statusIcon = {
  PENDING: Hourglass,
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
};

export default function AdminRoleRequestsPage() {
  const [filter, setFilter] = useState("PENDING");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["roleRequests", filter],
    queryFn: async () => {
      const res = await axiosSecure.get("/role-requests", {
        params: { status: filter },
      });
      return res.data;
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/role-requests/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleRequests"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });

  const requests = data?.requests || [];

  return (
    <>
      <DashboardHeader
        title="Role Upgrade Requests"
        subtitle="Review worker requests to become buyers. Approve to grant posting privileges."
      />
      <main className="mx-auto max-w-[1400px] space-y-6 p-4 md:p-8">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Loading requests…
          </div>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <UserRoundCog className="mx-auto mb-3 size-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No {filter === "ALL" ? "" : filter.toLowerCase()} requests found.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {requests.map((req) => {
              const Icon = statusIcon[req.status] || Hourglass;
              return (
                <Card
                  key={req.id}
                  className="relative overflow-hidden border-border transition-shadow hover:shadow-card"
                >
                  <CardContent className="p-5">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={req.user?.photoUrl}
                          alt={req.user?.fullName || "Worker"}
                          size="md"
                        />
                        <div>
                          <p className="font-semibold leading-tight">
                            {req.user?.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {req.user?.email}
                          </p>
                        </div>
                      </div>
                      <StatusBadge tone={statusTone[req.status]}>
                        <Icon className="mr-1 inline size-3" />
                        {req.status.charAt(0) + req.status.slice(1).toLowerCase()}
                      </StatusBadge>
                    </div>

                    {/* Meta */}
                    <div className="mt-4 grid grid-cols-2 gap-y-1 text-xs text-muted-foreground">
                      <span>Coins</span>
                      <span className="font-medium text-foreground">
                        {req.user?.coins?.toLocaleString() ?? 0}
                      </span>
                      <span>Requested</span>
                      <span className="font-medium text-foreground">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                      {req.note && (
                        <>
                          <span className="col-span-2 mt-1 font-medium text-foreground">
                            Note:
                          </span>
                          <span className="col-span-2 italic">"{req.note}"</span>
                        </>
                      )}
                    </div>

                    {/* Actions — only for pending */}
                    {req.status === "PENDING" && (
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          disabled={resolveMutation.isPending}
                          onClick={() =>
                            resolveMutation.mutate({ id: req.id, status: "APPROVED" })
                          }
                        >
                          <CheckCircle2 className="mr-1.5 size-3.5" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-danger/40 text-danger hover:bg-danger/5"
                          disabled={resolveMutation.isPending}
                          onClick={() =>
                            resolveMutation.mutate({ id: req.id, status: "REJECTED" })
                          }
                        >
                          <XCircle className="mr-1.5 size-3.5" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
