"use client";

import { useState, useEffect, ReactNode } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isDemoMode, getAuthPassword, isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";

export function AuthGuard({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const demo = isDemoMode();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    // Check if using Supabase
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (err) {
        // Fallback to localStorage if Supabase fails
        const auth = localStorage.getItem("northstar_auth");
        setIsAuthenticated(auth === "true");
      }
    } else {
      // Demo/Local mode: check localStorage
      const auth = localStorage.getItem("northstar_auth");
      setIsAuthenticated(auth === "true");
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSupabaseConfigured()) {
        // Supabase authentication
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email || "user@northstar.app",
          password: password,
        });

        if (authError) {
          setError(authError.message || "Authentication failed");
        } else {
          setIsAuthenticated(true);
          setError("");
          setEmail("");
          setPassword("");
        }
      } else {
        // Demo/Local mode: simple password
        const correctPassword = getAuthPassword();
        if (password === correctPassword) {
          localStorage.setItem("northstar_auth", "true");
          setIsAuthenticated(true);
          setError("");
          setPassword("");
        } else {
          setError("Invalid password");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

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
    }
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
  }

  // Prevent flash of content before checking auth state
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <Card className="w-full max-w-sm relative z-10 border-border/50 shadow-2xl shadow-primary/5">
          <CardHeader className="space-y-3 pb-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl">Welcome to NorthStar</CardTitle>
              <CardDescription>
                {isSupabaseConfigured() 
                  ? "Sign in with your credentials"
                  : "Enter your password to continue"}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {isSupabaseConfigured() && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoFocus
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {isSupabaseConfigured() ? "Password" : "Access Password"}
                </label>
                <Input
                  type="password"
                  placeholder={isSupabaseConfigured() ? "••••••••" : "Enter password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoFocus={!isSupabaseConfigured()}
                />
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !password}
                className="w-full"
              >
                {loading ? "Signing in..." : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {isSupabaseConfigured() && (
                <div className="text-center text-xs text-muted-foreground">
                  Single-user app • Your data syncs across devices
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated - render children with logout button
  return (
    <div>
      {children}
      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
        title="Sign out"
      >
        Sign out
      </button>
    </div>
  );
}
        
        <Card className="w-full max-w-sm relative z-10 border-border/50 shadow-2xl shadow-primary/5">
          <CardHeader className="space-y-3 pb-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">NorthStar OS</CardTitle>
              <CardDescription className="mt-1">Enter your password to continue</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
                  autoFocus
                />
                {error && <p className="text-xs text-red-500 font-medium">Incorrect password. Please try again.</p>}
              </div>
              <Button type="submit" className="w-full group">
                Unlock <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
