"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Compass,
  LayoutDashboard,
  Settings,
  Star,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/wealth", label: "Wealth", icon: Wallet },
  { href: "/career", label: "Career", icon: Briefcase },
  { href: "/migration", label: "Migration", icon: Compass },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors min-w-[64px]",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-primary")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-background/95 backdrop-blur-md px-4 md:hidden">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <Star className="h-4 w-4 text-primary-foreground" />
      </div>
      <span className="font-semibold">Ujjwal's Tracker</span>
    </header>
  );
}
