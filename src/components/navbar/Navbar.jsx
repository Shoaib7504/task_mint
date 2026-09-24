"use client";

import { useEffect, useRef, useState } from "react";
import Brand from "../brand/Brand";
import {
  ArrowUpRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Browse tasks", href: "/tasks" },
  { label: "Top workers", href: "#top-workers" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setOpen(false);
    router.push("/");
  }

  /** Get user initials for avatar fallback */
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
    <nav className="sticky top-2 w-11/12 mx-auto flex items-center justify-between px-4 py-3">
      <Brand />

      {/* ── Desktop nav links ── */}
      <ul className="hidden items-center gap-6 text-sm tracking-tight text-muted-foreground md:flex">
        {navLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* ── Desktop right section ── */}
      {!isLoading && (
        <>
          {isLoggedIn ? (
            /* ── Logged-in: User avatar dropdown ── */
            <div className="hidden items-center gap-3 md:flex" ref={dropdownRef}>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-accent hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                  aria-label="User menu"
                  id="user-menu-button"
                >
                  {/* Avatar circle */}
                  <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-bold text-primary-foreground shadow-inner">
                    {getInitials(user?.name)}
                  </span>
                  <span className="max-w-[120px] truncate hidden lg:inline">
                    {user?.name || "Account"}
                  </span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* ── Dropdown menu ── */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right animate-in fade-in slide-in-from-top-2 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                    {/* User info header */}
                    <div className="border-b border-border px-3 py-2.5 mb-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email || "No email"}
                      </p>
                      <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {user?.role}
                      </span>
                    </div>

                    {/* Menu items */}
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <LayoutDashboard className="size-4 text-muted-foreground" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <User className="size-4 text-muted-foreground" />
                      My Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <Settings className="size-4 text-muted-foreground" />
                      Settings
                    </Link>

                    {/* Divider */}
                    <div className="my-1 h-px bg-border" />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut className="size-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── Not logged in: auth buttons ── */
            <ul className="hidden items-center gap-4 md:flex">
              <Link
                href="/login"
                className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
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
            </ul>
          )}
        </>
      )}

      {/* ── Mobile hamburger button ── */}
      <button
        className="relative z-50 grid size-10 place-items-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent md:hidden"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* ── Mobile overlay ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile slide-in panel ── */}
      <div
        className={`fixed right-0 top-0 z-40 flex h-full w-72 flex-col gap-2 border-l border-border bg-card px-6 pb-8 pt-20 shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Logged-in user info in mobile */}
        {!isLoading && isLoggedIn && (
          <>
            <div className="flex items-center gap-3 rounded-xl bg-accent/50 px-4 py-3 mb-2">
              <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-bold text-primary-foreground shadow-inner">
                {getInitials(user?.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || "No email"}
                </p>
              </div>
            </div>
            <div className="my-1 h-px bg-border" />
          </>
        )}

        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setOpen(false)}
            className="rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {link.label}
          </a>
        ))}

        <div className="my-3 h-px bg-border" />

        {!isLoading && isLoggedIn ? (
          /* ── Mobile logged-in menu ── */
          <>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <LayoutDashboard className="size-4 text-muted-foreground" />
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <User className="size-4 text-muted-foreground" />
              My Profile
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Settings className="size-4 text-muted-foreground" />
              Settings
            </Link>

            <div className="my-2 h-px bg-border" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </>
        ) : (
          /* ── Mobile not-logged-in menu ── */
          <>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-brand transition-all hover:brightness-110"
            >
              Get started
              <ArrowUpRight className="size-4" />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;