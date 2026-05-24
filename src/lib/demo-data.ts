import type {
  Account,
  AppData,
  CareerGoal,
  ChecklistItem,
  DailyTask,
  Goal,
  Habit,
  HabitLog,
  InterviewPrep,
  MigrationGoal,
  NetWorthSnapshot,
  Profile,
  StudyTopic,
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

  const habits: Habit[] = [
    { id: generateId(), name: "Workout",         icon: "💪", category: "fitness",  frequency: "daily", targetCount: 1, created_at: ts },
    { id: generateId(), name: "Coding",          icon: "💻", category: "career",   frequency: "daily", targetCount: 1, created_at: ts },
    { id: generateId(), name: "DSA Practice",    icon: "🧠", category: "career",   frequency: "daily", targetCount: 1, created_at: ts },
    { id: generateId(), name: "Reading",         icon: "📚", category: "learning", frequency: "daily", targetCount: 1, created_at: ts },
    { id: generateId(), name: "Meditation",      icon: "🧘", category: "life",     frequency: "daily", targetCount: 1, created_at: ts },
    { id: generateId(), name: "Track Expenses",  icon: "💰", category: "finance",  frequency: "daily", targetCount: 1, created_at: ts },
  ];

  // Generate habit logs for the past 30 days (realistic completion rates)
  const completionRates: Record<number, number> = { 0: 0.8, 1: 0.9, 2: 0.7, 3: 0.6, 4: 0.65, 5: 0.75 };
  const habitLogs: HabitLog[] = [];
  for (let day = 0; day < 30; day++) {
    const d = new Date();
    d.setDate(d.getDate() - day);
    const dateStr = d.toISOString().split("T")[0];
    habits.forEach((habit, i) => {
      if (Math.random() < (completionRates[i] ?? 0.7)) {
        habitLogs.push({ id: generateId(), habit_id: habit.id, date: dateStr, count: 1 });
      }
    });
  }

  const today = new Date().toISOString().split("T")[0];

  const goals: Goal[] = [
    {
      id: generateId(),
      title: "Save ₹20L for European Relocation",
      description: "Build a dedicated fund to cover visa fees, flights, deposits, and first 3 months of expenses in Europe.",
      category: "financial",
      deadline: "2027-01-01",
      milestones: [
        { id: generateId(), title: "Save ₹5L",  completed: true,  dueDate: "2025-12-31" },
        { id: generateId(), title: "Save ₹10L", completed: true,  dueDate: "2026-04-01" },
        { id: generateId(), title: "Save ₹15L", completed: false, dueDate: "2026-09-01" },
        { id: generateId(), title: "Save ₹20L", completed: false, dueDate: "2027-01-01" },
      ],
      targetValue: 2000000,
      currentValue: 1200000,
      unit: "₹",
      status: "active",
      created_at: ts,
    },
    {
      id: generateId(),
      title: "Get EU Blue Card",
      description: "Secure an EU Blue Card by landing a qualified job offer in Germany.",
      category: "migration",
      deadline: "2028-06-30",
      milestones: [
        { id: generateId(), title: "Research Blue Card requirements",    completed: true,  dueDate: "2026-01-01" },
        { id: generateId(), title: "Apostille degree certificates",       completed: false, dueDate: "2026-07-15" },
        { id: generateId(), title: "Apply to 20 European companies",      completed: false, dueDate: "2027-06-30" },
        { id: generateId(), title: "Receive job offer with sponsorship",  completed: false, dueDate: "2028-03-01" },
        { id: generateId(), title: "Submit Blue Card application",        completed: false, dueDate: "2028-06-30" },
      ],
      targetValue: null,
      currentValue: null,
      unit: "%",
      status: "active",
      created_at: ts,
    },
    {
      id: generateId(),
      title: "Solve 300 DSA Problems",
      description: "Solve 300 LeetCode problems (mix of easy/medium/hard) to be interview-ready for top companies.",
      category: "career",
      deadline: "2026-09-30",
      milestones: [
        { id: generateId(), title: "First 50 problems",  completed: true,  dueDate: "2026-02-28" },
        { id: generateId(), title: "Reach 100 problems", completed: false, dueDate: "2026-05-31" },
        { id: generateId(), title: "Reach 200 problems", completed: false, dueDate: "2026-07-31" },
        { id: generateId(), title: "Reach 300 problems", completed: false, dueDate: "2026-09-30" },
      ],
      targetValue: 300,
      currentValue: 87,
      unit: "problems",
      status: "active",
      created_at: ts,
    },
    {
      id: generateId(),
      title: "Master Kubernetes",
      description: "Reach expert level in Kubernetes — from pods to production-grade multi-cluster setups.",
      category: "learning",
      deadline: "2026-12-31",
      milestones: [
        { id: generateId(), title: "Core concepts & architecture",    completed: true,  dueDate: "2026-01-31" },
        { id: generateId(), title: "Workloads, Services & Networking", completed: true,  dueDate: "2026-03-31" },
        { id: generateId(), title: "Helm, RBAC & Security",           completed: false, dueDate: "2026-07-31" },
        { id: generateId(), title: "Operators & CRDs",                completed: false, dueDate: "2026-10-31" },
        { id: generateId(), title: "Production scaling & monitoring", completed: false, dueDate: "2026-12-31" },
      ],
      targetValue: 100,
      currentValue: 40,
      unit: "%",
      status: "active",
      created_at: ts,
    },
    {
      id: generateId(),
      title: "Run 5km Without Stopping",
      description: "Build cardiovascular endurance to run 5km continuously at a steady pace.",
      category: "fitness",
      deadline: "2026-08-31",
      milestones: [
        { id: generateId(), title: "Run 1km without stopping", completed: true,  dueDate: "2026-03-31" },
        { id: generateId(), title: "Run 2km without stopping", completed: true,  dueDate: "2026-04-30" },
        { id: generateId(), title: "Run 3km without stopping", completed: false, dueDate: "2026-06-30" },
        { id: generateId(), title: "Run 5km without stopping", completed: false, dueDate: "2026-08-31" },
      ],
      targetValue: 5,
      currentValue: 2.5,
      unit: "km",
      status: "active",
      created_at: ts,
    },
  ];

  const dailyTasks: DailyTask[] = [
    { id: generateId(), title: "Review Kubernetes operators chapter",       completed: false, date: today, category: "learning",  priority: "high" },
    { id: generateId(), title: "Solve 2 LeetCode problems",                 completed: false, date: today, category: "learning",  priority: "high" },
    { id: generateId(), title: "Update net worth tracker",                  completed: true,  date: today, category: "personal",  priority: "medium" },
    { id: generateId(), title: "Research Germany Blue Card requirements",   completed: false, date: today, category: "migration", priority: "medium" },
    { id: generateId(), title: "Reply to recruiter on LinkedIn",            completed: false, date: today, category: "work",      priority: "medium" },
    { id: generateId(), title: "Read 20 pages of Deep Work",                completed: true,  date: today, category: "learning",  priority: "low" },
  ];

  const studyRoadmap: StudyTopic[] = [
    { id: generateId(), skill: "Kubernetes", topic: "Core Concepts & Architecture",         status: "completed",   resources: ["k8s.io/docs", "KodeKloud"],             estimatedHours: 10, completedHours: 10 },
    { id: generateId(), skill: "Kubernetes", topic: "Pods, Deployments & ReplicaSets",      status: "completed",   resources: ["k8s.io/docs"],                          estimatedHours: 8,  completedHours: 8  },
    { id: generateId(), skill: "Kubernetes", topic: "Services, Ingress & Networking",       status: "in_progress", resources: ["KodeKloud", "YouTube: TechWorld"],       estimatedHours: 12, completedHours: 5  },
    { id: generateId(), skill: "Kubernetes", topic: "Helm Charts & Package Management",     status: "not_started", resources: ["helm.sh/docs"],                          estimatedHours: 8,  completedHours: 0  },
    { id: generateId(), skill: "Kubernetes", topic: "RBAC & Security",                      status: "not_started", resources: ["k8s.io/docs/security"],                  estimatedHours: 10, completedHours: 0  },
    { id: generateId(), skill: "Kubernetes", topic: "Operators & CRDs",                     status: "not_started", resources: ["operatorhub.io"],                        estimatedHours: 15, completedHours: 0  },
    { id: generateId(), skill: "Kubernetes", topic: "Production Scaling & Monitoring",      status: "not_started", resources: ["Prometheus docs", "Grafana"],             estimatedHours: 20, completedHours: 0  },
    { id: generateId(), skill: "AWS",        topic: "IAM & Security Fundamentals",          status: "completed",   resources: ["AWS docs", "Udemy"],                     estimatedHours: 8,  completedHours: 8  },
    { id: generateId(), skill: "AWS",        topic: "EC2, VPC & Networking",                status: "completed",   resources: ["AWS docs"],                              estimatedHours: 10, completedHours: 10 },
    { id: generateId(), skill: "AWS",        topic: "EKS — Kubernetes on AWS",              status: "in_progress", resources: ["AWS EKS docs", "KodeKloud"],             estimatedHours: 15, completedHours: 6  },
    { id: generateId(), skill: "AWS",        topic: "CI/CD with CodePipeline",              status: "not_started", resources: ["AWS docs"],                              estimatedHours: 8,  completedHours: 0  },
    { id: generateId(), skill: "Terraform",  topic: "HCL Basics & State Management",        status: "completed",   resources: ["terraform.io/docs", "HashiCorp Learn"],  estimatedHours: 10, completedHours: 10 },
    { id: generateId(), skill: "Terraform",  topic: "Modules & Remote State",               status: "in_progress", resources: ["HashiCorp Learn"],                       estimatedHours: 8,  completedHours: 4  },
    { id: generateId(), skill: "Terraform",  topic: "Terraform Cloud & CI/CD Integration",  status: "not_started", resources: ["HashiCorp docs"],                        estimatedHours: 6,  completedHours: 0  },
    { id: generateId(), skill: "System Design", topic: "Fundamentals & Scalability",        status: "in_progress", resources: ["Grokking System Design", "ByteByteGo"],  estimatedHours: 20, completedHours: 8  },
    { id: generateId(), skill: "System Design", topic: "Distributed Systems & Databases",   status: "not_started", resources: ["DDIA book", "ByteByteGo"],               estimatedHours: 25, completedHours: 0  },
  ];

  const interviewPrep: InterviewPrep = {
    dsaSolved: 87,
    dsaTarget: 300,
    systemDesignSessions: 5,
    mockInterviews: 2,
    resumeVersion: "v3.0",
    applications: [
      { id: generateId(), company: "Grafana Labs",  role: "Senior DevOps Engineer",    status: "wishlist",  appliedDate: null,         notes: "Remote-first, great OSS culture" },
      { id: generateId(), company: "Cloudflare",    role: "Platform Engineer",         status: "applied",  appliedDate: "2026-05-10",  notes: "Applied via LinkedIn. Bangalore office." },
      { id: generateId(), company: "Datadog",       role: "SRE Engineer",              status: "screening", appliedDate: "2026-05-01", notes: "Phone screen scheduled for June 2nd" },
      { id: generateId(), company: "HashiCorp",     role: "Solutions Engineer",        status: "rejected",  appliedDate: "2026-04-15", notes: "No response after 3 weeks" },
    ],
  };

  return { profile, accounts, snapshots, migrationGoal, checklist, career, habits, habitLogs, goals, dailyTasks, studyRoadmap, interviewPrep };
}

export const DEMO_USER_ID_EXPORT = DEMO_USER_ID;

export function createEmptyData(userId: string): AppData {
  const ts = now();
  const profile: Profile = {
    id: userId,
    email: "",
    full_name: "",
    base_currency: "EUR",
    target_country: "",
    migration_target_date: null,
    created_at: ts,
  };

  const career: CareerGoal = {
    id: generateId(),
    currentPhase: 1,
    currentRole: "",
    yearsOfExperience: 0,
    primaryFocus: "platform-engineering",
    milestones: [],
    skills: [],
    targetCompanies: [],
    targetCountriesEurope: [],
    completedProjects: [],
    inProgressProjects: [],
    targetSalaryPhase3: 0,
    notes: "",
  };

  const interviewPrep: InterviewPrep = {
    dsaSolved: 0,
    dsaTarget: 0,
    systemDesignSessions: 0,
    mockInterviews: 0,
    resumeVersion: "",
    applications: [],
  };

  return { 
    profile, 
    accounts: [], 
    snapshots: [], 
    migrationGoal: null, 
    checklist: [], 
    career, 
    habits: [], 
    habitLogs: [], 
    goals: [], 
    dailyTasks: [], 
    studyRoadmap: [], 
    interviewPrep 
  };
}
