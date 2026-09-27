"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";
import { useAuth } from "./useAuth";

/**
 * useNotifications — Hook for fetching and managing user notifications.
 *
 * @example
 * const { notifications, unreadCount, isLoading, markAllAsRead } = useNotifications();
 */
export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fetch notifications for current logged-in user
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/notifications");
      return res.data;
    },
    enabled: !!user,
    refetchInterval: 15000, // Poll every 15 seconds
  });

  // 2. Mark all notifications as read mutation
  const markAllMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.patch("/notifications/read-all");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount ?? notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    hasUnread: unreadCount > 0,
    isLoading,
    refetch,
    markAllAsRead: () => markAllMutation.mutate(),
    isMarkingRead: markAllMutation.isPending,
  };
}

export default useNotifications;
