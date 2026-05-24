"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/app-context";
import type { AccountCategory, AccountType, Currency } from "@/lib/types";
import { toEUR } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function WealthPage() {
  const { data, netWorth, totalAssets, totalLiabilities, addAccount, deleteAccount, addSnapshot } = useApp();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const currency = data.profile.base_currency;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !balance) return;
    addAccount({
      name,
      type: "checking" as AccountType,
      category: "asset" as AccountCategory,
      currency: "EUR" as Currency,
      balance: parseFloat(balance) || 0,
      institution: "",
      notes: "",
    });
    setName("");
    setBalance("");
  }

  const assets = data.accounts.filter((a) => a.category === "asset");
  const liabilities = data.accounts.filter((a) => a.category === "liability");

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Wealth Tracker</h1>
            <p className="text-muted-foreground">Your accounts and net worth</p>
          </div>
          <Button variant="outline" onClick={addSnapshot}>Save Snapshot</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Net Worth</p><p className="text-2xl font-bold">{formatCurrency(netWorth, currency)}</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Assets</p><p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalAssets, currency)}</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Liabilities</p><p className="text-2xl font-bold text-red-400">{formatCurrency(totalLiabilities, currency)}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Add Account</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
              <Input placeholder="Account name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} />
              <Button type="submit"><Plus className="h-4 w-4" /> Add</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Assets ({assets.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {assets.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.institution || a.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-medium">{formatCurrency(a.balance, a.currency)}</p>
                  <Badge variant="secondary">{a.currency}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => deleteAccount(a.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {liabilities.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Liabilities</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {liabilities.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <p className="font-medium">{a.name}</p>
                  <p className="text-red-400">{formatCurrency(toEUR(a.balance, a.currency), currency)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
