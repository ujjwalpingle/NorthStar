"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/contexts/app-context";
import { EUROPE_COUNTRIES, type Currency } from "@/lib/types";

export default function SettingsPage() {
  const { data, updateProfile } = useApp();

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                className="mt-1"
                value={data.profile.full_name}
                onChange={(e) => updateProfile({ full_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" className="mt-1" value={data.profile.email} disabled />
            </div>
            <div>
              <Label>Base currency</Label>
              <Select
                value={data.profile.base_currency}
                onValueChange={(v) => updateProfile({ base_currency: v as Currency })}
              >
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["EUR", "USD", "GBP", "CHF"] as Currency[]).map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target country for migration</Label>
              <Select
                value={data.profile.target_country}
                onValueChange={(v) => updateProfile({ target_country: v })}
              >
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EUROPE_COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
