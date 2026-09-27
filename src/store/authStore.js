/**
 * Note for Developers:
 * 
 * TaskMint uses TanStack Query + the custom `useUser()` hook for authentication state.
 * There is no external Zustand or Redux store needed.
 * 
 * To access or update the current user in any component:
 * 
 * import { useUser } from "@/hooks/useUser";
 * 
 * function MyComponent() {
 *   const { user, isLoggedIn, logout, updateUser } = useUser();
 * }
 */

import { useUser } from "@/hooks/useUser";

export const useAuthStore = useUser;
export default useAuthStore;
