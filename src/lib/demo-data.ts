import type {
  Account,
  AppData,
  CareerGoal,
  ChecklistItem,
  MigrationGoal,
  NetWorthSnapshot,
  Profile,
} from "@/lib/types";
import { generateId } from "@/lib/utils";

const DEMO_USER_ID = "demo-user-001";

export const DEFAULT_CHECKLIST: Omit<
  ChecklistItem,
  "id" | "user_id" | "created_at" | "updated_at"
>[] = [
  {
    category: "visa",
    title: "Research visa requirements",
    description: "Check eligibility for your target country's visa program",
    completed: true,
    due_date: null,
    priority: "high",
  },
  {
    category: "documents",
    title: "Gather passport & birth certificate",
    description: "Certified copies may be required",
    completed: true,
    due_date: null,
    priority: "high",
  },
  {
    category: "finance",
    title: "Open European bank account",
    description: "Research N26, Wise, or local banks in target country",
    completed: false,
    due_date: "2026-06-01",
    priority: "high",
  },
  {
    category: "finance",
    title: "Build 6-month emergency fund",
    description: "Target ₹15,00,000 minimum for relocation buffer",
    completed: false,
    due_date: "2026-08-01",
    priority: "medium",
  },
  {
    category: "tax",
    title: "Consult cross-border tax advisor",
    description: "Understand exit tax and EU tax residency rules",
    completed: false,
    due_date: "2026-07-01",
    priority: "medium",
  },
  {
    category: "housing",
    title: "Research neighborhoods in target city",
    description: "Compare rent prices and commute times",
    completed: false,
    due_date: null,
    priority: "low",
  },
  {
    category: "healthcare",
    title: "Get international health insurance quote",
    description: "Required for many visa applications",
    completed: false,
    due_date: "2026-06-15",
    priority: "medium",
  },
  {
    category: "documents",
    title: "Apostille degree certificates",
    description: "Required for Blue Card and work visas",
    completed: false,
    due_date: "2026-07-15",
    priority: "high",
  },
];

function now() {
  return new Date().toISOString();
}

export function createDemoData(): AppData {
  const ts = now();
  const profile: Profile = {
    id: DEMO_USER_ID,
    email: "ujjwal@northstar.app",
    full_name: "Ujjwal",
    base_currency: "INR",
    target_country: "Germany",
    migration_target_date: "2027-01-01",
    created_at: ts,
  };

  const accounts: Account[] = [
    {
      id: generateId(),
      user_id: DEMO_USER_ID,
      name: "Primary Savings",
      type: "checking",
      category: "asset",
      currency: "INR",
      balance: 500000,
      institution: "HDFC Bank",
      notes: "",
      created_at: ts,
      updated_at: ts,
    },
    {
      id: generateId(),
      user_id: DEMO_USER_ID,
      name: "Emergency Fund",
      type: "savings",
      category: "asset",
      currency: "INR",
      balance: 1500000,
      institution: "SBI",
      notes: "",
      created_at: ts,
      updated_at: ts,
    },
    {
      id: generateId(),
      user_id: DEMO_USER_ID,
      name: "Mutual Funds & Stocks",
      type: "investment",
      category: "asset",
      currency: "INR",
      balance: 3800000,
      institution: "Zerodha",
      notes: "Nifty50 index + tech stocks",
      created_at: ts,
      updated_at: ts,
    },
    {
      id: generateId(),
      user_id: DEMO_USER_ID,
      name: "Crypto Holdings",
      type: "crypto",
      category: "asset",
      currency: "INR",
      balance: 700000,
      institution: "CoinDCX",
      notes: "",
      created_at: ts,
      updated_at: ts,
    },
    {
      id: generateId(),
      user_id: DEMO_USER_ID,
      name: "Education Loan",
      type: "other",
      category: "liability",
      currency: "INR",
      balance: 800000,
      institution: "SBI Education Loan",
      notes: "",
      created_at: ts,
      updated_at: ts,
    },
  ];

  const snapshots: NetWorthSnapshot[] = [
    { id: generateId(), user_id: DEMO_USER_ID, snapshot_date: "2025-12-01", total_assets: 6000000, total_liabilities: 1200000, net_worth: 4800000, currency: "INR", created_at: ts },
    { id: generateId(), user_id: DEMO_USER_ID, snapshot_date: "2026-01-01", total_assets: 6200000, total_liabilities: 1100000, net_worth: 5100000, currency: "INR", created_at: ts },
    { id: generateId(), user_id: DEMO_USER_ID, snapshot_date: "2026-02-01", total_assets: 6400000, total_liabilities: 1000000, net_worth: 5400000, currency: "INR", created_at: ts },
    { id: generateId(), user_id: DEMO_USER_ID, snapshot_date: "2026-03-01", total_assets: 6600000, total_liabilities: 950000,  net_worth: 5650000, currency: "INR", created_at: ts },
    { id: generateId(), user_id: DEMO_USER_ID, snapshot_date: "2026-04-01", total_assets: 6800000, total_liabilities: 900000,  net_worth: 5900000, currency: "INR", created_at: ts },
    { id: generateId(), user_id: DEMO_USER_ID, snapshot_date: "2026-05-01", total_assets: 6500000, total_liabilities: 800000,  net_worth: 5700000, currency: "INR", created_at: ts },
  ];

  const migrationGoal: MigrationGoal = {
    id: generateId(),
    user_id: DEMO_USER_ID,
    target_country: "Germany",
    visa_type: "EU Blue Card",
    target_date: "2027-01-01",
    status: "planning",
    notes: "Targeting Berlin or Munich. Need B1 German by Q4 2026.",
    created_at: ts,
    updated_at: ts,
  };

  const checklist: ChecklistItem[] = DEFAULT_CHECKLIST.map((item) => ({
    ...item,
    id: generateId(),
    user_id: DEMO_USER_ID,
    created_at: ts,
    updated_at: ts,
  }));

  const career: CareerGoal = {
    id: generateId(),
    currentPhase: 1,
    currentRole: "DevOps Engineer",
    yearsOfExperience: 2,
    primaryFocus: "mlops",
    milestones: [
      {
        id: generateId(),
        phase: 1,
        year: 2026,
        title: "Master Kubernetes + Terraform + AWS",
        description: "Become excellent at K8s, Terraform, AWS. Build public projects.",
        completed: false,
        dueDate: "2026-12-31",
      },
      {
        id: generateId(),
        phase: 1,
        year: 2026,
        title: "Build Production-Grade Projects",
        description: "K8s deployment, Prometheus+Grafana, GitOps, autoscaling, CI/CD",
        completed: false,
        dueDate: "2026-12-31",
      },
      {
        id: generateId(),
        phase: 2,
        year: 2027,
        title: "Switch to Stronger Company",
        description: "Target: Datadog, Cloudflare, Grafana Labs, or strong Indian startup",
        completed: false,
        dueDate: "2027-06-30",
      },
      {
        id: generateId(),
        phase: 2,
        year: 2027,
        title: "Increase Compensation + Global Exposure",
        description: "Better engineering standards, scale, recognizable brand",
        completed: false,
        dueDate: "2027-12-31",
      },
      {
        id: generateId(),
        phase: 3,
        year: 2028,
        title: "Apply for Europe Roles",
        description: "Target Germany, Netherlands, Ireland. EU Blue Card sponsorship.",
        completed: false,
        dueDate: "2028-06-30",
      },
      {
        id: generateId(),
        phase: 3,
        year: 2028,
        title: "Relocate to Europe",
        description: "Internal transfer, direct hire, or startup relocation",
        completed: false,
        dueDate: "2028-12-31",
      },
      {
        id: generateId(),
        phase: 4,
        year: 2029,
        title: "Stabilize Abroad + Build Wealth",
        description: "Focus on high-income growth, explore equity opportunities",
        completed: false,
        dueDate: "2029-12-31",
      },
    ],
    skills: [
      { id: generateId(), name: "Kubernetes", category: "core", level: "advanced", yearsExperience: 2, lastUpdated: ts },
      { id: generateId(), name: "Docker", category: "core", level: "advanced", yearsExperience: 2, lastUpdated: ts },
      { id: generateId(), name: "Terraform", category: "core", level: "intermediate", yearsExperience: 1.5, lastUpdated: ts },
      { id: generateId(), name: "AWS", category: "core", level: "intermediate", yearsExperience: 2, lastUpdated: ts },
      { id: generateId(), name: "CI/CD", category: "core", level: "intermediate", yearsExperience: 2, lastUpdated: ts },
      { id: generateId(), name: "Linux", category: "core", level: "advanced", yearsExperience: 3, lastUpdated: ts },
      { id: generateId(), name: "Python", category: "specialization", level: "intermediate", yearsExperience: 2, lastUpdated: ts },
      { id: generateId(), name: "MLOps", category: "specialization", level: "beginner", yearsExperience: 0.5, lastUpdated: ts },
      { id: generateId(), name: "System Design", category: "core", level: "intermediate", yearsExperience: 1, lastUpdated: ts },
      { id: generateId(), name: "Communication", category: "soft", level: "advanced", yearsExperience: 2, lastUpdated: ts },
    ],
    targetCompanies: [
      {
        id: generateId(),
        name: "Datadog",
        industry: "SaaS / Observability",
        reason: "Leader in observability, great eng culture, global scale",
        difficulty: "hard",
        targetPhase: 2,
        notes: "Strong DevOps/SRE roles. Remote options.",
      },
      {
        id: generateId(),
        name: "Cloudflare",
        industry: "Cloud Infra",
        reason: "Edge computing leader, India-friendly, strong culture",
        difficulty: "hard",
        targetPhase: 2,
        notes: "Bangalore office. Great for SRE/Platform",
      },
      {
        id: generateId(),
        name: "Grafana Labs",
        industry: "Observability",
        reason: "Open-source friendly, remote-first, excellent culture",
        difficulty: "medium",
        targetPhase: 2,
        notes: "Very supportive of relocation to EU later",
      },
      {
        id: generateId(),
        name: "HashiCorp",
        industry: "Infrastructure",
        reason: "Terraform creator. Infra expertise unmatched.",
        difficulty: "hard",
        targetPhase: 2,
        notes: "Remote-friendly, strong India presence",
      },
    ],
    targetCountriesEurope: ["Germany", "Netherlands", "Ireland", "Estonia"],
    completedProjects: [
      "EdgeVerve DevOps infrastructure",
      "CI/CD pipeline optimization",
    ],
    inProgressProjects: [
      "Kubernetes multi-cluster setup",
      "Prometheus + Grafana monitoring stack",
      "GitOps with ArgoCD",
    ],
    targetSalaryPhase3: 8500000,
    notes: "Focus: MLOps + Platform Engineering. Timeline: Europe 2028. Blue Card target.",
  };

  return { profile, accounts, snapshots, migrationGoal, checklist, career };
}

export const DEMO_USER_ID_EXPORT = DEMO_USER_ID;
