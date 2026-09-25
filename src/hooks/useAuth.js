"use client";

import { useUser } from "./useUser";

/**
 * useAuth — provides the current logged-in user, token, loading state, role helpers, and logout.
 * Backed by useUser() which retrieves real-time user data from backend /auth/me.
 */
export const useAuth = () => {
  return useUser();
};

export default useAuth;
