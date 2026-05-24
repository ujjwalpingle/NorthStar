export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isDemoMode(): boolean {
  return !isSupabaseConfigured();
}

// Auth configuration
export function getAuthPassword(): string {
  return process.env.NEXT_PUBLIC_AUTH_PASSWORD || "northstar";
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}
