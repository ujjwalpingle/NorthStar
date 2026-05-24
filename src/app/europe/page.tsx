"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/app-context";
import { EUROPE_COUNTRIES, VISA_TYPES, type ChecklistCategory } from "@/lib/types";

const CATEGORIES: ChecklistCategory[] = ["visa", "documents", "finance", "housing", "healthcare", "tax", "other"];

const categoryLabels: Record<ChecklistCategory, string> = {
  visa: "Visa",
  documents: "Documents",
  finance: "Finance",
  housing: "Housing",
  healthcare: "Healthcare",
  tax: "Tax",
  other: "Other",
};

const categoryEmoji: Record<ChecklistCategory, string> = {
  visa: "🛂",
  documents: "📄",
  finance: "💰",
  housing: "🏠",
  healthcare: "🏥",
  tax: "📊",
  other: "📌",
};

export default function EuropePage() {
  const {
    data,
    checklistProgress,
    toggleChecklistItem,
    addChecklistItem,
    deleteChecklistItem,
    updateMigrationGoal,
  } = useApp();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("all");
  const [newItem, setNewItem] = useState({
    title: "",
    category: "other" as ChecklistCategory,
    priority: "medium" as "low" | "medium" | "high",
    due_date: "",
  });

  const goal = data.migrationGoal;
  const filtered =
    tab === "all" ? data.checklist : data.checklist.filter((c) => c.category === tab);

  const daysToTarget = goal?.target_date
    ? Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / 86400000)
    : null;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addChecklistItem({
      title: newItem.title,
      category: newItem.category,
      description: "",
      completed: false,
      due_date: newItem.due_date || null,
      priority: newItem.priority,
    });
    setNewItem({ title: "", category: "other", priority: "medium", due_date: "" });
    setOpen(false);
  }

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Europe 🌍</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {goal?.target_country ?? "Your destination"} ·{" "}
              {goal?.visa_type ?? "Visa TBD"} ·{" "}
              {daysToTarget !== null ? `${daysToTarget} days to go` : "Set your target date"}
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4" /> Add Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Checklist Item</DialogTitle></DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} required className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v as ChecklistCategory })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>{categoryEmoji[c]} {categoryLabels[c]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={newItem.priority} onValueChange={(v) => setNewItem({ ...newItem, priority: v as "low" | "medium" | "high" })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">🔴 High</SelectItem>
                        <SelectItem value="medium">🟡 Medium</SelectItem>
                        <SelectItem value="low">🟢 Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Due date <span className="text-muted-foreground">(optional)</span></Label>
                  <Input type="date" value={newItem.due_date} onChange={(e) => setNewItem({ ...newItem, due_date: e.target.value })} className="mt-1" />
                </div>
                <Button type="submit" className="w-full">Add Task</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goal settings */}
        <Card>
          <CardHeader>
            <CardTitle>Migration Goal</CardTitle>
            <CardDescription>Your target country, visa plan and timeline</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label className="text-xs text-muted-foreground">Target country</Label>
              <Select
                value={goal?.target_country ?? ""}
                onValueChange={(v) => updateMigrationGoal({ target_country: v })}
              >
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EUROPE_COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Visa type</Label>
              <Select
                value={goal?.visa_type ?? ""}
                onValueChange={(v) => updateMigrationGoal({ visa_type: v })}
              >
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VISA_TYPES.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Target date</Label>
              <Input
                type="date"
                className="mt-1"
                value={goal?.target_date?.split("T")[0] ?? ""}
                onChange={(e) => updateMigrationGoal({ target_date: e.target.value || null })}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select
                value={goal?.status ?? "planning"}
                onValueChange={(v) => updateMigrationGoal({ status: v as NonNullable<typeof goal>["status"] })}
              >
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Progress bar */}
        <Card>
          <CardContent className="p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-sm">Overall Progress</span>
              <span className="text-sm font-bold text-primary">{checklistProgress}%</span>
            </div>
            <Progress value={checklistProgress} className="h-2.5" />
            <p className="mt-2 text-xs text-muted-foreground">
              {data.checklist.filter((c) => c.completed).length} of {data.checklist.length} tasks complete
            </p>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="all">All ({data.checklist.length})</TabsTrigger>
            {CATEGORIES.map((c) => {
              const count = data.checklist.filter((i) => i.category === c).length;
              if (count === 0) return null;
              return (
                <TabsTrigger key={c} value={c}>{categoryEmoji[c]} {categoryLabels[c]} · {count}</TabsTrigger>
              );
            })}
          </TabsList>
          <TabsContent value={tab} className="mt-4 space-y-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-all ${
                  item.completed ? "border-border/40 bg-muted/20 opacity-60" : "border-border bg-card"
                }`}
              >
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => toggleChecklistItem(item.id)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                    {item.title}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2 items-center">
                    <Badge variant="secondary" className="capitalize text-[10px]">
                      {categoryEmoji[item.category]} {item.category}
                    </Badge>
                    <Badge
                      variant={item.priority === "high" ? "destructive" : item.priority === "medium" ? "warning" : "secondary"}
                      className="text-[10px]"
                    >
                      {item.priority}
                    </Badge>
                    {item.due_date && (
                      <span className="text-xs text-muted-foreground">
                        Due {format(new Date(item.due_date), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-40 hover:opacity-100 shrink-0" onClick={() => deleteChecklistItem(item.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-4xl mb-3">🌍</p>
                <p className="text-sm text-muted-foreground">No tasks here. Add your first checklist item!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
