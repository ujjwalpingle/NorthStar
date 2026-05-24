"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Globe,
  Flame,
  LayoutDashboard,
  Settings,
  Telescope,
  TrendingUp,
  Wallet,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/app-context";

const navItems = [
  { href: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { href: "/wealth",     label: "Wealth",      icon: Wallet },
  { href: "/career",     label: "Career",      icon: Briefcase },
  { href: "/momentum",   label: "Momentum",    icon: Flame },
  { href: "/europe",     label: "Europe",       icon: Globe },
  { href: "/journal",    label: "Journal",     icon: BookOpen },
  { href: "/vision",     label: "Vision",      icon: Telescope },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data } = useApp();
  const name = data?.profile?.full_name || "Ujjwal";

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r bg-sidebar border-sidebar-border">

      {/* Brand */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
          <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">NorthStar</p>
          <p className="text-[11px] text-muted-foreground">{name}&apos;s OS</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="px-2 mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Navigation
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium relative transition-all",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
              )}
              <Icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", active && "text-primary")} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border flex items-center justify-between">
        <div className="rounded-lg bg-muted/40 px-3 py-2.5 flex-1 mr-2">
          <p className="text-xs font-medium text-foreground">Build → Relocate → Thrive</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">The engineer&apos;s system</p>
        </div>
        <Link
          href="/settings"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-all shrink-0",
            pathname === "/settings"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
          )}
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
