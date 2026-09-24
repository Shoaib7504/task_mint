"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/**
 * /dashboard — redirects to the role-specific home page.
 */
export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const role = (user?.role || "WORKER").toUpperCase();
    if (role === "ADMIN") {
      router.push("/dashboard/admin");
    } else if (role === "BUYER") {
      router.push("/dashboard/buyer");
    } else {
      router.push("/dashboard/worker");
    }
  }, [isLoading, isLoggedIn, user, router]);

  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <div className="mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-3 text-sm text-muted-foreground">Redirecting…</p>
      </div>
    </div>
  );
}
