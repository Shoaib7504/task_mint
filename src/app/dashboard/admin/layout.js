"use client";

import RoleGuard from "@/components/auth/RoleGuard";

export default function AdminLayout({ children }) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]} unauthorizedRedirect="/dashboard">
      {children}
    </RoleGuard>
  );
}
