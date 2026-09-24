"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Dialog — a simple modal component.
 *
 * Usage:
 *   <Dialog open={open} onClose={() => setOpen(false)}>
 *     <DialogHeader>
 *       <DialogTitle>Title</DialogTitle>
 *       <DialogDescription>Description</DialogDescription>
 *     </DialogHeader>
 *     <DialogBody>...content...</DialogBody>
 *     <DialogFooter>...buttons...</DialogFooter>
 *   </Dialog>
 */
export function Dialog({ open, onClose, children, className = "" }) {
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

  // Lock scroll when open
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

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose?.();
      }}
    >
      <div
        className={`relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 ${className}`}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children, className = "" }) {
  return <div className={`mb-4 space-y-1.5 ${className}`}>{children}</div>;
}

export function DialogTitle({ children, className = "" }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}

export function DialogDescription({ children, className = "" }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
  );
}

export function DialogBody({ children, className = "" }) {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
}

export function DialogFooter({ children, className = "" }) {
  return (
    <div className={`mt-6 flex items-center justify-end gap-2 ${className}`}>
      {children}
    </div>
  );
}

export default Dialog;
