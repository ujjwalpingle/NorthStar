"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Target, CheckCircle2, Circle, Trash2, Trophy } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/app-context";
import type { Goal, GoalCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_CONFIG: Record<GoalCategory, { label: string; color: string; icon: string }> = {
  financial: { label: "Financial",  color: "text-yellow-400  bg-yellow-400/10  border-yellow-400/20",  icon: "₹" },
  career:    { label: "Career",     color: "text-primary     bg-primary/10     border-primary/20",      icon: "🚀" },
  migration: { label: "Migration",  color: "text-blue-400    bg-blue-400/10    border-blue-400/20",     icon: "✈️" },
  fitness:   { label: "Fitness",    color: "text-orange-400  bg-orange-400/10  border-orange-400/20",   icon: "💪" },
  learning:  { label: "Learning",   color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",  icon: "📚" },
};

function goalProgress(goal: Goal): number {
  if (goal.targetValue && goal.currentValue !== null) {
    return Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
  }
  if (goal.milestones.length > 0) {
    return Math.round((goal.milestones.filter((m) => m.completed).length / goal.milestones.length) * 100);
  }
  return 0;
}

function GoalCard({ goal }: { goal: Goal }) {
  const { toggleGoalMilestone, deleteGoal, updateGoal } = useApp();
  const [expanded, setExpanded] = useState(false);
  const cfg = CATEGORY_CONFIG[goal.category];
  const pct = goalProgress(goal);
  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <Card className={cn(goal.status === "completed" && "opacity-60")}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md border", cfg.color)}>
                {cfg.icon} {cfg.label}
              </span>
              {daysLeft !== null && (
                <span className={cn("text-[10px] text-muted-foreground", daysLeft < 30 && "text-orange-400 font-medium")}>
                  {daysLeft > 0 ? `${daysLeft}d left` : "Overdue"}
                </span>
              )}
              {goal.status === "completed" && <Badge variant="secondary">✓ Done</Badge>}
            </div>
            <h3 className="font-semibold text-sm">{goal.title}</h3>
            {goal.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{goal.description}</p>}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {goal.status !== "completed" && (
              <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-400 opacity-60 hover:opacity-100"
                onClick={() => updateGoal(goal.id, { status: "completed" })}>
                <Trophy className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-40 hover:opacity-100" onClick={() => deleteGoal(goal.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-3 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {goal.targetValue && goal.currentValue !== null
                ? `${goal.unit}${goal.currentValue.toLocaleString("en-IN")} / ${goal.unit}${goal.targetValue.toLocaleString("en-IN")}`
                : `${pct}%`}
            </span>
          </div>
          <Progress value={pct} />
        </div>

        {/* Milestones toggle */}
        {goal.milestones.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? "▲ Hide" : "▼ Show"} milestones ({goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length})
          </button>
        )}

        {expanded && (
          <div className="mt-2 space-y-1.5 pl-1">
            {goal.milestones.map((m) => (
              <button
                key={m.id}
                onClick={() => toggleGoalMilestone(goal.id, m.id)}
                className="w-full flex items-center gap-2.5 text-left hover:bg-accent/40 rounded-lg px-2 py-1 transition-colors"
              >
                {m.completed
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />}
                <span className={cn("text-xs", m.completed && "line-through text-muted-foreground")}>{m.title}</span>
                {m.dueDate && (
                  <span className="ml-auto text-[10px] text-muted-foreground shrink-0">
                    {format(new Date(m.dueDate), "MMM yy")}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function GoalsPage() {
  const { data, addGoal, activeGoalsCount } = useApp();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("active");
  const [form, setForm] = useState<{
    title: string; description: string; category: GoalCategory; deadline: string;
    targetValue: string; currentValue: string; unit: string;
  }>({ title: "", description: "", category: "career", deadline: "", targetValue: "", currentValue: "", unit: "%" });

  const filtered = data.goals.filter((g) =>
    tab === "active" ? g.status === "active" : tab === "completed" ? g.status === "completed" : true
  );

  const completedCount = data.goals.filter((g) => g.status === "completed").length;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    addGoal({
      title: form.title,
      description: form.description,
      category: form.category,
      deadline: form.deadline || null,
      milestones: [],
      targetValue: form.targetValue ? parseFloat(form.targetValue) : null,
      currentValue: form.currentValue ? parseFloat(form.currentValue) : null,
      unit: form.unit,
      status: "active",
    });
    setForm({ title: "", description: "", category: "career", deadline: "", targetValue: "", currentValue: "", unit: "%" });
    setOpen(false);
  }

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Goals</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {activeGoalsCount} active · {completedCount} completed · Track what matters
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4" /> New Goal</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Create Goal</DialogTitle></DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input placeholder="e.g. Save ₹20L for Europe" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1" />
                </div>
                <div>
                  <Label>Description <span className="text-muted-foreground">(optional)</span></Label>
                  <Input placeholder="What does success look like?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as GoalCategory })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.entries(CATEGORY_CONFIG) as [GoalCategory, typeof CATEGORY_CONFIG[GoalCategory]][]).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v.icon} {v.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Deadline</Label>
                    <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Target</Label>
                    <Input placeholder="300" type="number" value={form.targetValue} onChange={(e) => setForm({ ...form, targetValue: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Current</Label>
                    <Input placeholder="87" type="number" value={form.currentValue} onChange={(e) => setForm({ ...form, currentValue: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Input placeholder="%" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="mt-1" />
                  </div>
                </div>
                <Button type="submit" className="w-full">Create Goal</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category summary pills */}
        <div className="flex flex-wrap gap-2">
          {(Object.entries(CATEGORY_CONFIG) as [GoalCategory, typeof CATEGORY_CONFIG[GoalCategory]][]).map(([cat, cfg]) => {
            const count = data.goals.filter((g) => g.category === cat && g.status === "active").length;
            if (count === 0) return null;
            return (
              <span key={cat} className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", cfg.color)}>
                {cfg.icon} {cfg.label} · {count}
              </span>
            );
          })}
        </div>

        {/* Goals list */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="active">Active ({activeGoalsCount})</TabsTrigger>
            <TabsTrigger value="completed">Done ({completedCount})</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <TabsContent value={tab} className="mt-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No goals here. Create one!</p>
              </div>
            ) : (
              filtered.map((g) => <GoalCard key={g.id} goal={g} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
