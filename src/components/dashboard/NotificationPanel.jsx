"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, WalletCards, XCircle } from "lucide-react";
import { notificationItems } from "@/lib/dashboardData";

const iconMap = {
  success: CheckCircle2,
  danger: XCircle,
  info: WalletCards,
};

export default function NotificationPanel({ onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={panelRef} className="notification-panel">
      <div className="flex items-center justify-between">
        <b className="text-sm">Notifications</b>
        <button className="text-xs font-medium text-primary hover:underline">
          Mark all read
        </button>
      </div>
      {notificationItems.map(({ type, title, text, time }) => {
        const Icon = iconMap[type] || CheckCircle2;
        return (
          <div className="notification-item" key={title}>
            <span className={`metric-icon ${type === "danger" ? "warning" : "success"}`}>
              <Icon />
            </span>
            <span className="min-w-0 flex-1">
              <b>{title}</b>
              <small>{text}</small>
            </span>
            <time>{time}</time>
          </div>
        );
      })}
    </div>
  );
}
