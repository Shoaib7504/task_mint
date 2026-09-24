"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/dashboard/Sidebar";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoading } = useAuth();

  const role = user?.role || "WORKER";

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface">
        <div className="text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Desktop sidebar ── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-card lg:block">
        <Sidebar role={role} />
      </aside>

      {/* ── Mobile sidebar sheet ── */}
      <Sheet open={mobileOpen} onClose={() => setMobileOpen(false)} side="left">
        <Sidebar role={role} onClose={() => setMobileOpen(false)} />
      </Sheet>

      {/* ── Main content area ── */}
      <div className="lg:pl-64">
        {/* Mobile menu button — sits inside the first header rendered by each page */}
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu />
          </Button>
          <span className="text-sm font-semibold">TaskMint</span>
        </div>

        {children}
      </div>
    </div>
  );
}
