"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createDemoData } from "@/lib/demo-data";
import { isDemoMode } from "@/lib/config";
import type {
  Account,
  AppData,
  CareerGoal,
  CareerMilestone,
  ChecklistItem,
  DailyTask,
  Goal,
  GoalMilestone,
  Habit,
  HabitLog,
  InterviewPrep,
  MigrationGoal,
  NetWorthSnapshot,
  Profile,
  Skill,
  StudyTopic,
} from "@/lib/types";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "northstar_app_data_v2";

interface AppContextValue {
  data: AppData;
  loading: boolean;
  isDemo: boolean;
  // Wealth
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  // Migration
  checklistProgress: number;
  europeReadinessScore: number;
  // Habits
  habitStreaks: Record<string, number>;
  todayHabitIds: Set<string>;
  // Computed
  activeGoalsCount: number;
  currentStreak: number;

  // Profile
  updateProfile: (updates: Partial<Profile>) => void;
  // Accounts
  addAccount: (account: Omit<Account, "id" | "user_id" | "created_at" | "updated_at">) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  addSnapshot: () => void;
  // Migration
  updateMigrationGoal: (updates: Partial<MigrationGoal>) => void;
  toggleChecklistItem: (id: string) => void;
  addChecklistItem: (item: Omit<ChecklistItem, "id" | "user_id" | "created_at" | "updated_at">) => void;
  deleteChecklistItem: (id: string) => void;
  // Career
  updateCareerGoal: (updates: Partial<CareerGoal>) => void;
  toggleCareerMilestone: (id: string) => void;
  updateSkillLevel: (skillId: string, level: Skill["level"]) => void;
  // Habits
  logHabit: (habitId: string, date: string) => void;
  unlogHabit: (habitId: string, date: string) => void;
  addHabit: (habit: Omit<Habit, "id" | "created_at">) => void;
  deleteHabit: (id: string) => void;
  // Goals
  addGoal: (goal: Omit<Goal, "id" | "created_at">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleGoalMilestone: (goalId: string, milestoneId: string) => void;
  updateGoalProgress: (goalId: string, currentValue: number) => void;
  // Daily Tasks
  addDailyTask: (task: Omit<DailyTask, "id">) => void;
  toggleDailyTask: (id: string) => void;
  deleteDailyTask: (id: string) => void;
  // Study
  updateStudyTopic: (id: string, updates: Partial<StudyTopic>) => void;
  // Interview Prep
  updateInterviewPrep: (updates: Partial<InterviewPrep>) => void;
  // Admin
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function migrateData(raw: Partial<AppData>): AppData {
  const fresh = createDemoData();
  return {
    ...fresh,
    ...raw,
    // Ensure new fields always exist
    habits: (raw as AppData).habits ?? fresh.habits,
    habitLogs: (raw as AppData).habitLogs ?? fresh.habitLogs,
    goals: (raw as AppData).goals ?? fresh.goals,
    dailyTasks: (raw as AppData).dailyTasks ?? fresh.dailyTasks,
    studyRoadmap: (raw as AppData).studyRoadmap ?? fresh.studyRoadmap,
    interviewPrep: (raw as AppData).interviewPrep ?? fresh.interviewPrep,
  };
}

function loadFromStorage(): AppData {
  if (typeof window === "undefined") return createDemoData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return migrateData(JSON.parse(raw) as Partial<AppData>);
  } catch { /* ignore */ }
  return createDemoData();
}

function saveToStorage(data: AppData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Sum all account balances directly (all accounts are in base currency INR) */
function computeTotals(accounts: Account[]) {
  let totalAssets = 0;
  let totalLiabilities = 0;
  for (const a of accounts) {
    if (a.category === "asset") totalAssets += a.balance;
    else totalLiabilities += a.balance;
  }
  return { totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities };
}

/** Compute consecutive-day streak for a habit up to today */
function computeStreak(habitId: string, logs: HabitLog[]): number {
  let streak = 0;
  const check = new Date();
  check.setHours(0, 0, 0, 0);
  while (true) {
    const dateStr = check.toISOString().split("T")[0];
    const logged = logs.some((l) => l.habit_id === habitId && l.date === dateStr && l.count > 0);
    if (logged) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else break;
  }
  return streak;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(createDemoData);
  const [loading, setLoading] = useState(true);
  const isDemo = isDemoMode();

  useEffect(() => {
    if (isDemo) setData(loadFromStorage());
    setLoading(false);
  }, [isDemo]);

  const persist = useCallback(
    (updater: (prev: AppData) => AppData) => {
      setData((prev) => {
        const next = updater(prev);
        if (isDemo) saveToStorage(next);
        return next;
      });
    },
    [isDemo]
  );

  // ── Computed values ─────────────────────────────────────────────────────────
  const { totalAssets, totalLiabilities, netWorth } = useMemo(
    () => computeTotals(data.accounts),
    [data.accounts]
  );

  const checklistProgress = useMemo(() => {
    if (data.checklist.length === 0) return 0;
    return Math.round((data.checklist.filter((c) => c.completed).length / data.checklist.length) * 100);
  }, [data.checklist]);

  const europeReadinessScore = useMemo(() => {
    const checklistScore = checklistProgress * 0.4;
    const careerScore = ((data.career.currentPhase - 1) / 4) * 100 * 0.3;
    const savingsTarget = 2000000; // ₹20L
    const savingsScore = Math.min(netWorth / savingsTarget, 1) * 100 * 0.3;
    return Math.round(checklistScore + careerScore + savingsScore);
  }, [checklistProgress, data.career.currentPhase, netWorth]);

  const habitStreaks = useMemo(() => {
    const streaks: Record<string, number> = {};
    for (const h of data.habits) {
      streaks[h.id] = computeStreak(h.id, data.habitLogs);
    }
    return streaks;
  }, [data.habits, data.habitLogs]);

  const todayHabitIds = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return new Set(data.habitLogs.filter((l) => l.date === today && l.count > 0).map((l) => l.habit_id));
  }, [data.habitLogs]);

  const currentStreak = useMemo(() => {
    if (data.habits.length === 0) return 0;
    return Math.max(...Object.values(habitStreaks), 0);
  }, [habitStreaks, data.habits]);

  const activeGoalsCount = useMemo(
    () => data.goals.filter((g) => g.status === "active").length,
    [data.goals]
  );

  // ── Profile ─────────────────────────────────────────────────────────────────
  const updateProfile = useCallback(
    (updates: Partial<Profile>) => persist((p) => ({ ...p, profile: { ...p.profile, ...updates } })),
    [persist]
  );

  // ── Accounts ────────────────────────────────────────────────────────────────
  const addAccount = useCallback(
    (account: Omit<Account, "id" | "user_id" | "created_at" | "updated_at">) => {
      const ts = new Date().toISOString();
      persist((p) => ({
        ...p,
        accounts: [...p.accounts, { ...account, id: generateId(), user_id: p.profile.id, created_at: ts, updated_at: ts }],
      }));
    },
    [persist]
  );

  const updateAccount = useCallback(
    (id: string, updates: Partial<Account>) =>
      persist((p) => ({
        ...p,
        accounts: p.accounts.map((a) => (a.id === id ? { ...a, ...updates, updated_at: new Date().toISOString() } : a)),
      })),
    [persist]
  );

  const deleteAccount = useCallback(
    (id: string) => persist((p) => ({ ...p, accounts: p.accounts.filter((a) => a.id !== id) })),
    [persist]
  );

  const addSnapshot = useCallback(() => {
    const ts = new Date().toISOString();
    const { totalAssets: assets, totalLiabilities: liab, netWorth: nw } = computeTotals(data.accounts);
    const snapshot: NetWorthSnapshot = {
      id: generateId(), user_id: data.profile.id,
      snapshot_date: ts.split("T")[0],
      total_assets: Math.round(assets), total_liabilities: Math.round(liab), net_worth: Math.round(nw),
      currency: data.profile.base_currency, created_at: ts,
    };
    persist((p) => ({ ...p, snapshots: [...p.snapshots, snapshot] }));
  }, [data.accounts, data.profile, persist]);

  // ── Migration ───────────────────────────────────────────────────────────────
  const updateMigrationGoal = useCallback(
    (updates: Partial<MigrationGoal>) =>
      persist((p) => ({
        ...p,
        migrationGoal: p.migrationGoal ? { ...p.migrationGoal, ...updates, updated_at: new Date().toISOString() } : null,
      })),
    [persist]
  );

  const toggleChecklistItem = useCallback(
    (id: string) =>
      persist((p) => ({
        ...p,
        checklist: p.checklist.map((c) =>
          c.id === id ? { ...c, completed: !c.completed, updated_at: new Date().toISOString() } : c
        ),
      })),
    [persist]
  );

  const addChecklistItem = useCallback(
    (item: Omit<ChecklistItem, "id" | "user_id" | "created_at" | "updated_at">) => {
      const ts = new Date().toISOString();
      persist((p) => ({
        ...p,
        checklist: [...p.checklist, { ...item, id: generateId(), user_id: p.profile.id, created_at: ts, updated_at: ts }],
      }));
    },
    [persist]
  );

  const deleteChecklistItem = useCallback(
    (id: string) => persist((p) => ({ ...p, checklist: p.checklist.filter((c) => c.id !== id) })),
    [persist]
  );

  // ── Career ──────────────────────────────────────────────────────────────────
  const updateCareerGoal = useCallback(
    (updates: Partial<CareerGoal>) => persist((p) => ({ ...p, career: { ...p.career, ...updates } })),
    [persist]
  );

  const toggleCareerMilestone = useCallback(
    (id: string) =>
      persist((p) => ({
        ...p,
        career: {
          ...p.career,
          milestones: p.career.milestones.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)),
        },
      })),
    [persist]
  );

  const updateSkillLevel = useCallback(
    (skillId: string, level: Skill["level"]) =>
      persist((p) => ({
        ...p,
        career: {
          ...p.career,
          skills: p.career.skills.map((s) =>
            s.id === skillId ? { ...s, level, lastUpdated: new Date().toISOString() } : s
          ),
        },
      })),
    [persist]
  );

  // ── Habits ──────────────────────────────────────────────────────────────────
  const logHabit = useCallback(
    (habitId: string, date: string) =>
      persist((p) => {
        const exists = p.habitLogs.some((l) => l.habit_id === habitId && l.date === date);
        if (exists) return p;
        return { ...p, habitLogs: [...p.habitLogs, { id: generateId(), habit_id: habitId, date, count: 1 }] };
      }),
    [persist]
  );

  const unlogHabit = useCallback(
    (habitId: string, date: string) =>
      persist((p) => ({ ...p, habitLogs: p.habitLogs.filter((l) => !(l.habit_id === habitId && l.date === date)) })),
    [persist]
  );

  const addHabit = useCallback(
    (habit: Omit<Habit, "id" | "created_at">) =>
      persist((p) => ({ ...p, habits: [...p.habits, { ...habit, id: generateId(), created_at: new Date().toISOString() }] })),
    [persist]
  );

  const deleteHabit = useCallback(
    (id: string) =>
      persist((p) => ({
        ...p,
        habits: p.habits.filter((h) => h.id !== id),
        habitLogs: p.habitLogs.filter((l) => l.habit_id !== id),
      })),
    [persist]
  );

  // ── Goals ───────────────────────────────────────────────────────────────────
  const addGoal = useCallback(
    (goal: Omit<Goal, "id" | "created_at">) =>
      persist((p) => ({ ...p, goals: [...p.goals, { ...goal, id: generateId(), created_at: new Date().toISOString() }] })),
    [persist]
  );

  const updateGoal = useCallback(
    (id: string, updates: Partial<Goal>) =>
      persist((p) => ({ ...p, goals: p.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)) })),
    [persist]
  );

  const deleteGoal = useCallback(
    (id: string) => persist((p) => ({ ...p, goals: p.goals.filter((g) => g.id !== id) })),
    [persist]
  );

  const toggleGoalMilestone = useCallback(
    (goalId: string, milestoneId: string) =>
      persist((p) => ({
        ...p,
        goals: p.goals.map((g) =>
          g.id === goalId
            ? { ...g, milestones: g.milestones.map((m) => (m.id === milestoneId ? { ...m, completed: !m.completed } : m)) }
            : g
        ),
      })),
    [persist]
  );

  const updateGoalProgress = useCallback(
    (goalId: string, currentValue: number) =>
      persist((p) => ({ ...p, goals: p.goals.map((g) => (g.id === goalId ? { ...g, currentValue } : g)) })),
    [persist]
  );

  // ── Daily Tasks ─────────────────────────────────────────────────────────────
  const addDailyTask = useCallback(
    (task: Omit<DailyTask, "id">) =>
      persist((p) => ({ ...p, dailyTasks: [...p.dailyTasks, { ...task, id: generateId() }] })),
    [persist]
  );

  const toggleDailyTask = useCallback(
    (id: string) =>
      persist((p) => ({
        ...p,
        dailyTasks: p.dailyTasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      })),
    [persist]
  );

  const deleteDailyTask = useCallback(
    (id: string) => persist((p) => ({ ...p, dailyTasks: p.dailyTasks.filter((t) => t.id !== id) })),
    [persist]
  );

  // ── Study ───────────────────────────────────────────────────────────────────
  const updateStudyTopic = useCallback(
    (id: string, updates: Partial<StudyTopic>) =>
      persist((p) => ({ ...p, studyRoadmap: p.studyRoadmap.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),
    [persist]
  );

  // ── Interview Prep ──────────────────────────────────────────────────────────
  const updateInterviewPrep = useCallback(
    (updates: Partial<InterviewPrep>) =>
      persist((p) => ({ ...p, interviewPrep: { ...p.interviewPrep, ...updates } })),
    [persist]
  );

  // ── Admin ───────────────────────────────────────────────────────────────────
  const resetDemoData = useCallback(() => {
    const fresh = createDemoData();
    setData(fresh);
    saveToStorage(fresh);
  }, []);

  const value: AppContextValue = {
    data, loading, isDemo,
    netWorth, totalAssets, totalLiabilities,
    checklistProgress, europeReadinessScore,
    habitStreaks, todayHabitIds, currentStreak, activeGoalsCount,
    updateProfile,
    addAccount, updateAccount, deleteAccount, addSnapshot,
    updateMigrationGoal, toggleChecklistItem, addChecklistItem, deleteChecklistItem,
    updateCareerGoal, toggleCareerMilestone, updateSkillLevel,
    logHabit, unlogHabit, addHabit, deleteHabit,
    addGoal, updateGoal, deleteGoal, toggleGoalMilestone, updateGoalProgress,
    addDailyTask, toggleDailyTask, deleteDailyTask,
    updateStudyTopic,
    updateInterviewPrep,
    resetDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
