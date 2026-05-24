"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { format } from "date-fns";
import { BookOpen, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/app-context";
import { cn } from "@/lib/utils";

const WEEKLY_PROMPTS = [
  { key: "weeklyWin",       icon: "🏆", label: "Win this week",         placeholder: "What went well? What are you proud of?" },
  { key: "weeklyBlocker",   icon: "🚧", label: "What blocked me",       placeholder: "What slowed you down? What can you remove?" },
  { key: "weeklyFocus",     icon: "🔭", label: "Focus next week",        placeholder: "The one thing that will move the needle..." },
  { key: "weeklyGratitude", icon: "🙏", label: "Grateful for",          placeholder: "Something or someone you appreciate..." },
] as const;

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d.toISOString().split("T")[0];
}

export default function JournalPage() {
  const { data, upsertJournalEntry } = useApp();
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  const weekStart = getWeekStart(new Date(selectedDate));
  const currentEntry = data.journalEntries.find((j) => j.date === selectedDate);

  const [dailyNote, setDailyNote] = useState(currentEntry?.dailyNote ?? "");
  const [weeklyWin, setWeeklyWin] = useState(currentEntry?.weeklyWin ?? "");
  const [weeklyBlocker, setWeeklyBlocker] = useState(currentEntry?.weeklyBlocker ?? "");
  const [weeklyFocus, setWeeklyFocus] = useState(currentEntry?.weeklyFocus ?? "");
  const [weeklyGratitude, setWeeklyGratitude] = useState(currentEntry?.weeklyGratitude ?? "");

  // Load entry when date changes
  useEffect(() => {
    const entry = data.journalEntries.find((j) => j.date === selectedDate);
    setDailyNote(entry?.dailyNote ?? "");
    setWeeklyWin(entry?.weeklyWin ?? "");
    setWeeklyBlocker(entry?.weeklyBlocker ?? "");
    setWeeklyFocus(entry?.weeklyFocus ?? "");
    setWeeklyGratitude(entry?.weeklyGratitude ?? "");
    setSaved(false);
  }, [selectedDate, data.journalEntries]);

  function autoSave(updates: Partial<{ dailyNote: string; weeklyWin: string; weeklyBlocker: string; weeklyFocus: string; weeklyGratitude: string }>) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaved(false);
    saveTimer.current = setTimeout(() => {
      upsertJournalEntry({
        date: selectedDate,
        dailyNote,
        weeklyWin,
        weeklyBlocker,
        weeklyFocus,
        weeklyGratitude,
        ...updates,
        type: "daily",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  }

  function goDay(offset: number) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split("T")[0]);
  }

  // Week dots — last 7 days with journal entries
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().split("T")[0];
    const hasEntry = data.journalEntries.some((j) => j.date === ds && (j.dailyNote || j.weeklyWin));
    return { ds, label: format(d, "EEE"), isToday: ds === today, isSelected: ds === selectedDate, hasEntry };
  });

  const totalEntries = data.journalEntries.filter((j) => j.dailyNote || j.weeklyWin).length;
  const thisWeekEntries = data.journalEntries.filter((j) => j.date >= weekStart && (j.dailyNote || j.weeklyWin)).length;

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" /> Journal
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalEntries} entries · {thisWeekEntries} this week
              {saved && <span className="ml-2 text-emerald-400">✓ Saved</span>}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => goDay(-1)}><ChevronLeft className="h-4 w-4" /></Button>
            <button
              onClick={() => setSelectedDate(today)}
              className={cn("px-3 py-1.5 text-sm rounded-lg font-medium transition-all",
                selectedDate === today ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              Today
            </button>
            <Button variant="ghost" size="icon" onClick={() => goDay(1)} disabled={selectedDate === today}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Week strip */}
        <div className="flex items-center gap-2">
          {last7.map(({ ds, label, isToday, isSelected, hasEntry }) => (
            <button
              key={ds}
              onClick={() => setSelectedDate(ds)}
              className={cn(
                "flex flex-col items-center gap-1.5 flex-1 py-2 rounded-xl border text-xs font-medium transition-all",
                isSelected ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-border/70 hover:text-foreground"
              )}
            >
              <span>{label}</span>
              <div className={cn(
                "h-1.5 w-1.5 rounded-full",
                hasEntry ? "bg-primary" : isToday ? "bg-primary/30" : "bg-muted-foreground/30"
              )} />
              <span className="text-[10px]">{format(new Date(ds), "d")}</span>
            </button>
          ))}
        </div>

        {/* Date label */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-xs text-muted-foreground font-medium">
            {selectedDate === today ? "Today — " : ""}{format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
          </span>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        {/* Daily note */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              ✏️ Daily Note
            </CardTitle>
            <CardDescription>What&apos;s on your mind today?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Anything goes — wins, ideas, thoughts, what you worked on..."
              value={dailyNote}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                setDailyNote(e.target.value);
                autoSave({ dailyNote: e.target.value });
              }}
              className="min-h-[140px] resize-none border-0 bg-muted/30 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Weekly review */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-border/50" />
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Weekly Review</span>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {WEEKLY_PROMPTS.map(({ key, icon, label, placeholder }) => {
              const valueMap = { weeklyWin, weeklyBlocker, weeklyFocus, weeklyGratitude };
              const setterMap = { weeklyWin: setWeeklyWin, weeklyBlocker: setWeeklyBlocker, weeklyFocus: setWeeklyFocus, weeklyGratitude: setWeeklyGratitude };
              const val = valueMap[key];
              const setter = setterMap[key];

              return (
                <Card key={key} className="border-border/60">
                  <CardContent className="p-4">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
                      <span>{icon}</span> {label}
                    </label>
                    <Textarea
                      placeholder={placeholder}
                      value={val}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        setter(e.target.value);
                        autoSave({ [key]: e.target.value });
                      }}
                      className="min-h-[90px] resize-none border-0 bg-muted/30 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm p-0"
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Past entries */}
        {data.journalEntries.filter((j) => j.date !== selectedDate && (j.dailyNote || j.weeklyWin)).length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">Past Entries</h2>
            <div className="space-y-2">
              {data.journalEntries
                .filter((j) => j.date !== selectedDate && (j.dailyNote || j.weeklyWin))
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 5)
                .map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedDate(entry.date)}
                    className="w-full text-left rounded-xl border border-border px-4 py-3 hover:bg-accent/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{format(new Date(entry.date), "EEEE, MMMM d")}</span>
                      <Save className="h-3 w-3 text-muted-foreground" />
                    </div>
                    {entry.dailyNote && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.dailyNote}</p>
                    )}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
