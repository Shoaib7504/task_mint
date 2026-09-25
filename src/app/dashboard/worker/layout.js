"use client";

import RoleGuard from "@/components/auth/RoleGuard";

export default function WorkerLayout({ children }) {
  return (
    <RoleGuard
      allowedRoles={["WORKER", "ADMIN"]}
      unauthorizedRedirect="/dashboard"
    >
      {children}
    </RoleGuard>
  );
}
