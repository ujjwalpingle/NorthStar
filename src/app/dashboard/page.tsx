"use client";

import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { format } from "date-fns";
import {
  ArrowUpRight, Compass, Flame, Target, TrendingUp, Wallet, CheckSquare,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/contexts/app-context";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

function StatCard({
  title, value, subtitle, icon: Icon, trend, accent,
}: {
  title: string; value: string; subtitle?: string; icon: React.ElementType; trend?: string; accent?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="mt-1 text-xl font-bold tracking-tight">{value}</p>
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
            {trend && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-400">
                <ArrowUpRight className="h-3 w-3" />{trend}
              </p>
            )}
          </div>
          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", accent ?? "bg-primary/10")}>
            <Icon className={cn("h-4 w-4", accent ? "text-white" : "text-primary")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreMeter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-secondary/70 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const {
    data, netWorth, totalAssets, totalLiabilities, checklistProgress,
    loading, europeReadinessScore, currentStreak, activeGoalsCount, todayHabitIds,
  } = useApp();
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

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = data.dailyTasks.filter((t) => t.date === today);
  const todayTasksDone = todayTasks.filter((t) => t.completed).length;
  const todayHabitsDone = todayHabitIds.size;

  // Career readiness score (proxy)
  const careerScore = Math.round(((data.career.currentPhase - 1) / 4) * 100);
  const interviewScore = data.interviewPrep
    ? Math.round((data.interviewPrep.dsaSolved / data.interviewPrep.dsaTarget) * 100)
    : 0;

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
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, Ujjwal 👋
          </h1>
          <p className="text-muted-foreground text-sm">
            {format(new Date(), "EEEE, MMMM d")} · {data.migrationGoal?.target_country ?? "Germany"} · {data.migrationGoal?.visa_type ?? "EU Blue Card"}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 stagger">
          <StatCard
            title="Net Worth" icon={Wallet}
            value={formatCurrency(netWorth, currency)}
            trend={`+${growth}% since start`}
          />
          <StatCard
            title="Total Assets" icon={TrendingUp}
            value={formatCurrency(totalAssets, currency)}
            subtitle={`Liabilities: ${formatCurrency(totalLiabilities, currency)}`}
          />
          <StatCard
            title="Habit Streak" icon={Flame}
            value={`${currentStreak} days`}
            subtitle={`${todayHabitsDone}/${data.habits.length} done today`}
            accent="bg-orange-500/20"
          />
          <StatCard
            title="Active Goals" icon={Target}
            value={`${activeGoalsCount}`}
            subtitle={`Migration: ${checklistProgress}% done`}
            accent="bg-primary/20"
          />
        </div>

        {/* Today's Focus + Scores */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Today's Focus */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" /> Today's Focus
              </CardTitle>
              <CardDescription>
                {todayTasksDone}/{todayTasks.length} tasks · {todayHabitsDone}/{data.habits.length} habits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {todayTasks.slice(0, 5).map((task) => (
                <div key={task.id} className={cn(
                  "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm",
                  task.completed ? "border-border/50 opacity-50" : "border-border"
                )}>
                  <div className={cn("h-1.5 w-1.5 rounded-full shrink-0",
                    task.priority === "high" ? "bg-red-400" : task.priority === "medium" ? "bg-yellow-400" : "bg-muted-foreground"
                  )} />
                  <span className={cn(task.completed && "line-through text-muted-foreground")}>{task.title}</span>
                  <Badge variant="secondary" className="ml-auto text-[10px] capitalize">{task.category}</Badge>
                </div>
              ))}
              {todayTasks.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">No tasks for today. Add some in Goals!</p>
              )}
            </CardContent>
          </Card>

          {/* Readiness Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Readiness Scores</CardTitle>
              <CardDescription>How ready are you for the next step?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScoreMeter label="🌍 Europe Readiness" value={europeReadinessScore} color="#a78bfa" />
              <ScoreMeter label="🚀 Career Phase Progress" value={careerScore} color="#60a5fa" />
              <ScoreMeter label="🧠 Interview Readiness (DSA)" value={interviewScore} color="#34d399" />
              <ScoreMeter label="✅ Migration Checklist" value={checklistProgress} color="#fb923c" />
            </CardContent>
          </Card>
        </div>

        {/* Charts row */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Net Worth Trend</CardTitle>
              <CardDescription>Monthly snapshots in {currency}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="nwGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#a78bfa" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}    />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
                    <YAxis stroke="#71717a" fontSize={11} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                    <Tooltip
                      contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
                      formatter={(value) => [formatCurrency(Number(value), currency), "Net Worth"]}
                    />
                    <Area type="monotone" dataKey="netWorth" stroke="#a78bfa" fill="url(#nwGradient)" strokeWidth={2} />
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
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Checklist completion</span>
                  <span className="font-medium">{checklistProgress}%</span>
                </div>
                <Progress value={checklistProgress} />
              </div>
              <div className="space-y-2">
                {[
                  { label: "Target country", value: data.migrationGoal?.target_country },
                  { label: "Visa type",      value: data.migrationGoal?.visa_type },
                  { label: "Status",         value: data.migrationGoal?.status.replace("_", " ") },
                  { label: "Target date",    value: data.migrationGoal?.target_date ? format(new Date(data.migrationGoal.target_date), "MMM yyyy") : "Not set" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <Badge variant="secondary" className="text-[10px] capitalize">{value}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Migration Tasks</CardTitle>
            <CardDescription>Next items on your checklist</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.checklist.filter((c) => !c.completed).slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
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
