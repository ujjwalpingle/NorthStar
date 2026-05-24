export type Currency = "EUR" | "USD" | "GBP" | "CHF";

export type AccountType = "checking" | "savings" | "investment" | "crypto" | "property" | "other";
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
  | "visa"
  | "documents"
  | "finance"
  | "housing"
  | "healthcare"
  | "tax"
  | "other";

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

export interface AppData {
  profile: Profile;
  accounts: Account[];
  snapshots: NetWorthSnapshot[];
  migrationGoal: MigrationGoal | null;
  checklist: ChecklistItem[];
  career: CareerGoal;
}

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

export const EUROPE_COUNTRIES = [
  "Germany",
  "France",
  "Netherlands",
  "Spain",
  "Portugal",
  "Italy",
  "Ireland",
  "Austria",
  "Belgium",
  "Sweden",
  "Denmark",
  "Finland",
  "Norway",
  "Switzerland",
  "Poland",
  "Czech Republic",
  "Greece",
  "Romania",
  "Hungary",
  "Croatia",
] as const;

export const VISA_TYPES = [
  "EU Blue Card",
  "Work Visa",
  "Digital Nomad",
  "Student Visa",
  "Family Reunion",
  "Investment/Golden Visa",
  "Freelance/Self-employed",
  "EU Citizenship (descent)",
  "Other",
] as const;

export const EXCHANGE_RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 0.92,
  GBP: 1.17,
  CHF: 1.05,
};

export function toEUR(amount: number, currency: Currency): number {
  return amount * EXCHANGE_RATES[currency];
}
