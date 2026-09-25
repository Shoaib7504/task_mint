"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";

/**
 * Decode JWT token to get initial payload (fallback while query loads)
 */
function decodeJwtPayload(token) {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(base64));

    if (json.exp && Date.now() >= json.exp * 1000) {
      return null;
    }
    return json;
  } catch {
    return null;
  }
}

/**
 * External store subscription for localStorage & auth-change events
 */
function subscribeToken(callback) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("auth-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("auth-change", callback);
  };
}

function getTokenSnapshot() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("access-token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    null
  );
}

function getServerTokenSnapshot() {
  return null;
}

/**
 * useUser — Fetches fresh user data from backend (/auth/me) with TanStack Query.
 * Works seamlessly with both localStorage Bearer tokens and HTTP-only cookie sessions.
 */
export function useUser() {
  const queryClient = useQueryClient();

  // Reactive token subscription from localStorage
  const token = useSyncExternalStore(
    subscribeToken,
    getTokenSnapshot,
    getServerTokenSnapshot
  );

  // Fetch live user data from backend /auth/me
  const {
    data: fetchedUser,
    isLoading: isQueryLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["authUser", token],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/auth/me");
        const userData =
          res?.data?.data?.user ||
          res?.data?.user ||
          res?.data?.data ||
          res?.data;

        if (userData && (userData.id || userData.email)) {
          return userData;
        }
        return null;
      } catch (err) {
        // If 401 Unauthorized or 403 Forbidden, clean up stale token
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("access-token");
            localStorage.removeItem("token");
            localStorage.removeItem("accessToken");
          }
          return null;
        }
        return null;
      }
    },
    // Query runs on client mount with either Bearer token or credentials cookie
    enabled: typeof window !== "undefined",
    staleTime: 60 * 1000,
    retry: false,
  });

  // Decode JWT as instantaneous fallback while network request is pending
  const jwtFallback = token ? decodeJwtPayload(token) : null;
  const rawUser = fetchedUser || (jwtFallback ? {
    id: jwtFallback.id || jwtFallback._id || jwtFallback.userId || jwtFallback.sub,
    fullName: jwtFallback.fullName || jwtFallback.name || "",
    name: jwtFallback.fullName || jwtFallback.name || "",
    email: jwtFallback.email || "",
    role: jwtFallback.role || "WORKER",
    coins: jwtFallback.coins !== undefined ? jwtFallback.coins : 0,
    ...jwtFallback,
  } : null);

  const user = rawUser ? {
    ...rawUser,
    name: rawUser.fullName || rawUser.name || "User",
  } : null;

  // Normalize role to UPPERCASE (e.g. WORKER, BUYER, ADMIN)
  const role = user?.role ? String(user.role).toUpperCase() : null;

  const hasRole = useCallback(
    (allowedRoles) => {
      if (!role) return false;
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      return rolesArray.map((r) => String(r).toUpperCase()).includes(role);
    },
    [role]
  );

  const logout = useCallback(async () => {
    try {
      await axiosSecure.post("/auth/logout").catch(() => {});
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access-token");
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        window.dispatchEvent(new Event("auth-change"));
      }
      queryClient.setQueryData(["authUser", null], null);
      queryClient.removeQueries({ queryKey: ["authUser"] });
    }
  }, [queryClient]);

  const isLoggedIn = !!user;
  const isLoading = isQueryLoading && !user;

  return {
    user,
    token,
    role,
    isAdmin: role === "ADMIN",
    isBuyer: role === "BUYER",
    isWorker: role === "WORKER",
    hasRole,
    isLoggedIn,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    logout,
  };
}

export default useUser;
