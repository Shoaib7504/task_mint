import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  Zap,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import heroImage from "../../../public/taskmint-hero.png";

export default function HeroSection() {
  return (
    <section className="hero-grid overflow-hidden border-b mt-2">
      <div className="mx-auto grid min-h-[480px] max-w-7xl items-center gap-8 px-5 py-12 md:min-h-[680px] md:gap-10 md:py-16 md:grid-cols-[1.02fr_.98fr] lg:px-8">
        {/* ── Left column: copy ── */}
        <div className="relative z-10 text-center md:text-left">
          <span className="eyebrow">
            <Sparkles /> Simple work. Real rewards.
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.08] sm:text-5xl md:mt-7 md:text-7xl">
            Turn small tasks into{" "}
            <span className="text-gradient">real earnings.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 md:mx-0 md:mt-6">
            Complete simple online tasks, earn coins, and turn your time into
            rewards—all in one trusted marketplace.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center md:mt-8 md:justify-start">
            <Button size="xl" asChild>
              <Link href="/register?role=worker">
                Start earning <ArrowRight />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/register?role=buyer">Post a task</Link>
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm text-muted-foreground md:mt-9 md:justify-start md:gap-x-6">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-success" />
              Secure payments
            </span>
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="size-4 text-primary" />
              Verified buyers
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap className="size-4 text-warning" />
              Fast approvals
            </span>
          </div>
        </div>

        {/* ── Right column: hero image + floating cards ── */}
        <div className="relative mx-auto w-full max-w-lg md:max-w-none">
          <div className="hero-orbit" />
          <Image
            src={heroImage}
            width={1408}
            height={1104}
            alt="Task dashboard surrounded by reward coins"
            className="relative z-10 w-full drop-shadow-2xl"
            priority
          />

          {/* Floating cards hidden on very small screens */}
          <div className="float-card left-0 top-8 hidden sm:flex md:top-16">
            <span className="icon-box success">
              <TrendingUp />
            </span>
            <span>
              <b>+320 coins</b>
              <small>Earned today</small>
            </span>
          </div>

          <div className="float-card bottom-12 right-0 hidden sm:flex md:bottom-20">
            <span className="icon-box">
              <CheckCircle2 />
            </span>
            <span>
              <b>Task approved</b>
              <small>Just now</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
