"use client";

import { useState, useEffect, ReactNode } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Simple hardcoded password (change this to whatever you prefer)
const HARDCODED_PASSWORD = "ujjwal";

export function AuthGuard({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const auth = localStorage.getItem("northstar_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === HARDCODED_PASSWORD) {
      localStorage.setItem("northstar_auth", "true");
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
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
