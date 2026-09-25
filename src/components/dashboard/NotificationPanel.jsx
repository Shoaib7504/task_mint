"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, WalletCards, XCircle, BellOff, Info, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/lib/axios";

const iconMap = {
  success: CheckCircle2,
  danger: XCircle,
  info: WalletCards,
  warning: AlertTriangle,
};

export default function NotificationPanel({ onClose }) {
  const panelRef = useRef(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/notifications");
      return res.data;
    },
  });

  const markAllMutation = useMutation({
    mutationFn: async () => {
      await axiosSecure.patch("/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const notifications = data?.notifications || [];

  return (
    <div ref={panelRef} className="notification-panel max-h-[420px] overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <b className="text-sm font-semibold">Notifications ({notifications.length})</b>
        {notifications.length > 0 && (
          <button
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
          >
            Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="py-6 text-center text-xs text-muted-foreground">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
          <BellOff className="size-8 stroke-1 opacity-50" />
          <p className="mt-2 text-xs">No notifications yet</p>
        </div>
      ) : (
        notifications.map((item) => {
          const Icon = iconMap[item.type] || Info;
          const timeFormatted = new Date(item.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              className={`notification-item ${!item.isRead ? "bg-accent/40 rounded-lg p-2" : ""}`}
              key={item.id}
            >
              <span className={`metric-icon ${item.type === "danger" ? "warning" : item.type === "success" ? "success" : "info"}`}>
                <Icon />
              </span>
              <span className="min-w-0 flex-1">
                <b className="block text-xs font-medium">{item.title}</b>
                <small className="block text-[11px] text-muted-foreground leading-snug">{item.text}</small>
              </span>
              <time className="text-[10px] text-muted-foreground whitespace-nowrap">{timeFormatted}</time>
            </div>
          );
        })
      )}
    </div>
  );
}
