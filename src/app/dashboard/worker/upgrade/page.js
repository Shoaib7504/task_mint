"use client";

import { useState } from "react";
import {
  ArrowUpCircle,
  CheckCircle2,
  Hourglass,
  XCircle,
  PackagePlus,
  Users,
  ShieldCheck,
  Coins,
  Send,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";

export default function WorkerUpgradePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["myRoleRequest"],
    queryFn: async () => {
      const res = await axiosSecure.get("/role-requests/my");
      return res.data;
    },
    enabled: !!user,
  });

  const requestMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post("/role-requests", { note });
      return res.data;
    },
    onSuccess: (resData) => {
      setMsg({
        text:
          resData.message ||
          "Your request has been submitted to the admin for review!",
        type: "success",
      });
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["myRoleRequest"] });
    },
    onError: (err) => {
      setMsg({
        text:
          err?.response?.data?.message ||
          "Failed to submit request. Please try again.",
        type: "error",
      });
    },
  });

  const roleRequest = data?.request;
  const isAlreadyBuyer = (user?.role || "").toUpperCase() === "BUYER";

  function handleSubmit(e) {
    e.preventDefault();
    requestMutation.mutate();
  }

  return (
    <>
      <DashboardHeader
        title="Become a Buyer"
        subtitle="Upgrade your account to create tasks, hire workers, and grow your projects."
      />

      <main className="mx-auto max-w-[1100px] space-y-5 sm:space-y-8 p-4 md:p-8">
        {/* Hero Header */}
        <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-4 sm:p-6 md:p-10 shadow-card">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" /> Account Upgrade
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground md:text-4xl">
              Turn your ideas into tasks. Hire thousands of workers.
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              As a Buyer on TaskMint, you can publish tasks with customized requirements, review worker submissions, and reward them automatically.
            </p>
          </div>
        </section>

        {/* Status Card / Application Form */}
        <div className="grid gap-5 sm:gap-8 lg:grid-cols-3">
          {/* Main Action Area (2 Cols) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {isLoading ? (
              <Card>
                <CardContent className="p-12 text-center text-sm text-muted-foreground">
                  Checking role upgrade status…
                </CardContent>
              </Card>
            ) : isAlreadyBuyer || roleRequest?.status === "APPROVED" ? (
              /* Approved State */
              <Card className="border-emerald-500/40 bg-emerald-500/5">
                <CardContent className="p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <CheckCircle2 className="size-6 text-emerald-500" />
                      <h3 className="text-xl font-bold text-foreground">
                        You have Buyer privileges!
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your request has been approved by the admin. You can now access all buyer tools to post tasks and manage submissions.
                    </p>
                  </div>
                  <Button asChild className="shrink-0 mt-4 sm:mt-0">
                    <Link href="/dashboard/buyer">
                      Go to Buyer Workspace
                      <ArrowRight className="size-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : roleRequest?.status === "PENDING" ? (
              /* Pending Review State */
              <Card className="border-amber-500/40 bg-amber-500/5">
                <CardContent className="p-8 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="grid size-12 place-items-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                      <Hourglass className="size-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-foreground">
                          Request Under Admin Review
                        </h3>
                        <StatusBadge tone="warning">Pending</StatusBadge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Your request to become a buyer was submitted on{" "}
                        <strong>
                          {new Date(roleRequest.createdAt).toLocaleDateString()}
                        </strong>
                        . An administrator will review your application shortly.
                      </p>
                    </div>
                  </div>

                  {roleRequest.note && (
                    <div className="rounded-xl border border-amber-500/20 bg-background/60 p-4">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Your Submission Note:
                      </p>
                      <p className="mt-1 text-sm italic text-foreground">
                        &ldquo;{roleRequest.note}&rdquo;
                      </p>
                    </div>
                  )}

                  <div className="border-t border-border pt-4 text-xs text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="size-4 text-primary" />
                    You will receive an in-app notification once the administrator approves or reviews your request.
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Request Form (Not requested OR Rejected) */
              <Card>
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Submit Your Buyer Upgrade Request
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fill out this quick request. Our admins review and activate buyer permissions quickly.
                    </p>
                  </div>

                  {roleRequest?.status === "REJECTED" && (
                    <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
                      <XCircle className="size-5 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">
                          Your previous request was not approved
                        </strong>
                        <span className="text-xs opacity-90">
                          You may provide additional context or project details below and submit a new request.
                        </span>
                      </div>
                    </div>
                  )}

                  {msg.text && (
                    <div
                      className={`rounded-xl border p-4 text-sm font-medium ${
                        msg.type === "success"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                          : "border-danger/30 bg-danger/10 text-danger"
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="note" className="text-xs font-semibold">
                        What tasks do you plan to post? (Optional Note to Admin)
                      </Label>
                      <Textarea
                        id="note"
                        rows={4}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="e.g., I run an e-commerce shop and need workers to review products, test mobile app signups, and engage on social media."
                        className="resize-none"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Explaining your use case helps the admin approve your request faster.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={requestMutation.isPending}
                      className="w-full sm:w-auto px-8"
                    >
                      <Send className="size-4 mr-2" />
                      {requestMutation.isPending
                        ? "Submitting Request…"
                        : "Submit Buyer Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Buyer Feature Highlights */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-border/60">
                <CardContent className="p-5 space-y-2">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <PackagePlus className="size-5" />
                  </div>
                  <h4 className="font-semibold text-sm">Post Unlimited Tasks</h4>
                  <p className="text-xs text-muted-foreground">
                    Define submission guidelines, required proofs, and reward amounts in coins.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardContent className="p-5 space-y-2">
                  <div className="grid size-10 place-items-center rounded-xl bg-info/10 text-info">
                    <Users className="size-5" />
                  </div>
                  <h4 className="font-semibold text-sm">Hire Global Workers</h4>
                  <p className="text-xs text-muted-foreground">
                    Reach active micro-task workers ready to complete your assignments 24/7.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardContent className="p-5 space-y-2">
                  <div className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
                    <Coins className="size-5" />
                  </div>
                  <h4 className="font-semibold text-sm">Easy Coin Top-Ups</h4>
                  <p className="text-xs text-muted-foreground">
                    Purchase coin packages safely via Stripe card payments to fund your campaigns.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar / FAQ (1 Col) */}
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="size-4 text-primary" />
                  <h3 className="font-bold text-base text-foreground">
                    Upgrade FAQ
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <h5 className="font-semibold text-foreground">
                      What happens to my coins?
                    </h5>
                    <p className="text-muted-foreground mt-0.5">
                      Your current coins balance remains completely intact. You can use your coins to fund new tasks or withdraw anytime.
                    </p>
                  </div>

                  <div className="border-t border-border pt-3">
                    <h5 className="font-semibold text-foreground">
                      How long does approval take?
                    </h5>
                    <p className="text-muted-foreground mt-0.5">
                      Admins review role requests on a rolling basis, typically within a few hours.
                    </p>
                  </div>

                  <div className="border-t border-border pt-3">
                    <h5 className="font-semibold text-foreground">
                      Can I still submit tasks as a worker?
                    </h5>
                    <p className="text-muted-foreground mt-0.5">
                      Once upgraded to Buyer, your primary dashboard will be the Buyer dashboard for posting and reviewing tasks.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/20 border-dashed">
              <CardContent className="p-4 sm:p-6 text-center space-y-3">
                <ShieldCheck className="size-8 mx-auto text-emerald-500" />
                <h4 className="font-bold text-sm">Safe & Verified</h4>
                <p className="text-xs text-muted-foreground">
                  TaskMint verifies buyer accounts to maintain high-quality opportunities for our worker community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
