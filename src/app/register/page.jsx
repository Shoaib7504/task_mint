"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePostData } from "@/hooks/useAxiosSecure";
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

const authPoints = [
  [ShieldCheck, "Protected payouts"],
  [CheckCircle2, "Verified tasks"],
  [Users, "Global community"],
  [LockKeyhole, "Secure accounts"],
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(() => {
    if (typeof window !== "undefined") {
      const urlRole = new URLSearchParams(window.location.search).get("role");
      if (urlRole && (urlRole.toLowerCase() === "buyer" || urlRole.toLowerCase() === "worker")) {
        return urlRole.toLowerCase();
      }
    }
    return "worker";
  });
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { postData, isPending: isPosting } = usePostData();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(formData) {
    setMessage("");
    setErrorMessage("");

    try {
      const payload = {
        name: formData.fullName,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: role.toUpperCase(),
      };

      const res = await postData("/auth/register", payload);

      const token =
        res?.token ||
        res?.data?.token ||
        res?.accessToken ||
        res?.data?.accessToken;

      if (token) {
        localStorage.setItem("access-token", token);
      }
      window.dispatchEvent(new Event("auth-change"));

      setMessage(res?.message || "Account created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed. Please try again.";
      setErrorMessage(msg);
    }
  }

  function handleGoogle() {
    console.log("[RegisterPage] Google sign-in clicked");
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
          <h2 className="text-3xl font-bold">Create your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start earning or post your first task today.
          </p>

          {/* Google OAuth */}
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

          {/* Divider */}
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or continue with email
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full name */}
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

            {/* Email */}
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
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

            {/* Feedback messages */}
            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert>
                <CheckCircle2 className="size-4 text-success" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <Button size="lg" className="w-full" disabled={isSubmitting || isPosting}>
              {isSubmitting || isPosting ? "Please wait…" : "Create account"}
            </Button>
          </form>

          {/* Footer links */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
