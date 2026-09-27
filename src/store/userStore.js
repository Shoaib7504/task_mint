/**
 * Note for Developers:
 * 
 * User profile state is cached and kept fresh automatically via TanStack Query.
 * 
 * Usage:
 * import { useUser } from "@/hooks/useUser";
 * 
 * const { user, role, hasRole, updateUser } = useUser();
 */

import { useUser } from "@/hooks/useUser";

export const useUserStore = useUser;
export default useUserStore;
