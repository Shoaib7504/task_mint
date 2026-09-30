"use client";

import { useState, useEffect } from "react";
import { DEFAULT_AVATAR } from "@/lib/avatar";

const sizes = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
  xl: "size-20",
  "2xl": "size-28",
};

export default function Avatar({
  src,
  alt = "User avatar",
  size = "md",
  className = "",
  ring = true,
}) {
  const [failedSrc, setFailedSrc] = useState(null);

  const effectiveSrc =
    src && src.trim() !== "" && failedSrc !== src ? src : DEFAULT_AVATAR;
  const sizeClass = sizes[size] || sizes.md;
  const ringClass = ring ? "ring-2 ring-border/60 shadow-sm" : "";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={effectiveSrc}
      alt={alt}
      onError={() => {
        if (src) setFailedSrc(src);
      }}
      className={`rounded-full object-cover shrink-0 bg-muted/40 transition-transform duration-200 ${sizeClass} ${ringClass} ${className}`}
    />
  );
}
