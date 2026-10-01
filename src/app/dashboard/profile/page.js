"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Coins,
  Shield,
  Calendar,
  Camera,
  CheckCircle2,
  Hourglass,
  XCircle,
  ArrowUpCircle,
  Save,
  Lock,
  Sparkles,
  Link as LinkIcon,
  BriefcaseBusiness,
} from "lucide-react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import Avatar from "@/components/ui/Avatar";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import { DEMO_AVATARS, DEFAULT_AVATAR } from "@/lib/avatar";

export default function ProfilePage() {
  const { user, refetch, updateUser } = useAuth();
  const queryClient = useQueryClient();

  // Profile form state
  const [fullName, setFullName] = useState(() => user?.name || user?.fullName || "");
  const [photoUrl, setPhotoUrl] = useState(() => user?.photoUrl || user?.photoURL || user?.image || user?.avatar || "");
  const [syncedUserKey, setSyncedUserKey] = useState(() => user?.email || user?.id || "");
  const [selectedDemoId, setSelectedDemoId] = useState("");
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });

  // Sync initial user data when user changes
  if (user && (user.email || user.id) !== syncedUserKey) {
    setSyncedUserKey(user.email || user.id || "");
    setFullName(user.name || user.fullName || "");
    setPhotoUrl(user.photoUrl || user.photoURL || user.image || user.avatar || "");
  }

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });

  // Buyer request state
  const [upgradeNote, setUpgradeNote] = useState("");
  const [upgradeMsg, setUpgradeMsg] = useState({ text: "", type: "" });

  // Fetch current role request (if worker)
  const isWorker = (user?.role || "WORKER").toUpperCase() === "WORKER";
  const { data: roleReqData, isLoading: roleReqLoading } = useQuery({
    queryKey: ["myRoleRequest"],
    queryFn: async () => {
      const res = await axiosSecure.get("/role-requests/my");
      return res.data;
    },
    enabled: !!user,
  });

  const roleRequest = roleReqData?.request;

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (payload) => {
      try {
        const res = await axiosSecure.patch("/users/profile", payload);
        return res.data;
      } catch (err) {
        // Fallback to /auth/profile if needed
        const res2 = await axiosSecure.patch("/auth/profile", payload);
        return res2.data;
      }
    },
    onSuccess: (data) => {
      const updatedUser = data?.user || {
        fullName,
        name: fullName,
        photoUrl: photoUrl || null,
      };

      // 1. Instantly update in-memory query cache
      if (updateUser) {
        updateUser(updatedUser);
      }
      queryClient.setQueriesData({ queryKey: ["authUser"] }, (old) => {
        return old ? { ...old, ...updatedUser } : updatedUser;
      });

      // 2. Refetch in background for fresh server state
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      if (refetch) refetch();

      // 3. Update local form fields
      if (updatedUser.fullName) setFullName(updatedUser.fullName);
      if (updatedUser.photoUrl !== undefined) setPhotoUrl(updatedUser.photoUrl || "");

      setProfileMsg({
        text: data.message || "Profile updated successfully!",
        type: "success",
      });

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("auth-change"));
      }

      setTimeout(() => setProfileMsg({ text: "", type: "" }), 5000);
    },
    onError: (err) => {
      setProfileMsg({
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update profile.",
        type: "error",
      });
    },
  });

  // Password update mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (payload) => {
      try {
        const res = await axiosSecure.patch("/users/profile", payload);
        return res.data;
      } catch (err) {
        const res2 = await axiosSecure.patch("/auth/profile", payload);
        return res2.data;
      }
    },
    onSuccess: (data) => {
      setPasswordMsg({
        text: data?.message || "Password updated successfully!",
        type: "success",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMsg({ text: "", type: "" }), 5000);
    },
    onError: (err) => {
      setPasswordMsg({
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to change password.",
        type: "error",
      });
    },
  });

  // Submit buyer request mutation
  const buyerRequestMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post("/role-requests", {
        note: upgradeNote,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setUpgradeMsg({
        text: data.message || "Request submitted successfully! Admin will review it.",
        type: "success",
      });
      setUpgradeNote("");
      queryClient.invalidateQueries({ queryKey: ["myRoleRequest"] });
    },
    onError: (err) => {
      setUpgradeMsg({
        text: err?.response?.data?.message || "Failed to submit role request.",
        type: "error",
      });
    },
  });

  function handleSaveProfile(e) {
    e.preventDefault();
    if (!fullName || !fullName.trim()) {
      setProfileMsg({ text: "Name cannot be empty.", type: "error" });
      return;
    }
    const cleanPhoto = photoUrl && photoUrl.trim() ? photoUrl.trim() : null;
    updateProfileMutation.mutate({
      fullName: fullName.trim(),
      name: fullName.trim(),
      photoUrl: cleanPhoto,
    });
  }

  function handleSelectDemoAvatar(demo) {
    setSelectedDemoId(demo.id);
    setPhotoUrl(demo.url);
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (!newPassword) {
      setPasswordMsg({ text: "Please enter a new password.", type: "error" });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({
        text: "Password must be at least 6 characters.",
        type: "error",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: "Passwords do not match.", type: "error" });
      return;
    }
    updatePasswordMutation.mutate({
      currentPassword,
      password: newPassword,
    });
  }

  const roleUpper = (user?.role || "WORKER").toUpperCase();
  const roleBadgeTone =
    roleUpper === "ADMIN" ? "danger" : roleUpper === "BUYER" ? "info" : "success";

  return (
    <>
      <DashboardHeader
        title="My Profile"
        subtitle="Manage your personal details, avatar photo, and account status."
      />

      <main className="mx-auto max-w-[1200px] space-y-8 p-4 md:p-8">
        {/* Profile Hero Overview Card */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-accent/20 p-5 sm:p-6 md:p-8 shadow-card">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center gap-5 sm:flex-row text-center sm:text-left">
              <div className="relative group">
                <Avatar
                  src={photoUrl || user?.photoUrl || DEFAULT_AVATAR}
                  alt={user?.name || "Profile Photo"}
                  size="2xl"
                  className="size-24 md:size-28 shadow-md"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-ink/40 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                  <Camera className="size-6 text-white" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground break-words">
                    {user?.name || user?.fullName || "User"}
                  </h2>
                  <StatusBadge tone={roleBadgeTone}>
                    {roleUpper}
                  </StatusBadge>
                </div>

                <p className="mt-1 flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm text-muted-foreground break-all">
                  <Mail className="size-4 shrink-0" />
                  <span>{user?.email || "No email available"}</span>
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-semibold text-amber-500">
                    <Coins className="size-3.5" />
                    {(user?.coins ?? 0).toLocaleString()} Coins
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-muted-foreground/70" />
                    Joined{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Recently"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield className="size-3.5 text-emerald-500" />
                    Active Account
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions (e.g. for worker: upgrade button) */}
            {isWorker && (
              <div className="flex shrink-0 flex-col items-center sm:items-end justify-center w-full md:w-auto">
                <Button asChild variant="outline" className="w-full sm:w-auto border-primary/40 text-primary hover:bg-primary/5">
                  <Link href="/dashboard/worker/upgrade">
                    <ArrowUpCircle className="size-4 mr-2" />
                    Upgrade to Buyer
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Worker: Role Upgrade Status & Action Banner */}
        {isWorker && (
          <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-background to-background shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <BriefcaseBusiness className="size-5 text-primary" />
                    <h3 className="font-bold text-lg text-foreground">
                      Upgrade to Buyer Account
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-2xl">
                    Want to create tasks, hire workers, and review submissions? Request buyer status from the admin to unlock full employer features.
                  </p>
                </div>

                <div className="shrink-0">
                  {roleReqLoading ? (
                    <div className="text-xs text-muted-foreground">Loading status…</div>
                  ) : roleRequest?.status === "PENDING" ? (
                    <div className="flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-600 dark:text-amber-400">
                      <Hourglass className="size-4 animate-spin" />
                      Request Pending Admin Approval
                    </div>
                  ) : roleRequest?.status === "APPROVED" ? (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-400 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-600">
                      <CheckCircle2 className="size-4" />
                      Approved! You are a Buyer.
                    </div>
                  ) : (
                    <Button asChild>
                      <Link href="/dashboard/worker/upgrade">
                        <ArrowUpCircle className="size-4 mr-2" />
                        Request Buyer Privileges
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Edit Profile & Avatar Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Edit Profile Information
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Update your display name and profile photo.
                    </p>
                  </div>
                  <Sparkles className="size-5 text-primary" />
                </div>

                {profileMsg.text && (
                  <div
                    className={`mb-6 rounded-xl border p-4 text-sm font-medium ${
                      profileMsg.type === "success"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-danger/30 bg-danger/10 text-danger"
                    }`}
                  >
                    {profileMsg.text}
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs font-semibold">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  {/* Email (Read Only) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email" className="text-xs font-semibold">
                        Email Address
                      </Label>
                      <span className="text-[10px] text-muted-foreground">
                        Email cannot be changed
                      </span>
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 size-4 text-muted-foreground/60" />
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="pl-9 bg-muted/30 cursor-not-allowed opacity-80"
                      />
                    </div>
                  </div>

                  {/* Profile Photo / Demo Avatar Section */}
                  <div className="space-y-4 pt-2 border-t border-border">
                    <div>
                      <Label className="text-xs font-semibold">
                        Profile Photo
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Pick one of our demo avatar images or enter your own custom photo URL.
                      </p>
                    </div>

                    {/* Demo Avatar Preset Picker */}
                    <div>
                      <p className="text-xs font-medium text-foreground mb-2.5">
                        Quick Demo Avatars:
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        {DEMO_AVATARS.map((demo) => {
                          const isSelected =
                            photoUrl === demo.url || selectedDemoId === demo.id;
                          return (
                            <button
                              key={demo.id}
                              type="button"
                              onClick={() => handleSelectDemoAvatar(demo)}
                              className={`group flex items-center gap-2 rounded-xl border p-1.5 transition-all text-left ${
                                isSelected
                                  ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                                  : "border-border bg-card hover:bg-accent hover:border-border/80"
                              }`}
                            >
                              <Avatar
                                src={demo.url}
                                alt={demo.name}
                                size="sm"
                                ring={false}
                              />
                              <span className="text-xs font-medium pr-2 text-foreground">
                                {demo.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Image URL */}
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="photoUrl" className="text-xs font-semibold">
                        Custom Photo URL
                      </Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Input
                          id="photoUrl"
                          type="url"
                          value={photoUrl}
                          onChange={(e) => {
                            setPhotoUrl(e.target.value);
                            setSelectedDemoId("");
                          }}
                          placeholder="https://example.com/avatar.jpg"
                          className="pl-9"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Leave blank or select a demo avatar to use the default avatar image.
                      </p>
                    </div>

                    {/* Live Preview */}
                    <div className="flex items-center gap-3 rounded-xl bg-accent/40 p-3 border border-border/50">
                      <Avatar
                        src={photoUrl || DEFAULT_AVATAR}
                        alt="Preview"
                        size="md"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground">
                          Photo Preview
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {photoUrl ? "Using custom or chosen demo avatar" : "Using TaskMint demo avatar fallback"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="px-6"
                    >
                      <Save className="size-4 mr-2" />
                      {updateProfileMutation.isPending ? "Saving Changes…" : "Save Profile"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Security & Role Details */}
          <div className="space-y-6">
            {/* Account Role & Balance Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-base text-foreground">
                  Account Overview
                </h3>

                <div className="divide-y divide-border text-sm">
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-muted-foreground">Current Role</span>
                    <StatusBadge tone={roleBadgeTone}>{roleUpper}</StatusBadge>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-muted-foreground">Coin Balance</span>
                    <span className="font-semibold text-amber-500 flex items-center gap-1">
                      <Coins className="size-3.5" />
                      {(user?.coins ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-muted-foreground">Cash Value</span>
                    <span className="font-semibold text-foreground">
                      ≈ ${((user?.coins ?? 0) / 10).toFixed(2)}
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-emerald-500 font-medium">Active</span>
                  </div>
                </div>

                {isWorker && (
                  <Button asChild variant="outline" className="w-full mt-2">
                    <Link href="/dashboard/worker/upgrade">
                      <ArrowUpCircle className="size-4 mr-2" />
                      Become a Buyer
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="size-4 text-muted-foreground" />
                  <h3 className="font-bold text-base text-foreground">
                    Security & Password
                  </h3>
                </div>

                {passwordMsg.text && (
                  <div
                    className={`mb-4 rounded-xl border p-3 text-xs font-medium ${
                      passwordMsg.type === "success"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                        : "border-danger/30 bg-danger/10 text-danger"
                    }`}
                  >
                    {passwordMsg.text}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPassword" className="text-xs">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword" className="text-xs">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full"
                    disabled={updatePasswordMutation.isPending}
                  >
                    {updatePasswordMutation.isPending
                      ? "Updating…"
                      : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
