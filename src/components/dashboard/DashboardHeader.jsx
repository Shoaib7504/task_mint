"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, Coins, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import NotificationPanel from "./NotificationPanel";

export default function DashboardHeader({ title, subtitle }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
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

  function getInitials(name) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex min-h-20 items-center justify-between gap-3 px-4 py-3 md:px-8">
        {/* Title */}
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold md:text-3xl">{title}</h1>
          {subtitle && (
            <p className="hidden text-xs text-muted-foreground sm:block">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">
          {/* Coin badge */}
          <span className="hidden items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-500 sm:flex">
            <Coins className="size-3.5" />
            {(user?.coins ?? 0).toLocaleString()} coins
          </span>

          {/* Notification bell */}
          <div className="relative">
            <button
              className="relative grid size-10 place-items-center rounded-lg text-foreground transition-colors hover:bg-accent"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Open notifications"
            >
              <Bell className="size-5" />
              {hasUnread && (
                <span className="absolute right-2 top-2 size-2.5 rounded-full bg-danger ring-2 ring-background animate-pulse" />
              )}
            </button>
            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* User info */}
          <div className="relative hidden items-center gap-2 border-l border-border pl-3 md:flex" ref={userMenuRef}>
            <button
              className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-accent"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="avatar-sm">
                {getInitials(user?.name)}
              </span>
              <span className="text-left">
                <b className="block text-xs">{user?.name || "User"}</b>
                <small className="block text-[10px] capitalize text-muted-foreground">
                  {user?.role?.toLowerCase() || "worker"}
                </small>
              </span>
              <ChevronDown className={`size-4 text-muted-foreground transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-500/10"
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
