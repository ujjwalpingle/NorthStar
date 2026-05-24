"use client";

import { useState } from "react";
import { Plus, Trash2, PieChart, Target, Flame } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/contexts/app-context";
import type { AccountCategory, AccountType, Currency } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const ACCOUNT_TYPES: Record<AccountType, string> = {
  checking: "Checking", savings: "Savings", investment: "Investment",
  crypto: "Crypto", property: "Property", gold: "Gold", other: "Other",
};

export default function WealthPage() {
  const { data, netWorth, totalAssets, totalLiabilities, addAccount, deleteAccount, addSnapshot } = useApp();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState<AccountType>("checking");
  const [category, setCategory] = useState<AccountCategory>("asset");
  const currency = data.profile.base_currency;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !balance) return;
    addAccount({
      name,
      type,
      category,
      currency: "INR", // Default to INR based on previous change
      balance: parseFloat(balance) || 0,
      institution: "",
      notes: "",
    });
    setName("");
    setBalance("");
  }

  const assets = data.accounts.filter((a) => a.category === "asset");
  const liabilities = data.accounts.filter((a) => a.category === "liability");

  // Calculate allocation
  const liquidCash = assets.filter(a => a.type === "checking" || a.type === "savings").reduce((acc, a) => acc + a.balance, 0);
  const investments = assets.filter(a => a.type === "investment" || a.type === "crypto").reduce((acc, a) => acc + a.balance, 0);
  const otherAssets = assets.filter(a => a.type !== "checking" && a.type !== "savings" && a.type !== "investment" && a.type !== "crypto").reduce((acc, a) => acc + a.balance, 0);

  const liquidPct = totalAssets > 0 ? Math.round((liquidCash / totalAssets) * 100) : 0;
  const investPct = totalAssets > 0 ? Math.round((investments / totalAssets) * 100) : 0;
  const otherPct = totalAssets > 0 ? Math.round((otherAssets / totalAssets) * 100) : 0;

  // FIRE Calculation
  const fireTarget = 50000000; // ₹5 Crore
  const firePct = Math.min(Math.round((netWorth / fireTarget) * 100), 100);

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Wealth Tracker</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Your personal balance sheet</p>
          </div>
          <Button variant="outline" size="sm" onClick={addSnapshot}>Save Snapshot</Button>
        </div>

        {/* Top Stats */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">Net Worth</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(netWorth, currency)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">Assets</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(totalAssets, currency)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">Liabilities</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{formatCurrency(totalLiabilities, currency)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboards Grid */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* FIRE Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-400" /> FIRE Target
              </CardTitle>
              <CardDescription>Target: ₹5 Cr (Financial Independence)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-emerald-400">{formatCurrency(netWorth, currency)}</span>
                  <span className="text-muted-foreground">{firePct}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-secondary/70 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all" style={{ width: `${firePct}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Asset Allocation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-primary" /> Asset Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex h-3 w-full rounded-full overflow-hidden">
                  <div className="bg-blue-400" style={{ width: `${liquidPct}%` }} />
                  <div className="bg-emerald-400" style={{ width: `${investPct}%` }} />
                  <div className="bg-yellow-400" style={{ width: `${otherPct}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-blue-400" /><span className="text-muted-foreground">Cash</span></div>
                    <p className="font-medium mt-1">{liquidPct}%</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-400" /><span className="text-muted-foreground">Invested</span></div>
                    <p className="font-medium mt-1">{investPct}%</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-yellow-400" /><span className="text-muted-foreground">Other</span></div>
                    <p className="font-medium mt-1">{otherPct}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Account */}
        <Card>
          <CardHeader><CardTitle>Add Account</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
              <div>
                <Label className="text-xs">Name</Label>
                <Input placeholder="e.g. HDFC Checking" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Balance (INR)</Label>
                <Input placeholder="0" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as AccountCategory)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asset">Asset</SelectItem>
                    <SelectItem value="liability">Liability</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as AccountType)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(ACCOUNT_TYPES).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full sm:w-auto"><Plus className="h-4 w-4" /> Add</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Assets */}
          <Card>
            <CardHeader><CardTitle>Assets ({assets.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {assets.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <div>
                    <p className="font-medium text-sm">{a.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{ACCOUNT_TYPES[a.type]}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-sm text-emerald-400">{formatCurrency(a.balance, a.currency)}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-400" onClick={() => deleteAccount(a.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Liabilities */}
          <Card>
            <CardHeader><CardTitle>Liabilities ({liabilities.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {liabilities.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No liabilities. Great job!</p>
              ) : (
                liabilities.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                    <div>
                      <p className="font-medium text-sm">{a.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{ACCOUNT_TYPES[a.type]}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-sm text-red-400">{formatCurrency(a.balance, a.currency)}</p>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-400" onClick={() => deleteAccount(a.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
