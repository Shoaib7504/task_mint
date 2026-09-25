"use client";

import { useState } from "react";
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

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
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
        email: formData.email,
        password: formData.password,
      };

      const res = await postData("/auth/login", payload);

      const token =
        res?.token ||
        res?.data?.token ||
        res?.accessToken ||
        res?.data?.accessToken;

      if (token) {
        localStorage.setItem("access-token", token);
      }
      window.dispatchEvent(new Event("auth-change"));

      setMessage(res?.message || "Signed in successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Invalid email or password.";
      setErrorMessage(msg);
    }
  }

  function handleGoogle() {
    console.log("[LoginPage] Google sign-in clicked");
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
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your details to access your workspace.
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
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-primary"
                >
                  Forgot password?
                </Link>
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
              {isSubmitting || isPosting ? "Please wait…" : "Sign in"}
            </Button>
          </form>

          {/* Footer links */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to TaskMint?{" "}
            <Link href="/register" className="font-semibold text-primary">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
