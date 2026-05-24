import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader, MobileNav } from "@/components/layout/mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileHeader />
      <main className="md:pl-60">
        <div className="mx-auto max-w-5xl px-5 py-7 pb-28 md:pb-10 animate-fade-in">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
