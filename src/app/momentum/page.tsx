"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Flame, Check, Trash2, CheckSquare, Square } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/app-context";
import type { DailyTask, Habit, HabitCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<HabitCategory, string> = {
  fitness:  "text-orange-400  bg-orange-400/10  border-orange-400/20",
  learning: "text-blue-400    bg-blue-400/10    border-blue-400/20",
  career:   "text-primary     bg-primary/10     border-primary/20",
  life:     "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  finance:  "text-yellow-400  bg-yellow-400/10  border-yellow-400/20",
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

function HabitRow({ habit }: { habit: Habit }) {
  const { logHabit, unlogHabit, habitStreaks, todayHabitIds, deleteHabit, data } = useApp();
  const today = new Date().toISOString().split("T")[0];
  const done = todayHabitIds.has(habit.id);
  const streak = habitStreaks[habit.id] ?? 0;

  return (
    <div className={cn(
      "rounded-xl border p-4 transition-all",
      done ? "border-primary/30 bg-primary/5" : "border-border bg-card"
    )}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => done ? unlogHabit(habit.id, today) : logHabit(habit.id, today)}
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 text-xl transition-all active:scale-95",
            done
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-muted/30 hover:border-primary/50"
          )}
        >
          {done ? <Check className="h-5 w-5" /> : habit.icon}
        </button>
        <div className="flex-1 min-w-0">
          <p className={cn("font-medium text-sm", done && "line-through text-muted-foreground")}>{habit.name}</p>
          <WeekDots habitId={habit.id} logs={data.habitLogs} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {streak > 0 && (
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-bold text-orange-400">{streak}</span>
            </div>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-30 hover:opacity-100" onClick={() => deleteHabit(habit.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function TaskRow({ task }: { task: DailyTask }) {
  const { toggleDailyTask, deleteDailyTask } = useApp();
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-xl border px-4 py-3 transition-all",
      task.completed ? "border-border/40 opacity-50" : "border-border bg-card"
    )}>
      <button onClick={() => toggleDailyTask(task.id)} className="shrink-0 text-primary hover:scale-110 transition-transform">
        {task.completed ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5 text-muted-foreground" />}
      </button>
      <span className={cn("text-sm flex-1", task.completed && "line-through text-muted-foreground")}>{task.title}</span>
      <div className={cn(
        "h-1.5 w-1.5 rounded-full shrink-0",
        task.priority === "high" ? "bg-red-400" : task.priority === "medium" ? "bg-yellow-400" : "bg-muted-foreground"
      )} />
      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-30 hover:opacity-100 shrink-0" onClick={() => deleteDailyTask(task.id)}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export default function MomentumPage() {
  const { data, addHabit, addDailyTask, currentStreak, todayHabitIds } = useApp();
  const [habitOpen, setHabitOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [newHabit, setNewHabit] = useState<{ name: string; icon: string; category: HabitCategory }>({
    name: "", icon: "🎯", category: "career",
  });
  const [newTask, setNewTask] = useState({ title: "", category: "work" as DailyTask["category"], priority: "medium" as DailyTask["priority"] });

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = data.dailyTasks.filter((t) => t.date === today);
  const todayDone = todayHabitIds.size;
  const todayTotal = data.habits.length;
  const tasksDone = todayTasks.filter((t) => t.completed).length;

  function handleAddHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!newHabit.name.trim()) return;
    addHabit({ ...newHabit, frequency: "daily", targetCount: 1 });
    setNewHabit({ name: "", icon: "🎯", category: "career" });
    setHabitOpen(false);
  }

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    addDailyTask({ ...newTask, completed: false, date: today });
    setNewTask({ title: "", category: "work", priority: "medium" });
    setTaskOpen(false);
  }

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Momentum</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {format(new Date(), "EEEE, MMMM d")} · {todayDone}/{todayTotal} habits · {tasksDone}/{todayTasks.length} tasks
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Flame className="h-5 w-5 text-orange-400" />
                <p className="text-2xl font-bold text-orange-400">{currentStreak}</p>
              </div>
              <p className="text-xs text-muted-foreground">Day streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{todayDone}<span className="text-base text-muted-foreground">/{todayTotal}</span></p>
              <p className="text-xs text-muted-foreground mt-1">Habits today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{tasksDone}<span className="text-base text-muted-foreground">/{todayTasks.length}</span></p>
              <p className="text-xs text-muted-foreground mt-1">Tasks done</p>
            </CardContent>
          </Card>
        </div>

        {/* Habits section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-400" /> Daily Habits
            </h2>
            <Dialog open={habitOpen} onOpenChange={setHabitOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline"><Plus className="h-3.5 w-3.5" /> Add Habit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New Habit</DialogTitle></DialogHeader>
                <form onSubmit={handleAddHabit} className="space-y-4">
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
                        <SelectItem value="fitness">💪 Fitness</SelectItem>
                        <SelectItem value="learning">📚 Learning</SelectItem>
                        <SelectItem value="career">🚀 Career</SelectItem>
                        <SelectItem value="life">🧘 Life</SelectItem>
                        <SelectItem value="finance">💰 Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">Add Habit</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2">
            {data.habits.length === 0 ? (
              <div className="py-8 text-center rounded-xl border border-dashed border-border">
                <p className="text-3xl mb-2">🔥</p>
                <p className="text-sm text-muted-foreground">No habits yet. Add your first daily habit!</p>
              </div>
            ) : (
              data.habits.map((h) => <HabitRow key={h.id} habit={h} />)
            )}
          </div>
        </div>

        {/* Daily tasks section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-primary" /> Today's Tasks
            </h2>
            <Dialog open={taskOpen} onOpenChange={setTaskOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline"><Plus className="h-3.5 w-3.5" /> Add Task</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
                <form onSubmit={handleAddTask} className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input placeholder="e.g. Review Kubernetes chapter" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Category</Label>
                      <Select value={newTask.category} onValueChange={(v) => setNewTask({ ...newTask, category: v as DailyTask["category"] })}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="learning">Learning</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="migration">Migration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v as DailyTask["priority"] })}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">🔴 High</SelectItem>
                          <SelectItem value="medium">🟡 Medium</SelectItem>
                          <SelectItem value="low">🟢 Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Add Task</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2">
            {todayTasks.length === 0 ? (
              <div className="py-8 text-center rounded-xl border border-dashed border-border">
                <p className="text-3xl mb-2">✅</p>
                <p className="text-sm text-muted-foreground">No tasks for today. Add something to crush!</p>
              </div>
            ) : (
              todayTasks.map((t) => <TaskRow key={t.id} task={t} />)
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
