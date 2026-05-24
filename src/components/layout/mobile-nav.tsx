"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Compass, Flame, LayoutDashboard, Settings, Target, TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home",      icon: LayoutDashboard },
  { href: "/wealth",    label: "Wealth",    icon: Wallet },
  { href: "/habits",   label: "Habits",    icon: Flame },
  { href: "/goals",    label: "Goals",     icon: Target },
  { href: "/migration",label: "Migration", icon: Compass },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="bg-sidebar/95 backdrop-blur-xl">
        <div className="flex items-center justify-around px-1 py-2 pb-safe">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-medium transition-all",
                  active ? "text-primary" : "text-muted-foreground active:scale-95"
                )}
              >
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-all", active ? "bg-primary/15" : "bg-transparent")}>
                  <Icon className={cn("h-4 w-4 transition-transform", active && "scale-110")} />
                </div>
                <span className={cn(active && "text-primary font-semibold")}>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 md:hidden">
      <div className="flex h-14 items-center gap-2.5 bg-sidebar/95 backdrop-blur-xl px-4 border-b border-sidebar-border">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="text-sm font-semibold tracking-tight">NorthStar</span>
      </div>
    </header>
  );
}
