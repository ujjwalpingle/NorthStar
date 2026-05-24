"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Flame, Check, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/app-context";
import type { Habit, HabitCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<HabitCategory, string> = {
  fitness:  "text-orange-400  bg-orange-400/10  border-orange-400/20",
  learning: "text-blue-400    bg-blue-400/10    border-blue-400/20",
  career:   "text-primary     bg-primary/10     border-primary/20",
  life:     "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  finance:  "text-yellow-400  bg-yellow-400/10  border-yellow-400/20",
};

const CATEGORY_LABELS: Record<HabitCategory, string> = {
  fitness: "Fitness", learning: "Learning", career: "Career", life: "Life", finance: "Finance",
};

const ICONS = ["💪", "💻", "🧠", "📚", "🧘", "💰", "🎯", "🏃", "✍️", "🌅", "🧪", "📝"];

function WeekDots({ habitId, logs }: { habitId: string; logs: { habit_id: string; date: string; count: number }[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const done = logs.some((l) => l.habit_id === habitId && l.date === dateStr && l.count > 0);
    const isToday = i === 6;
    return { dateStr, done, isToday, label: format(d, "EEE")[0] };
  });

  return (
    <div className="flex items-center gap-1">
      {days.map(({ dateStr, done, isToday, label }) => (
        <div key={dateStr} className="flex flex-col items-center gap-0.5">
          <span className="text-[9px] text-muted-foreground">{label}</span>
          <div
            className={cn(
              "h-5 w-5 rounded-full border transition-all",
              done
                ? "bg-primary border-primary/50"
                : isToday
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-muted/30"
            )}
          />
        </div>
      ))}
    </div>
  );
}

function HabitCard({ habit }: { habit: Habit }) {
  const { logHabit, unlogHabit, habitStreaks, todayHabitIds, deleteHabit, data } = useApp();
  const today = new Date().toISOString().split("T")[0];
  const done = todayHabitIds.has(habit.id);
  const streak = habitStreaks[habit.id] ?? 0;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all",
        done ? "border-primary/30 bg-primary/5" : "border-border bg-card hover:border-border/70"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => done ? unlogHabit(habit.id, today) : logHabit(habit.id, today)}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-xl transition-all active:scale-95",
              done
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-muted/30 hover:border-primary/50"
            )}
          >
            {done ? <Check className="h-5 w-5" /> : habit.icon}
          </button>
          <div className="min-w-0">
            <p className={cn("font-medium text-sm", done && "line-through text-muted-foreground")}>{habit.name}</p>
            <span className={cn("text-[10px] px-1.5 py-0.5 rounded-md border font-medium", CATEGORY_COLORS[habit.category])}>
              {CATEGORY_LABELS[habit.category]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {streak > 0 && (
            <div className="flex items-center gap-1 text-orange-400">
              <Flame className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">{streak}</span>
            </div>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-40 hover:opacity-100" onClick={() => deleteHabit(habit.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="mt-3 pl-[52px]">
        <WeekDots habitId={habit.id} logs={data.habitLogs} />
      </div>
    </div>
  );
}

export default function HabitsPage() {
  const { data, addHabit, currentStreak, todayHabitIds } = useApp();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [newHabit, setNewHabit] = useState<{ name: string; icon: string; category: HabitCategory }>({
    name: "", icon: "🎯", category: "career",
  });

  const todayDone = todayHabitIds.size;
  const todayTotal = data.habits.length;
  const todayPct = todayTotal > 0 ? Math.round((todayDone / todayTotal) * 100) : 0;

  const filtered = activeTab === "all"
    ? data.habits
    : data.habits.filter((h) => h.category === activeTab);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newHabit.name.trim()) return;
    addHabit({ ...newHabit, frequency: "daily", targetCount: 1 });
    setNewHabit({ name: "", icon: "🎯", category: "career" });
    setOpen(false);
  }

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Habit Tracker</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {format(new Date(), "EEEE, MMMM d")} · Build discipline every day
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4" /> Add Habit</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Habit</DialogTitle></DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input placeholder="e.g. Morning run" value={newHabit.name} onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })} required className="mt-1" />
                </div>
                <div>
                  <Label>Icon</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {ICONS.map((icon) => (
                      <button key={icon} type="button" onClick={() => setNewHabit({ ...newHabit, icon })}
                        className={cn("h-9 w-9 rounded-lg border text-lg transition-all", newHabit.icon === icon ? "border-primary bg-primary/10" : "border-border hover:border-primary/40")}>
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={newHabit.category} onValueChange={(v) => setNewHabit({ ...newHabit, category: v as HabitCategory })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(CATEGORY_LABELS) as HabitCategory[]).map((c) => (
                        <SelectItem key={c} value={c}>{newHabit.icon} {CATEGORY_LABELS[c]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Add Habit</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{currentStreak}</p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center gap-1"><Flame className="h-3 w-3 text-orange-400" /> Best streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{todayDone}<span className="text-base text-muted-foreground">/{todayTotal}</span></p>
              <p className="text-xs text-muted-foreground mt-0.5">Today done</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{todayPct}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Today's progress</span>
            <span>{todayDone}/{todayTotal} habits</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary/70 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${todayPct}%`, background: "linear-gradient(90deg, #7c3aed, #a78bfa)" }}
            />
          </div>
        </div>

        {/* Habit list */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {(Object.keys(CATEGORY_LABELS) as HabitCategory[]).map((c) => (
              <TabsTrigger key={c} value={c}>{CATEGORY_LABELS[c]}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-10">No habits in this category. Add one!</p>
              ) : (
                filtered.map((h) => <HabitCard key={h.id} habit={h} />)
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
