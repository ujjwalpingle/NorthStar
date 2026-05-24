"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, Compass, Target, Wallet } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/contexts/app-context";
import { formatCurrency } from "@/lib/utils";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
            {trend && (
              <p className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                <ArrowUpRight className="h-3 w-3" />
                {trend}
              </p>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, netWorth, totalAssets, totalLiabilities, checklistProgress, loading } = useApp();
  const currency = data.profile.base_currency;

  const chartData = data.snapshots.map((s) => ({
    date: format(new Date(s.snapshot_date), "MMM yy"),
    netWorth: s.net_worth,
  }));

  const firstSnapshot = data.snapshots[0];
  const growth =
    firstSnapshot && firstSnapshot.net_worth > 0
      ? (((netWorth - firstSnapshot.net_worth) / firstSnapshot.net_worth) * 100).toFixed(1)
      : "0";

  if (loading) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center text-muted-foreground">Loading...</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, Ujjwal
          </h1>
          <p className="text-muted-foreground">
            Target: {data.migrationGoal?.target_country ?? data.profile.target_country} · {data.migrationGoal?.visa_type ?? "Planning"}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Net Worth"
            value={formatCurrency(netWorth, currency)}
            trend={`+${growth}% since start`}
            icon={Wallet}
          />
          <StatCard
            title="Total Assets"
            value={formatCurrency(totalAssets, currency)}
            icon={Target}
          />
          <StatCard
            title="Liabilities"
            value={formatCurrency(totalLiabilities, currency)}
            icon={Wallet}
          />
          <StatCard
            title="Migration Progress"
            value={`${checklistProgress}%`}
            subtitle={`${data.checklist.filter((c) => c.completed).length}/${data.checklist.length} tasks done`}
            icon={Compass}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Net Worth Trend</CardTitle>
              <CardDescription>Monthly snapshots in {currency}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="nwGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 8 }}
                      formatter={(value) => [formatCurrency(Number(value), currency), "Net Worth"]}
                    />
                    <Area type="monotone" dataKey="netWorth" stroke="#3b82f6" fill="url(#nwGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Migration Overview</CardTitle>
              <CardDescription>Your path to {data.migrationGoal?.target_country}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Checklist completion</span>
                  <span className="font-medium">{checklistProgress}%</span>
                </div>
                <Progress value={checklistProgress} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm">Target country</span>
                  <Badge variant="secondary">{data.migrationGoal?.target_country}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm">Visa type</span>
                  <Badge>{data.migrationGoal?.visa_type}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm">Target date</span>
                  <span className="text-sm font-medium">
                    {data.migrationGoal?.target_date
                      ? format(new Date(data.migrationGoal.target_date), "MMM d, yyyy")
                      : "Not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm">Status</span>
                  <Badge variant="warning">{data.migrationGoal?.status.replace("_", " ")}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Next migration checklist items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.checklist
                .filter((c) => !c.completed)
                .slice(0, 4)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                    </div>
                    <Badge variant={item.priority === "high" ? "destructive" : item.priority === "medium" ? "warning" : "secondary"}>
                      {item.priority}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
