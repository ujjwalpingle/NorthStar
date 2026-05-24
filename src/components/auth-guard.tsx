"use client";

import { useState, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isDemoMode, isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

export function AuthGuard({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          setIsAuthenticated(!!session);
        } catch (err) {
          setIsAuthenticated(false);
        }
      } else {
        const demoUser = localStorage.getItem("demo_user");
        const legacyAuth = localStorage.getItem("northstar_auth");
        setIsAuthenticated(!!demoUser || legacyAuth === "true");
      }
    }
    checkAuth();

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setIsAuthenticated(!!session);
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated === false && pathname !== "/login" && pathname !== "/signup") {
      router.push("/login");
    }
  }, [isAuthenticated, pathname, router]);

  async function handleLogout() {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Logout error:", err);
      }
    } else {
      localStorage.removeItem("northstar_auth");
      localStorage.removeItem("demo_user");
    }
    setIsAuthenticated(false);
    router.push("/login");
  }

  // Prevent flash of content before checking auth state
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-background" />;
  }

  // Allow public routes
  if (pathname === "/login" || pathname === "/signup") {
    // If already authenticated and trying to access login/signup, redirect to dashboard
    if (isAuthenticated) {
      router.push("/dashboard");
      return <div className="min-h-screen bg-background" />;
    }
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-background" />; // will redirect in useEffect
  }

  // Authenticated - render children with logout button
  return (
    <div>
      {children}
      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 text-xs text-muted-foreground hover:text-foreground transition-colors z-50 bg-background/80 px-2 py-1 rounded border shadow-sm backdrop-blur"
        title="Sign out"
      >
        Sign out
      </button>
    </div>
  );
}
