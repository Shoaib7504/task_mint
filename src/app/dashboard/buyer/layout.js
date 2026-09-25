"use client";

import RoleGuard from "@/components/auth/RoleGuard";

export default function BuyerLayout({ children }) {
  return (
    <RoleGuard
      allowedRoles={["BUYER", "ADMIN"]}
      unauthorizedRedirect="/dashboard"
    >
      {children}
    </RoleGuard>
  );
}
