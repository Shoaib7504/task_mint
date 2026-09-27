"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Brand from "../brand/Brand";
import {
  ArrowUpCircle,
  ArrowUpRight,
  ChevronDown,
  Coins,
  Compass,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";

const navLinks = [
  { label: "How it Works", href: "/#how-it-works", icon: Compass },
  { label: "Browse tasks", href: "/tasks", icon: Sparkles },
  { label: "Top workers", href: "/#top-workers", icon: Users },
];

const emptySubscribe = () => () => {};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const {
    user,
    role,
    isAdmin,
    isBuyer,
    isWorker,
    isLoggedIn,
    isLoading,
    logout,
  } = useUser();

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll and listen for Escape key when mobile menu is open
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setOpen(false);
    router.push("/");
  }

  // Role dashboard destination
  const dashboardHref = isAdmin
    ? "/dashboard/admin"
    : isBuyer
    ? "/dashboard/buyer"
    : "/dashboard/worker";

  // Role badge style
  const roleBadgeStyle = isAdmin
    ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
    : isBuyer
    ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
    : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";

  const userAvatar =
    user?.photoUrl || user?.photoURL || user?.image || user?.avatar;

  const coinsFormatted =
    user?.coins !== undefined && user?.coins !== null
      ? Number(user.coins).toLocaleString()
      : null;

  return (
    <header className="sticky top-2 z-40 w-full px-3 sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-border/60 bg-background/85 px-3.5 py-2.5 sm:px-5 sm:py-3 backdrop-blur-md shadow-xs transition-all">
        {/* Brand */}
        <div className="shrink-0">
          <Brand />
        </div>

        {/* ── Desktop nav links ── */}
        <ul className="hidden items-center gap-6 text-sm tracking-tight text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="transition-colors hover:text-foreground font-medium"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Desktop right section ── */}
        <div className="hidden items-center gap-3 md:flex">
          {!mounted || isLoading ? (
            <div className="h-9 w-28 animate-pulse rounded-full bg-accent/60" />
          ) : isLoggedIn ? (
            /* ── Logged-in: User avatar dropdown ── */
            <div className="flex items-center gap-3" ref={dropdownRef}>
              {/* Coins badge */}
              {coinsFormatted !== null && (
                <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500 shadow-xs">
                  <Coins className="size-3.5" />
                  <span>{coinsFormatted}</span>
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 text-sm font-medium text-foreground shadow-xs transition-all hover:bg-accent hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                  id="user-menu-button"
                >
                  <Avatar
                    src={userAvatar}
                    alt={user?.name || "Avatar"}
                    size="sm"
                    ring={false}
                  />

                  <span className="max-w-[120px] truncate hidden lg:inline">
                    {user?.name || "Account"}
                  </span>

                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* ── Desktop Dropdown menu ── */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-60 origin-top-right rounded-xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2">
                    {/* User info header */}
                    <div className="border-b border-border px-3 py-2.5 mb-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email || "No email"}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${roleBadgeStyle}`}
                        >
                          {role || "WORKER"}
                        </span>
                        {coinsFormatted !== null && (
                          <span className="text-[11px] font-medium text-amber-500">
                            {coinsFormatted} coins
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Menu items */}
                    <Link
                      href={dashboardHref}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <LayoutDashboard className="size-4 text-muted-foreground" />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <User className="size-4 text-muted-foreground" />
                      My Profile
                    </Link>

                    {isWorker && (
                      <Link
                        href="/dashboard/worker/upgrade"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                      >
                        <ArrowUpCircle className="size-4 text-primary" />
                        Become a Buyer
                      </Link>
                    )}

                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <Settings className="size-4 text-muted-foreground" />
                      Settings
                    </Link>

                    <div className="my-1 h-px bg-border" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 cursor-pointer"
                    >
                      <LogOut className="size-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── Desktop Not logged in ── */
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-foreground transition-colors hover:text-primary px-3 py-2 rounded-lg"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-brand transition-all hover:brightness-110"
              >
                Get started
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile header controls (right side) ── */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Quick coin badge on mobile header when logged in */}
          {mounted && !isLoading && isLoggedIn && coinsFormatted !== null && (
            <Link
              href={dashboardHref}
              className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-500"
              aria-label="Coins balance"
            >
              <Coins className="size-3.5" />
              <span className="max-w-[70px] truncate">{coinsFormatted}</span>
            </Link>
          )}

          {/* Mobile hamburger button */}
          <button
            className="grid size-10 place-items-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </nav>

      {/* ── Mobile Slide-in Drawer via Portal ── */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
              open
                ? "pointer-events-auto opacity-100 visible"
                : "pointer-events-none opacity-0 invisible"
            }`}
          >
            {/* Backdrop overlay */}
            <div
              className={`fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity duration-300 ${
                open ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-in panel */}
            <div
              className={`fixed right-0 top-0 flex h-dvh max-h-dvh w-[min(20rem,88vw)] flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out ${
                open ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {/* Drawer Header with Brand and Close Button */}
              <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0">
                <Brand />
                <button
                  onClick={() => setOpen(false)}
                  className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Scrollable Drawer Body */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {/* User card if logged in */}
                {isLoggedIn && (
                  <div className="rounded-xl border border-border bg-accent/40 p-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={userAvatar}
                        alt={user?.name || "Avatar"}
                        size="md"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email || "No email"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${roleBadgeStyle}`}
                      >
                        {role || "WORKER"}
                      </span>
                      {coinsFormatted !== null && (
                        <span className="flex items-center gap-1 font-semibold text-amber-500">
                          <Coins className="size-3.5" />
                          {coinsFormatted} coins
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Primary Nav Links */}
                <div className="space-y-1">
                  <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Navigation
                  </p>
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        <Icon className="size-4 text-muted-foreground" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="h-px bg-border" />

                {/* Account / Dashboard Links */}
                {!mounted || isLoading ? (
                  <div className="h-10 w-full animate-pulse rounded-xl bg-accent/40" />
                ) : isLoggedIn ? (
                  <div className="space-y-1">
                    <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Workspace
                    </p>

                    <Link
                      href={dashboardHref}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      <LayoutDashboard className="size-4 text-muted-foreground" />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      <User className="size-4 text-muted-foreground" />
                      My Profile
                    </Link>

                    {isWorker && (
                      <Link
                        href="/dashboard/worker/upgrade"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                      >
                        <ArrowUpCircle className="size-4 text-primary" />
                        Become a Buyer
                      </Link>
                    )}

                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      <Settings className="size-4 text-muted-foreground" />
                      Settings
                    </Link>

                    <div className="pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10 cursor-pointer"
                      >
                        <LogOut className="size-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center justify-center rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-brand transition-all hover:brightness-110"
                    >
                      Get started
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Drawer Footer Safe Spacing */}
              <div className="border-t border-border px-5 py-3 text-center text-xs text-muted-foreground shrink-0">
                TaskMint Micro-Tasks &copy; {new Date().getFullYear()}
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}