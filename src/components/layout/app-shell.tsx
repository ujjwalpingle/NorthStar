import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader, MobileNav } from "@/components/layout/mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileHeader />
      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:pb-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
