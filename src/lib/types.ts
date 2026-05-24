// ─── Core ─────────────────────────────────────────────────────────────────────

export type Currency = "EUR" | "USD" | "GBP" | "CHF" | "INR";
export type AccountType = "checking" | "savings" | "investment" | "crypto" | "property" | "gold" | "other";
export type AccountCategory = "asset" | "liability";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  base_currency: Currency;
  target_country: string;
  migration_target_date: string | null;
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  currency: Currency;
  balance: number;
  institution: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface NetWorthSnapshot {
  id: string;
  user_id: string;
  snapshot_date: string;
  total_assets: number;
  total_liabilities: number;
  net_worth: number;
  currency: Currency;
  created_at: string;
}

export interface MigrationGoal {
  id: string;
  user_id: string;
  target_country: string;
  visa_type: string;
  target_date: string | null;
  status: "planning" | "in_progress" | "submitted" | "approved" | "completed";
  notes: string;
  created_at: string;
  updated_at: string;
}

export type ChecklistCategory =
  | "visa" | "documents" | "finance" | "housing" | "healthcare" | "tax" | "other";

export interface ChecklistItem {
  id: string;
  user_id: string;
  category: ChecklistCategory;
  title: string;
  description: string;
  completed: boolean;
  due_date: string | null;
  priority: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
}

// ─── Habits ───────────────────────────────────────────────────────────────────

export type HabitCategory = "fitness" | "learning" | "career" | "life" | "finance";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: HabitCategory;
  frequency: "daily" | "weekly";
  targetCount: number;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  count: number;
}

// ─── Goals ────────────────────────────────────────────────────────────────────

export type GoalCategory = "financial" | "career" | "migration" | "fitness" | "learning";

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  deadline: string | null;
  milestones: GoalMilestone[];
  targetValue: number | null;
  currentValue: number | null;
  unit: string;
  status: "active" | "completed" | "paused";
  created_at: string;
}

// ─── Daily Tasks ──────────────────────────────────────────────────────────────

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
  category: "work" | "learning" | "personal" | "migration";
  priority: "low" | "medium" | "high";
}

// ─── Study Roadmap ────────────────────────────────────────────────────────────

export interface StudyTopic {
  id: string;
  skill: string;
  topic: string;
  status: "not_started" | "in_progress" | "completed";
  resources: string[];
  estimatedHours: number;
  completedHours: number;
}

// ─── Interview Prep ───────────────────────────────────────────────────────────

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: "wishlist" | "applied" | "screening" | "interview" | "offer" | "rejected";
  appliedDate: string | null;
  notes: string;
}

export interface InterviewPrep {
  dsaSolved: number;
  dsaTarget: number;
  systemDesignSessions: number;
  mockInterviews: number;
  resumeVersion: string;
  applications: JobApplication[];
}

// ─── Journal ──────────────────────────────────────────────────────────────────

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  dailyNote: string;
  weeklyWin: string;
  weeklyBlocker: string;
  weeklyFocus: string;
  weeklyGratitude: string;
  type: "daily" | "weekly";
  created_at: string;
  updated_at: string;
}

// ─── App Data (root) ──────────────────────────────────────────────────────────

export interface AppData {
  profile: Profile;
  accounts: Account[];
  snapshots: NetWorthSnapshot[];
  migrationGoal: MigrationGoal | null;
  checklist: ChecklistItem[];
  career: CareerGoal;
  habits: Habit[];
  habitLogs: HabitLog[];
  goals: Goal[];
  dailyTasks: DailyTask[];
  studyRoadmap: StudyTopic[];
  interviewPrep: InterviewPrep;
  journalEntries: JournalEntry[];
}

// ─── Career ───────────────────────────────────────────────────────────────────

export type CareerPhase = 1 | 2 | 3 | 4 | 5;

export interface CareerMilestone {
  id: string;
  phase: CareerPhase;
  year: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string | null;
}

export interface Skill {
  id: string;
  name: string;
  category: "core" | "specialization" | "soft";
  level: "beginner" | "intermediate" | "advanced" | "expert";
  yearsExperience: number;
  lastUpdated: string;
}

export interface TargetCompany {
  id: string;
  name: string;
  industry: string;
  reason: string;
  difficulty: "easy" | "medium" | "hard";
  targetPhase: CareerPhase;
  notes: string;
}

export interface CareerGoal {
  id: string;
  currentPhase: CareerPhase;
  currentRole: string;
  yearsOfExperience: number;
  primaryFocus: "platform-engineering" | "sre" | "cloud-security" | "mlops";
  milestones: CareerMilestone[];
  skills: Skill[];
  targetCompanies: TargetCompany[];
  targetCountriesEurope: string[];
  completedProjects: string[];
  inProgressProjects: string[];
  targetSalaryPhase3: number;
  notes: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const EUROPE_COUNTRIES = [
  "Germany", "France", "Netherlands", "Spain", "Portugal", "Italy",
  "Ireland", "Austria", "Belgium", "Sweden", "Denmark", "Finland",
  "Norway", "Switzerland", "Poland", "Czech Republic", "Greece",
  "Romania", "Hungary", "Croatia",
] as const;

export const VISA_TYPES = [
  "EU Blue Card", "Work Visa", "Digital Nomad", "Student Visa",
  "Family Reunion", "Investment/Golden Visa", "Freelance/Self-employed",
  "EU Citizenship (descent)", "Other",
] as const;

export const EXCHANGE_RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 0.92,
  GBP: 1.17,
  CHF: 1.05,
  INR: 0.011,
};

/** Convert any currency amount to EUR (used internally for cross-currency math) */
export function toEUR(amount: number, currency: Currency): number {
  return amount * EXCHANGE_RATES[currency];
}
