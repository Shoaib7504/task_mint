"use client";

import { useUser } from "./useUser";

/**
 * useRole — Simple hook to inspect the current user's role.
 *
 * @example
 * const { role, isBuyer, isWorker, isAdmin } = useRole();
 * if (isBuyer) {
 *   // Buyer-only UI
 * }
 */
export function useRole() {
  const { role, isBuyer, isWorker, isAdmin, hasRole, user, isLoading } = useUser();

  return {
    role,
    isBuyer,
    isWorker,
    isAdmin,
    hasRole,
    user,
    isLoading,
  };
}

export default useRole;
