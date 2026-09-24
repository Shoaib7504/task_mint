"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Decode a JWT payload without any external library.
 * Returns null if the token is invalid or expired.
 */
function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    // Check expiry
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Reads the stored token and returns { user, token } or { user: null, token: null }.
 */
function getAuthFromStorage() {
  if (typeof window === "undefined") return { user: null, token: null };

  const token =
    localStorage.getItem("access-token") || localStorage.getItem("token");

  if (!token) return { user: null, token: null };

  const payload = decodeToken(token);
  if (!payload) {
    // Token expired or invalid — clean up
    localStorage.removeItem("access-token");
    localStorage.removeItem("token");
    return { user: null, token: null };
  }

  return {
    user: {
      id: payload.id || payload._id || payload.userId || payload.sub,
      name: payload.name || payload.fullName || payload.username || "",
      email: payload.email || "",
      role: payload.role || "WORKER",
    },
    token,
  };
}

/**
 * useAuth — provides the current logged-in user, loading state, and a logout function.
 *
 * @returns {{ user: object | null, token: string | null, isLoading: boolean, isLoggedIn: boolean, logout: () => void }}
 */
export const useAuth = () => {
  const [auth, setAuth] = useState({ user: null, token: null });
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate on mount (avoids SSR mismatch)
  useEffect(() => {
    setAuth(getAuthFromStorage());
    setIsLoading(false);

    // Listen for storage changes from other tabs
    const handleStorage = (e) => {
      if (e.key === "access-token" || e.key === "token") {
        setAuth(getAuthFromStorage());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access-token");
    localStorage.removeItem("token");
    setAuth({ user: null, token: null });
    // Dispatch a custom event so other useAuth instances on the same page update
    window.dispatchEvent(new Event("auth-change"));
  }, []);

  // Listen for custom auth-change events (same-tab logout)
  useEffect(() => {
    const handleAuthChange = () => setAuth(getAuthFromStorage());
    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  return {
    user: auth.user,
    token: auth.token,
    isLoggedIn: !!auth.user,
    isLoading,
    logout,
  };
};
