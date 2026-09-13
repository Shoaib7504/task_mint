"use client";

import { useState } from "react";
import Brand from "../brand/Brand";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Browse tasks", href: "/tasks" },
  { label: "Top workers", href: "#top-workers" },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between px-4 py-3">
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

      {/* ── Desktop auth buttons ── */}
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
      </div>
    </nav>
  );
}

export default Navbar;