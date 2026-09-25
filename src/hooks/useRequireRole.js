"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./useUser";

/**
 * useRequireRole — Hook to enforce role-based access control on pages and components.
 * Automatically redirects unauthorized or unauthenticated users.
 *
 * @param {string | string[]} allowedRoles - Role or array of allowed roles (e.g., "ADMIN" or ["BUYER", "ADMIN"])
 * @param {object} [options]
 * @param {string} [options.redirectTo="/login"] - Path to redirect if user is not logged in
 * @param {string} [options.unauthorizedRedirect="/dashboard"] - Path to redirect if user role is not permitted
 *
 * @returns {{
 *   user: object | null,
 *   role: string | null,
 *   isAuthorized: boolean,
 *   isLoading: boolean,
 *   logout: () => void
 * }}
 */
export function useRequireRole(allowedRoles, options = {}) {
  const {
    redirectTo = "/login",
    unauthorizedRedirect = "/dashboard",
  } = options;

  const router = useRouter();
  const { user, role, hasRole, isLoggedIn, isLoading, logout } = useUser();

  const isAuthorized = isLoggedIn && hasRole(allowedRoles);

  useEffect(() => {
    if (isLoading) return;

    // 1. Not logged in -> redirect to login
    if (!isLoggedIn) {
      router.replace(redirectTo);
      return;
    }

    // 2. Logged in, but wrong role -> redirect to unauthorized fallback
    if (!hasRole(allowedRoles)) {
      router.replace(unauthorizedRedirect);
    }
  }, [
    isLoading,
    isLoggedIn,
    allowedRoles,
    hasRole,
    router,
    redirectTo,
    unauthorizedRedirect,
  ]);

  return {
    user,
    role,
    isAuthorized,
    isLoading,
    logout,
  };
}

export default useRequireRole;
