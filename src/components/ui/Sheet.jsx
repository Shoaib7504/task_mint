"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Sheet — a slide-in side panel (typically used for mobile sidebar).
 *
 * Usage:
 *   <Sheet open={open} onClose={() => setOpen(false)} side="left">
 *     ...content...
 *   </Sheet>
 */
export function Sheet({ open, onClose, side = "left", children, className = "" }) {
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const translateClass =
    side === "left"
      ? open
        ? "translate-x-0"
        : "-translate-x-full"
      : open
        ? "translate-x-0"
        : "translate-x-full";

  const positionClass = side === "left" ? "left-0" : "right-0";

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed ${positionClass} top-0 z-50 h-full w-72 border-r border-border bg-card shadow-2xl transition-transform duration-300 ease-out ${translateClass} ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Close panel"
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </>
  );
}

export default Sheet;
