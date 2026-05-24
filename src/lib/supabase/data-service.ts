// Supabase data sync service
// Handles loading and saving app data to Supabase

import { createClient } from "./client";
import type {
  AppData,
  Account,
  NetWorthSnapshot,
  MigrationGoal,
  ChecklistItem,
  Habit,
  HabitLog,
  Goal,
  GoalMilestone,
  DailyTask,
  StudyTopic,
  InterviewPrep,
  CareerGoal,
} from "@/lib/types";

export async function loadProfileData(userId: string): Promise<Partial<AppData> | null> {
  try {
    const supabase = createClient();

    // Load profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!profile) return null;

    // Load all related data in parallel
    const [
      { data: accounts },
      { data: snapshots },
      { data: migrationGoal },
      { data: checklist },
      { data: habits },
      { data: habitLogs },
      { data: goals },
      { data: goalMilestones },
      { data: dailyTasks },
      { data: studyTopics },
      { data: interviewPrep },
      { data: jobApplications },
      { data: careerGoal },
      { data: careerMilestones },
      { data: skills },
      { data: targetCompanies },
    ] = await Promise.all([
      supabase.from("accounts").select("*").eq("user_id", userId),
      supabase.from("net_worth_snapshots").select("*").eq("user_id", userId),
      supabase.from("migration_goals").select("*").eq("user_id", userId).single(),
      supabase.from("checklist_items").select("*").eq("user_id", userId),
      supabase.from("habits").select("*").eq("user_id", userId),
      supabase.from("habit_logs").select("*").eq("user_id", userId),
      supabase.from("goals").select("*").eq("user_id", userId),
      supabase.from("goal_milestones").select("*").eq("user_id", userId),
      supabase.from("daily_tasks").select("*").eq("user_id", userId),
      supabase.from("study_topics").select("*").eq("user_id", userId),
      supabase.from("interview_prep").select("*").eq("user_id", userId).single(),
      supabase.from("job_applications").select("*").eq("user_id", userId),
      supabase.from("career_goals").select("*").eq("user_id", userId).single(),
      supabase.from("career_milestones").select("*").eq("user_id", userId),
      supabase.from("skills").select("*").eq("user_id", userId),
      supabase.from("target_companies").select("*").eq("user_id", userId),
    ]);

    return {
      profile: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        base_currency: profile.base_currency,
        target_country: profile.target_country,
        migration_target_date: profile.migration_target_date,
        created_at: profile.created_at,
      },
      accounts: accounts || [],
      snapshots: snapshots || [],
      migrationGoal: migrationGoal || null,
      checklist: checklist || [],
      habits: habits || [],
      habitLogs: habitLogs || [],
      goals: (goals || []).map((g: any) => ({
        ...g,
        milestones: goalMilestones?.filter((m: any) => m.goal_id === g.id) || [],
      })),
      dailyTasks: dailyTasks || [],
      studyRoadmap: studyTopics || [],
      interviewPrep: interviewPrep || {
        dsaSolved: 0,
        dsaTarget: 0,
        systemDesignSessions: 0,
        mockInterviews: 0,
        resumeVersion: "",
        applications: jobApplications || [],
      },
      career: careerGoal
        ? {
            ...careerGoal,
            milestones: careerMilestones || [],
            skills: skills || [],
            targetCompanies: targetCompanies || [],
          }
        : null,
    };
  } catch (error) {
    console.error("Failed to load profile data:", error);
    return null;
  }
}

export async function saveAccount(userId: string, account: Omit<Account, "user_id">) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("accounts").insert([{ ...account, user_id: userId }]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Failed to save account:", error);
    return false;
  }
}

export async function updateAccount(accountId: string, updates: Partial<Account>) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("accounts")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", accountId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Failed to update account:", error);
    return false;
  }
}

export async function deleteAccount(accountId: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("accounts").delete().eq("id", accountId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Failed to delete account:", error);
    return false;
  }
}

export async function addNetWorthSnapshot(userId: string, snapshot: Omit<NetWorthSnapshot, "user_id">) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("net_worth_snapshots")
      .insert([{ ...snapshot, user_id: userId }]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Failed to save snapshot:", error);
    return false;
  }
}

export async function logHabitToDatabase(userId: string, habitLog: Omit<HabitLog, "id">) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("habit_logs")
      .insert([{ ...habitLog, user_id: userId }]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Failed to log habit:", error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

export async function signOut() {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
    return true;
  } catch (error) {
    console.error("Failed to sign out:", error);
    return false;
  }
}
