"use client";

import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ArrowLeft,
  Briefcase,
  Coins,
  Compass,
  Home,
  LayoutDashboard,
  Search,
  Sparkles,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div className="w-11/12 mx-auto">
        <Navbar />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="relative mx-auto max-w-xl">
          {/* Glowing 404 Accent */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
            <Sparkles className="size-3.5" /> Error 404 • Page Not Found
          </div>

          <h1 className="text-7xl md:text-9xl font-black tracking-tight text-foreground/90 select-none">
            <span className="text-gradient">404</span>
          </h1>

          <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Oops! We couldn&apos;t find that page
          </h2>

          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            The page you requested may have been moved, deleted, or does not exist. Let&apos;s get you back on track!
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/">
                <Home className="mr-2 size-4" /> Return to Homepage
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/tasks">
                <Search className="mr-2 size-4" /> Browse Available Tasks
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 size-4" /> Go to Dashboard
              </Link>
            </Button>
          </div>

          {/* Helpful Quick Links */}
          <div className="mt-12 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <Link
              href="/tasks"
              className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-accent/30"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
                <Briefcase className="size-3.5" />
                <span>Task Marketplace</span>
              </div>
              <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                Find verified tasks to complete and earn coins.
              </p>
            </Link>

            <Link
              href="/#how-it-works"
              className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-accent/30"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
                <Compass className="size-3.5" />
                <span>How It Works</span>
              </div>
              <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                Learn how earning coins and posting tasks works.
              </p>
            </Link>

            <Link
              href="/register?role=buyer"
              className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-accent/30"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
                <Coins className="size-3.5 text-amber-500" />
                <span>Post a Task</span>
              </div>
              <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                Get your small tasks done by our global workforce.
              </p>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}