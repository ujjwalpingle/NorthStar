"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Compass,
  LayoutDashboard,
  Settings,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/wealth", label: "Wealth", icon: Wallet },
  { href: "/career", label: "Career", icon: Briefcase },
  { href: "/migration", label: "Migration", icon: Compass },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Star className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="font-semibold tracking-tight">Ujjwal</p>
          <p className="text-xs text-muted-foreground">Personal Tracker</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <div className="text-xs">
            <p className="font-medium">Track your path</p>
            <p className="text-muted-foreground">Wealth → Europe</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
