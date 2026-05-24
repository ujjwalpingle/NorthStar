"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, CheckCircle2, Circle, Trash2, Trophy, Telescope } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/contexts/app-context";
import type { Goal, GoalCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_CONFIG: Record<GoalCategory, { label: string; color: string; icon: string; phase: number }> = {
  financial: { label: "Financial",  color: "text-yellow-400  bg-yellow-400/10  border-yellow-400/20",  icon: "💰", phase: 1 },
  learning:  { label: "Learning",   color: "text-blue-400    bg-blue-400/10    border-blue-400/20",     icon: "📚", phase: 1 },
  fitness:   { label: "Fitness",    color: "text-orange-400  bg-orange-400/10  border-orange-400/20",   icon: "💪", phase: 1 },
  career:    { label: "Career",     color: "text-primary     bg-primary/10     border-primary/20",      icon: "🚀", phase: 2 },
  migration: { label: "Migration",  color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",  icon: "✈️", phase: 3 },
};

const PHASES = [
  { id: 1, label: "Phase 1 — Build",       year: "2026",      desc: "Skills, savings, discipline" },
  { id: 2, label: "Phase 2 — Elevate",     year: "2027",      desc: "Better role, stronger brand" },
  { id: 3, label: "Phase 3 — Relocate",    year: "2028",      desc: "Europe, EU Blue Card" },
  { id: 4, label: "Phase 4 — Stabilize",   year: "2029",      desc: "Build wealth abroad" },
  { id: 5, label: "Phase 5 — Legacy",      year: "2030+",     desc: "Impact, investing, freedom" },
];

function goalProgress(goal: Goal): number {
  if (goal.targetValue && goal.currentValue !== null) {
    return Math.min(Math.round((goal.currentValue! / goal.targetValue) * 100), 100);
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
  const nextMilestone = goal.milestones.find((m) => !m.completed);

  return (
    <Card className={cn("transition-all", goal.status === "completed" && "opacity-50")}>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md border", cfg.color)}>
                {cfg.icon} {cfg.label}
              </span>
              {daysLeft !== null && (
                <span className={cn("text-[10px] text-muted-foreground", daysLeft < 60 && "text-orange-400 font-medium")}>
                  {daysLeft > 0 ? `${daysLeft}d left` : "Overdue"}
                </span>
              )}
              {goal.status === "completed" && <Badge variant="secondary">✓ Done</Badge>}
            </div>
            <h3 className="font-semibold text-sm">{goal.title}</h3>
            {goal.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{goal.description}</p>}
            {nextMilestone && (
              <p className="text-xs text-primary/70 mt-1">Next: {nextMilestone.title}</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {goal.status !== "completed" && (
              <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-400 opacity-60 hover:opacity-100"
                onClick={() => updateGoal(goal.id, { status: "completed" })}>
                <Trophy className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-30 hover:opacity-100" onClick={() => deleteGoal(goal.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {goal.targetValue && goal.currentValue !== null
                ? `${goal.unit}${goal.currentValue?.toLocaleString("en-IN")} / ${goal.unit}${goal.targetValue.toLocaleString("en-IN")}`
                : `${pct}%`}
            </span>
          </div>
          <Progress value={pct} />
        </div>

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

export default function VisionPage() {
  const { data, addGoal, activeGoalsCount } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{
    title: string; description: string; category: GoalCategory; deadline: string;
    targetValue: string; currentValue: string; unit: string;
  }>({ title: "", description: "", category: "career", deadline: "", targetValue: "", currentValue: "", unit: "%" });

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
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Telescope className="h-6 w-6 text-primary" /> Vision
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {activeGoalsCount} active goals · {completedCount} completed · Your 5-year roadmap
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4" /> Add Goal</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>New Goal</DialogTitle></DialogHeader>
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

        {/* Phase-based roadmap */}
        {PHASES.map((phase) => {
          const phaseGoals = data.goals.filter((g) => CATEGORY_CONFIG[g.category].phase === phase.id);
          const activePhaseGoals = phaseGoals.filter((g) => g.status !== "completed");

          return (
            <div key={phase.id}>
              {/* Phase header */}
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-2",
                  activePhaseGoals.length > 0
                    ? "bg-primary text-primary-foreground ring-primary/30"
                    : "bg-muted text-muted-foreground ring-border"
                )}>
                  {phase.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-sm">{phase.label}</h2>
                    <span className="text-xs text-muted-foreground">{phase.year}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{phase.desc}</p>
                </div>
                {phaseGoals.length > 0 && (
                  <span className="text-xs text-muted-foreground shrink-0">{phaseGoals.length} goal{phaseGoals.length !== 1 ? "s" : ""}</span>
                )}
              </div>

              {phaseGoals.length > 0 ? (
                <div className="space-y-3 ml-11">
                  {phaseGoals.map((g) => <GoalCard key={g.id} goal={g} />)}
                </div>
              ) : (
                <div className="ml-11 rounded-xl border border-dashed border-border/60 px-4 py-3">
                  <p className="text-xs text-muted-foreground">No goals for this phase yet.</p>
                </div>
              )}
            </div>
          );
        })}

        {/* Completed */}
        {completedCount > 0 && (
          <div>
            <h2 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-emerald-400" /> Completed ({completedCount})
            </h2>
            <div className="space-y-3">
              {data.goals.filter((g) => g.status === "completed").map((g) => <GoalCard key={g.id} goal={g} />)}
            </div>
          </div>
        )}

        {data.goals.length === 0 && (
          <div className="py-16 text-center">
            <Telescope className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-medium text-muted-foreground">No goals yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add your first goal to start building your vision</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
