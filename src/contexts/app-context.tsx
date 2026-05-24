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
  MigrationGoal,
  NetWorthSnapshot,
  Profile,
  Skill,
} from "@/lib/types";
import { toEUR } from "@/lib/types";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "northstar_app_data";

interface AppContextValue {
  data: AppData;
  loading: boolean;
  isDemo: boolean;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  checklistProgress: number;
  updateProfile: (updates: Partial<Profile>) => void;
  addAccount: (account: Omit<Account, "id" | "user_id" | "created_at" | "updated_at">) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  addSnapshot: () => void;
  updateMigrationGoal: (updates: Partial<MigrationGoal>) => void;
  toggleChecklistItem: (id: string) => void;
  addChecklistItem: (item: Omit<ChecklistItem, "id" | "user_id" | "created_at" | "updated_at">) => void;
  deleteChecklistItem: (id: string) => void;
  updateCareerGoal: (updates: Partial<CareerGoal>) => void;
  toggleCareerMilestone: (id: string) => void;
  updateSkillLevel: (skillId: string, level: Skill["level"]) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadFromStorage(): AppData {
  if (typeof window === "undefined") return createDemoData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch {
    // ignore
  }
  return createDemoData();
}

function saveToStorage(data: AppData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function computeTotals(accounts: Account[]) {
  let totalAssets = 0;
  let totalLiabilities = 0;
  for (const a of accounts) {
    const eur = toEUR(a.balance, a.currency);
    if (a.category === "asset") totalAssets += eur;
    else totalLiabilities += eur;
  }
  return { totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(createDemoData);
  const [loading, setLoading] = useState(true);
  const isDemo = isDemoMode();

  useEffect(() => {
    if (isDemo) {
      setData(loadFromStorage());
    }
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

  const { totalAssets, totalLiabilities, netWorth } = useMemo(
    () => computeTotals(data.accounts),
    [data.accounts]
  );

  const checklistProgress = useMemo(() => {
    if (data.checklist.length === 0) return 0;
    const done = data.checklist.filter((c) => c.completed).length;
    return Math.round((done / data.checklist.length) * 100);
  }, [data.checklist]);

  const updateProfile = useCallback(
    (updates: Partial<Profile>) => {
      persist((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...updates },
      }));
    },
    [persist]
  );

  const addAccount = useCallback(
    (account: Omit<Account, "id" | "user_id" | "created_at" | "updated_at">) => {
      const ts = new Date().toISOString();
      persist((prev) => ({
        ...prev,
        accounts: [
          ...prev.accounts,
          {
            ...account,
            id: generateId(),
            user_id: prev.profile.id,
            created_at: ts,
            updated_at: ts,
          },
        ],
      }));
    },
    [persist]
  );

  const updateAccount = useCallback(
    (id: string, updates: Partial<Account>) => {
      persist((prev) => ({
        ...prev,
        accounts: prev.accounts.map((a) =>
          a.id === id ? { ...a, ...updates, updated_at: new Date().toISOString() } : a
        ),
      }));
    },
    [persist]
  );

  const deleteAccount = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        accounts: prev.accounts.filter((a) => a.id !== id),
      }));
    },
    [persist]
  );

  const addSnapshot = useCallback(() => {
    const ts = new Date().toISOString();
    const { totalAssets: assets, totalLiabilities: liabilities, netWorth: nw } =
      computeTotals(data.accounts);
    const snapshot: NetWorthSnapshot = {
      id: generateId(),
      user_id: data.profile.id,
      snapshot_date: new Date().toISOString().split("T")[0],
      total_assets: Math.round(assets),
      total_liabilities: Math.round(liabilities),
      net_worth: Math.round(nw),
      currency: data.profile.base_currency,
      created_at: ts,
    };
    persist((prev) => ({
      ...prev,
      snapshots: [...prev.snapshots, snapshot],
    }));
  }, [data.accounts, data.profile, persist]);

  const updateMigrationGoal = useCallback(
    (updates: Partial<MigrationGoal>) => {
      persist((prev) => ({
        ...prev,
        migrationGoal: prev.migrationGoal
          ? { ...prev.migrationGoal, ...updates, updated_at: new Date().toISOString() }
          : null,
      }));
    },
    [persist]
  );

  const toggleChecklistItem = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        checklist: prev.checklist.map((c) =>
          c.id === id
            ? { ...c, completed: !c.completed, updated_at: new Date().toISOString() }
            : c
        ),
      }));
    },
    [persist]
  );

  const addChecklistItem = useCallback(
    (item: Omit<ChecklistItem, "id" | "user_id" | "created_at" | "updated_at">) => {
      const ts = new Date().toISOString();
      persist((prev) => ({
        ...prev,
        checklist: [
          ...prev.checklist,
          { ...item, id: generateId(), user_id: prev.profile.id, created_at: ts, updated_at: ts },
        ],
      }));
    },
    [persist]
  );

  const deleteChecklistItem = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        checklist: prev.checklist.filter((c) => c.id !== id),
      }));
    },
    [persist]
  );

  const updateCareerGoal = useCallback(
    (updates: Partial<CareerGoal>) => {
      persist((prev) => ({
        ...prev,
        career: { ...prev.career, ...updates },
      }));
    },
    [persist]
  );

  const toggleCareerMilestone = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        career: {
          ...prev.career,
          milestones: prev.career.milestones.map((m) =>
            m.id === id ? { ...m, completed: !m.completed } : m
          ),
        },
      }));
    },
    [persist]
  );

  const updateSkillLevel = useCallback(
    (skillId: string, level: Skill["level"]) => {
      persist((prev) => ({
        ...prev,
        career: {
          ...prev.career,
          skills: prev.career.skills.map((s) =>
            s.id === skillId ? { ...s, level, lastUpdated: new Date().toISOString() } : s
          ),
        },
      }));
    },
    [persist]
  );

  const resetDemoData = useCallback(() => {
    const fresh = createDemoData();
    setData(fresh);
    saveToStorage(fresh);
  }, []);

  const value: AppContextValue = {
    data,
    loading,
    isDemo,
    netWorth,
    totalAssets,
    totalLiabilities,
    checklistProgress,
    updateProfile,
    addAccount,
    updateAccount,
    deleteAccount,
    addSnapshot,
    updateMigrationGoal,
    toggleChecklistItem,
    addChecklistItem,
    deleteChecklistItem,
    updateCareerGoal,
    toggleCareerMilestone,
    updateSkillLevel,
    resetDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
