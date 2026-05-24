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

export default function MigrationPage() {
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
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Migration Tracker</h1>
            <p className="text-muted-foreground">Your checklist to Europe</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4" /> Add Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Checklist Item</DialogTitle></DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v as ChecklistCategory })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>{categoryLabels[c]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={newItem.priority} onValueChange={(v) => setNewItem({ ...newItem, priority: v as "low" | "medium" | "high" })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Due date (optional)</Label>
                  <Input type="date" value={newItem.due_date} onChange={(e) => setNewItem({ ...newItem, due_date: e.target.value })} />
                </div>
                <Button type="submit" className="w-full">Add Task</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Migration Goal</CardTitle>
            <CardDescription>Update your target country and visa plan</CardDescription>
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
                onValueChange={(v) => updateMigrationGoal({ status: v as typeof goal extends null ? never : NonNullable<typeof goal>["status"] })}
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

        <Card>
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {data.checklist.filter((c) => c.completed).length} of {data.checklist.length} complete
              </span>
            </div>
            <Progress value={checklistProgress} className="h-3" />
          </CardContent>
        </Card>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c} value={c}>{categoryLabels[c]}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={tab} className="mt-4 space-y-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg border border-border px-4 py-3"
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
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="capitalize">{item.category}</Badge>
                    <Badge variant={item.priority === "high" ? "destructive" : item.priority === "medium" ? "warning" : "secondary"}>
                      {item.priority}
                    </Badge>
                    {item.due_date && (
                      <span className="text-xs text-muted-foreground">
                        Due {format(new Date(item.due_date), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteChecklistItem(item.id)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No tasks in this category</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
