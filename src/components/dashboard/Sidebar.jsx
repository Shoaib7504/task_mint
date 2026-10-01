"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpCircle,
  BriefcaseBusiness,
  Coins,
  CreditCard,
  FileCheck2,
  Home,
  PackagePlus,
  User,
  UserCog,
  UserRoundCog,
  WalletCards,
} from "lucide-react";
import Brand from "@/components/brand/Brand";

const navs = {
  WORKER: [
    { label: "Home", href: "/dashboard/worker", icon: Home },
    { label: "Task list", href: "/dashboard/worker/tasks", icon: BriefcaseBusiness },
    { label: "My submissions", href: "/dashboard/worker/submissions", icon: FileCheck2 },
    { label: "Withdrawals", href: "/dashboard/worker/withdrawals", icon: WalletCards },
    { label: "Become a buyer", href: "/dashboard/worker/upgrade", icon: ArrowUpCircle, highlight: true },
    { label: "My profile", href: "/dashboard/profile", icon: User },
  ],
  BUYER: [
    { label: "Home", href: "/dashboard/buyer", icon: Home },
    { label: "Add new task", href: "/dashboard/buyer/add-task", icon: PackagePlus },
    { label: "My tasks", href: "/dashboard/buyer/my-tasks", icon: BriefcaseBusiness },
    { label: "Task review", href: "/dashboard/buyer/review", icon: FileCheck2 },
    { label: "Purchase coins", href: "/dashboard/buyer/purchase-coins", icon: Coins },
    { label: "Payment history", href: "/dashboard/buyer/payment-history", icon: CreditCard },
    { label: "My profile", href: "/dashboard/profile", icon: User },
  ],
  ADMIN: [
    { label: "Home", href: "/dashboard/admin", icon: Home },
    { label: "Manage users", href: "/dashboard/admin/users", icon: UserCog },
    { label: "Manage tasks", href: "/dashboard/admin/tasks", icon: BriefcaseBusiness },
    { label: "Role requests", href: "/dashboard/admin/role-requests", icon: UserRoundCog },
    { label: "Withdrawals", href: "/dashboard/admin/withdrawals", icon: WalletCards },
    { label: "My profile", href: "/dashboard/profile", icon: User },
  ],
};

export default function Sidebar({ role = "WORKER", coins = 2480, onClose }) {
  const pathname = usePathname();
  const links = navs[role] || navs.WORKER;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 sm:py-6 pr-12 lg:pr-5">
        <Brand />
      </div>

      {/* Coin balance */}
      <div className="px-4">
        <div className="sidebar-balance rounded-lg bg-surface p-4">
          <p className="text-xs font-medium text-muted-foreground">Available balance</p>
          <strong className="mt-1 flex items-center gap-2 text-xl font-bold">
            <Coins className="size-5 text-info" />
            {coins.toLocaleString()}
          </strong>
          <span className="text-xs text-muted-foreground">
            ≈ ${(coins / 10).toFixed(2)} available
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-7 space-y-1 px-3">
        {links.map(({ label, href, icon: Icon, highlight }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              className={`dash-link justify-between ${
                isActive ? "bg-sidebar-accent text-foreground font-semibold" : ""
              } ${
                highlight && !isActive
                  ? "text-primary hover:bg-primary/10"
                  : ""
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className={highlight && !isActive ? "text-primary" : ""} />
                {label}
              </span>
              {highlight && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                  Upgrade
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Role display */}
      <div className="mt-auto border-t p-4">
        <p className="text-[10px] font-bold uppercase text-muted-foreground">
          Current role
        </p>
        <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
          {role.toLowerCase()}
        </span>
      </div>
    </div>
  );
}
