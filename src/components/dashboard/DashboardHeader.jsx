"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUpCircle, Bell, ChevronDown, Coins, LogOut, Menu, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import NotificationPanel from "./NotificationPanel";
import Avatar from "@/components/ui/Avatar";
import { useDashboard } from "@/context/DashboardContext";

export default function DashboardHeader({ title, subtitle }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const { openMobileMenu } = useDashboard();
  const router = useRouter();
  const userMenuRef = useRef(null);

  const { data: notifData } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/notifications");
      return res.data;
    },
    enabled: !!user,
    refetchInterval: 15000,
  });

  const hasUnread = (notifData?.unreadCount ?? 0) > 0;

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex min-h-16 sm:min-h-20 items-center justify-between gap-2.5 px-3.5 py-2.5 sm:px-6 md:px-8">
        {/* Left: Mobile hamburger button + Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {openMobileMenu && (
            <button
              onClick={openMobileMenu}
              className="grid size-9 place-items-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent lg:hidden shrink-0 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </button>
          )}

          <div className="min-w-0">
            <h1 className="truncate text-base sm:text-2xl md:text-3xl font-bold">{title}</h1>
            {subtitle && (
              <p className="hidden text-xs text-muted-foreground sm:block truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Coin badge */}
          <span className="flex items-center gap-1 sm:gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold text-amber-500 shrink-0">
            <Coins className="size-3.5" />
            <span className="max-w-[65px] sm:max-w-none truncate">{(user?.coins ?? 0).toLocaleString()}</span>
            <span className="hidden sm:inline"> coins</span>
          </span>

          {/* Notification bell */}
          <div className="relative">
            <button
              className="relative grid size-9 sm:size-10 place-items-center rounded-lg text-foreground transition-colors hover:bg-accent cursor-pointer"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Open notifications"
            >
              <Bell className="size-4 sm:size-5" />
              {hasUnread && (
                <span className="absolute right-2 top-2 size-2 rounded-full bg-danger ring-2 ring-background animate-pulse" />
              )}
            </button>
            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* User info dropdown (responsive for all screens) */}
          <div className="relative flex items-center border-l border-border pl-1.5 sm:pl-3" ref={userMenuRef}>
            <button
              className="flex items-center gap-2 rounded-lg p-1 sm:px-2 sm:py-1 transition-colors hover:bg-accent cursor-pointer"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User account menu"
            >
              <Avatar
                src={user?.photoUrl || user?.image || user?.avatar}
                alt={user?.name || "User"}
                size="sm"
              />
              <span className="hidden text-left md:block">
                <b className="block text-xs truncate max-w-[120px]">{user?.name || "User"}</b>
                <small className="block text-[10px] capitalize text-muted-foreground">
                  {user?.role?.toLowerCase() || "worker"}
                </small>
              </span>
              <ChevronDown className={`size-3.5 sm:size-4 text-muted-foreground transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2">
                <div className="border-b border-border px-3 py-2 mb-1">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {user?.email || ""}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-[10px]">
                    <span className="font-semibold uppercase tracking-wider text-primary">
                      {user?.role || "WORKER"}
                    </span>
                    <span className="text-amber-500 font-medium">
                      {(user?.coins ?? 0).toLocaleString()} coins
                    </span>
                  </div>
                </div>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <User className="size-4 text-muted-foreground" />
                  My Profile
                </Link>

                {user?.role?.toUpperCase() === "WORKER" && (
                  <Link
                    href="/dashboard/worker/upgrade"
                    onClick={() => setShowUserMenu(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    <ArrowUpCircle className="size-4 text-primary" />
                    Become a Buyer
                  </Link>
                )}

                <div className="my-1 h-px bg-border" />

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="size-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
