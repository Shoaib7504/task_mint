"use client";

import { useRequireRole } from "@/hooks/useRequireRole";

/**
 * Default loading spinner matching TaskMint design system
 */
function DefaultLoading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <div className="mx-auto size-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-3 text-sm text-muted-foreground">Checking permissions…</p>
      </div>
    </div>
  );
}

/**
 * RoleGuard — Protects routes or UI blocks based on the user's role.
 *
 * Example:
 * ```jsx
 * <RoleGuard allowedRoles={["ADMIN"]}>
 *   <AdminPanel />
 * </RoleGuard>
 * ```
 *
 * @param {object} props
 * @param {string | string[]} props.allowedRoles - e.g. "ADMIN", or ["ADMIN", "BUYER"]
 * @param {React.ReactNode} props.children - Protected content to render if role matches
 * @param {React.ReactNode} [props.fallback=null] - Component to render if unauthorized (while redirecting)
 * @param {React.ReactNode} [props.loadingFallback] - Component to render while verifying user & role
 * @param {string} [props.redirectTo="/login"] - Redirect destination if unauthenticated
 * @param {string} [props.unauthorizedRedirect="/dashboard"] - Redirect destination if role mismatch
 */
export default function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
  loadingFallback = <DefaultLoading />,
  redirectTo = "/login",
  unauthorizedRedirect = "/dashboard",
}) {
  const { isAuthorized, isLoading } = useRequireRole(allowedRoles, {
    redirectTo,
    unauthorizedRedirect,
  });

  if (isLoading) {
    return loadingFallback;
  }

  if (!isAuthorized) {
    return fallback;
  }

  return children;
}
