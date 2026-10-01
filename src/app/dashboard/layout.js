"use client";

import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/dashboard/Sidebar";
import { Sheet } from "@/components/ui/Sheet";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";

function DashboardLayoutContent({ children }) {
  const { mobileOpen, closeMobileMenu } = useDashboard();
  const { user } = useAuth();

  const role = user?.role || "WORKER";
  const coins = user?.coins ?? 0;

  return (
    <div className="min-h-screen bg-surface flex flex-col w-full max-w-full overflow-x-clip">
      {/* ── Desktop sidebar ── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-card lg:block">
        <Sidebar role={role} coins={coins} />
      </aside>

      {/* ── Mobile sidebar sheet ── */}
      <Sheet open={mobileOpen} onClose={closeMobileMenu} side="left">
        <Sidebar role={role} coins={coins} onClose={closeMobileMenu} />
      </Sheet>

      {/* ── Main content area ── */}
      <div className="min-w-0 w-full flex-1 lg:pl-64 flex flex-col overflow-x-clip">
        {children}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  );
}
