import Link from "next/link";
import { Check, Coins } from "lucide-react";

export function Brand({ compact = false }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-foreground">
      <span className="relative grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-brand">
        <Check className="size-5" strokeWidth={3} />
        <Coins className="absolute -bottom-1 -right-1 size-4 rounded-full bg-success p-0.5 text-success-foreground" />
      </span>
      {!compact && (
        <span className="text-xl">
          Task<span className="text-primary">Mint</span>
        </span>
      )}
    </Link>
  );
}

export default Brand;
