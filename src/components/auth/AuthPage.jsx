"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import Brand from "@/components/brand/Brand";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";

/* ── static data ── */
const authPoints = [
  [ShieldCheck, "Protected payouts"],
  [CheckCircle2, "Verified tasks"],
  [Users, "Global community"],
  [LockKeyhole, "Secure accounts"],
];

const titles = {
  login: "Welcome back",
  register: "Create your account",
  forgot: "Reset your password",
  reset: "Choose a new password",
};

const subtitles = {
  register: "Start earning or post your first task today.",
  login: "Enter your details to access your workspace.",
  forgot: "We'll help you securely regain access.",
  reset: "We'll help you securely regain access.",
};

const submitLabels = {
  login: "Sign in",
  register: "Create account",
  forgot: "Send reset link",
  reset: "Update password",
};

/* ── component ── */
export default function AuthPage({ mode = "login" }) {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("worker");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  /* Just console.log for now */
  function onSubmit(data) {
    if (mode === "register") {
      data.role = role;
    }
    console.log(`[AuthPage] mode: ${mode}`, data);
    setMessage(
      mode === "register"
        ? "Account created! Check your email to confirm."
        : mode === "login"
          ? "Signed in successfully!"
          : mode === "forgot"
            ? "Check your inbox for a secure reset link."
            : "Your password has been updated."
    );
  }

  function handleGoogle() {
    console.log("[AuthPage] Google sign-in clicked");
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
      {/* ── Left art panel (desktop only) ── */}
      <section className="auth-art hidden lg:flex">
        <Brand />

        <div className="my-auto max-w-xl">
          <span className="eyebrow dark">
            <Sparkles /> Trusted by 24,800+ workers
          </span>
          <h1>
            Small tasks.
            <br />
            Meaningful momentum.
          </h1>
          <p>
            Join a marketplace built around clarity, reliable rewards, and work
            that fits your day.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {authPoints.map(([Icon, label]) => (
              <div className="auth-point" key={String(label)}>
                <Icon />
                {String(label)}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-ink-muted">© 2026 TaskMint</p>
      </section>

      {/* ── Right form panel ── */}
      <section className="flex items-center justify-center bg-background px-5 py-10">
        <div className="w-full max-w-md">
          {/* Mobile brand bar */}
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Brand />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft />
              </Link>
            </Button>
          </div>

          {/* Desktop back link */}
          <Link
            href="/"
            className="mb-7 hidden items-center gap-2 text-sm text-muted-foreground hover:text-foreground lg:inline-flex"
          >
            <ArrowLeft className="size-4" />
            Back to TaskMint
          </Link>

          {/* Heading */}
          <h2 className="text-3xl font-bold">{titles[mode]}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {subtitles[mode]}
          </p>

          {/* Google OAuth */}
          {(mode === "login" || mode === "register") && (
            <Button
              variant="outline"
              size="lg"
              className="mt-7 w-full"
              onClick={handleGoogle}
              disabled={isSubmitting}
            >
              <span className="text-lg font-bold text-primary">G</span>
              Continue with Google
            </Button>
          )}

          {/* Divider */}
          {(mode === "login" || mode === "register") && (
            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or continue with email
              <span className="h-px flex-1 bg-border" />
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full name (register only) */}
            {mode === "register" && (
              <>
                <div>
                  <Label htmlFor="fullName">Full name</Label>
                  <div className="input-icon mt-1">
                    <UserRound />
                    <Input
                      id="fullName"
                      placeholder="Your full name"
                      {...register("fullName", {
                        required: "Full name is required",
                        minLength: { value: 2, message: "At least 2 characters" },
                        maxLength: { value: 100, message: "Max 100 characters" },
                      })}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Role picker */}
                <div>
                  <Label>Choose your role</Label>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {["worker", "buyer"].map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRole(r)}
                        className={`role-choice ${role === r ? "active" : ""}`}
                      >
                        <span>
                          {r === "worker" ? "Earn from tasks" : "Post & manage"}
                        </span>
                        <b>{r.charAt(0).toUpperCase() + r.slice(1)}</b>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Email (not shown on reset-password mode) */}
            {mode !== "reset" && (
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="input-icon mt-1">
                  <Mail />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                      maxLength: { value: 255, message: "Max 255 characters" },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}

            {/* Password (not shown on forgot mode) */}
            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "login" && (
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-primary"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="input-icon mt-1">
                  <LockKeyhole />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Use at least 8 characters",
                      },
                      maxLength: { value: 72, message: "Max 72 characters" },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}

            {/* Feedback messages */}
            {message && (
              <Alert>
                <CheckCircle2 className="size-4 text-success" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <Button size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Please wait…" : submitLabels[mode]}
            </Button>
          </form>

          {/* Footer links */}
          {mode === "login" && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              New to TaskMint?{" "}
              <Link href="/register" className="font-semibold text-primary">
                Create an account
              </Link>
            </p>
          )}
          {mode === "register" && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
