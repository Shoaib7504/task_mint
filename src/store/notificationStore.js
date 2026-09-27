/**
 * Note for Developers:
 * 
 * Notifications are managed via TanStack Query with the `useNotifications()` hook.
 * 
 * Usage:
 * import { useNotifications } from "@/hooks/useNotifications";
 * 
 * const { notifications, unreadCount, markAllAsRead } = useNotifications();
 */

import { useNotifications } from "@/hooks/useNotifications";

export const useNotificationStore = useNotifications;
export default useNotificationStore;
