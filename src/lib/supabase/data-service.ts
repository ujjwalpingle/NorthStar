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

// ==========================================
// NEW CRUD OPERATIONS
// ==========================================

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("profiles").update(updates).eq("id", userId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function addChecklistItem(userId: string, item: Omit<ChecklistItem, "user_id" | "id" | "created_at" | "updated_at">) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("checklist_items").insert([{ ...item, user_id: userId }]);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function toggleChecklistItem(itemId: string, completed: boolean) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("checklist_items").update({ completed, updated_at: new Date().toISOString() }).eq("id", itemId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function deleteChecklistItem(itemId: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("checklist_items").delete().eq("id", itemId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function addGoal(userId: string, goal: Omit<Goal, "user_id" | "id" | "created_at" | "milestones">) {
  try {
    const supabase = createClient();
    const dbGoal = {
      title: goal.title,
      description: goal.description,
      category: goal.category,
      deadline: goal.deadline,
      target_value: goal.targetValue,
      current_value: goal.currentValue,
      unit: goal.unit,
      status: goal.status,
      user_id: userId
    };
    const { error } = await supabase.from("goals").insert([dbGoal]);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function updateGoal(goalId: string, updates: Partial<Goal>) {
  try {
    const supabase = createClient();
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline;
    if (updates.targetValue !== undefined) dbUpdates.target_value = updates.targetValue;
    if (updates.currentValue !== undefined) dbUpdates.current_value = updates.currentValue;
    if (updates.unit !== undefined) dbUpdates.unit = updates.unit;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    
    const { error } = await supabase.from("goals").update(dbUpdates).eq("id", goalId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function deleteGoal(goalId: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("goals").delete().eq("id", goalId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function toggleGoalMilestone(milestoneId: string, completed: boolean) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("goal_milestones").update({ completed }).eq("id", milestoneId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function addDailyTask(userId: string, task: Omit<DailyTask, "user_id" | "id">) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("daily_tasks").insert([{ ...task, user_id: userId }]);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function toggleDailyTask(taskId: string, completed: boolean) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("daily_tasks").update({ completed }).eq("id", taskId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function deleteDailyTask(taskId: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("daily_tasks").delete().eq("id", taskId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function addHabit(userId: string, habit: Omit<Habit, "user_id" | "id" | "created_at">) {
  try {
    const supabase = createClient();
    const dbHabit = {
      name: habit.name,
      icon: habit.icon,
      category: habit.category,
      frequency: habit.frequency,
      target_count: habit.targetCount,
      user_id: userId
    };
    const { error } = await supabase.from("habits").insert([dbHabit]);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function deleteHabit(habitId: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("habits").delete().eq("id", habitId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function updateMigrationGoal(userId: string, updates: Partial<MigrationGoal>) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("migration_goals").update({ ...updates, updated_at: new Date().toISOString() }).eq("user_id", userId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function updateCareerGoal(userId: string, updates: Partial<CareerGoal>) {
  try {
    const supabase = createClient();
    const dbUpdates: any = {};
    if (updates.currentPhase !== undefined) dbUpdates.current_phase = updates.currentPhase;
    if (updates.currentRole !== undefined) dbUpdates["current_role"] = updates.currentRole;
    if (updates.yearsOfExperience !== undefined) dbUpdates.years_of_experience = updates.yearsOfExperience;
    if (updates.primaryFocus !== undefined) dbUpdates.primary_focus = updates.primaryFocus;
    if (updates.targetSalaryPhase3 !== undefined) dbUpdates.target_salary_phase_3 = updates.targetSalaryPhase3;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.targetCountriesEurope !== undefined) dbUpdates.target_countries_europe = updates.targetCountriesEurope;
    if (updates.completedProjects !== undefined) dbUpdates.completed_projects = updates.completedProjects;
    if (updates.inProgressProjects !== undefined) dbUpdates.in_progress_projects = updates.inProgressProjects;
    
    const { error } = await supabase.from("career_goals").update(dbUpdates).eq("user_id", userId);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function saveFullAppData(userId: string, data: AppData) {
  try {
    const supabase = createClient();

    // Accounts
    if (data.accounts.length > 0) {
      await supabase.from("accounts").upsert(data.accounts.map(a => ({ ...a, user_id: userId })));
    }
    // Snapshots
    if (data.snapshots.length > 0) {
      await supabase.from("net_worth_snapshots").upsert(data.snapshots.map(s => ({ ...s, user_id: userId })));
    }
    // Migration
    if (data.migrationGoal) {
      await supabase.from("migration_goals").upsert([{ ...data.migrationGoal, user_id: userId }]);
    }
    // Checklist
    if (data.checklist.length > 0) {
      await supabase.from("checklist_items").upsert(data.checklist.map(c => ({ ...c, user_id: userId })));
    }
    // Habits
    if (data.habits.length > 0) {
      await supabase.from("habits").upsert(data.habits.map(h => ({
        id: h.id,
        name: h.name,
        icon: h.icon,
        category: h.category,
        frequency: h.frequency,
        target_count: h.targetCount,
        user_id: userId
      })));
    }
    if (data.habitLogs.length > 0) {
      await supabase.from("habit_logs").upsert(data.habitLogs.map(l => ({ ...l, user_id: userId })));
    }
    // Goals
    if (data.goals.length > 0) {
      await supabase.from("goals").upsert(data.goals.map(g => ({
        id: g.id,
        title: g.title,
        description: g.description,
        category: g.category,
        deadline: g.deadline,
        target_value: g.targetValue,
        current_value: g.currentValue,
        unit: g.unit,
        status: g.status,
        user_id: userId
      })));
      
      const milestones = data.goals.flatMap(g => g.milestones.map(m => ({ 
        id: m.id,
        title: m.title,
        completed: m.completed,
        due_date: m.dueDate,
        user_id: userId, 
        goal_id: g.id 
      })));
      if (milestones.length > 0) {
        await supabase.from("goal_milestones").upsert(milestones);
      }
    }
    // Daily tasks
    if (data.dailyTasks.length > 0) {
      await supabase.from("daily_tasks").upsert(data.dailyTasks.map(t => ({ ...t, user_id: userId })));
    }
    // Study
    if (data.studyRoadmap.length > 0) {
      await supabase.from("study_topics").upsert(data.studyRoadmap.map(s => ({
        id: s.id,
        skill: s.skill,
        topic: s.topic,
        status: s.status,
        resources: s.resources,
        estimated_hours: s.estimatedHours,
        completed_hours: s.completedHours,
        user_id: userId 
      })));
    }
    // Interview prep
    if (data.interviewPrep) {
      await supabase.from("interview_prep").upsert([{
        dsa_solved: data.interviewPrep.dsaSolved,
        dsa_target: data.interviewPrep.dsaTarget,
        system_design_sessions: data.interviewPrep.systemDesignSessions,
        mock_interviews: data.interviewPrep.mockInterviews,
        resume_version: data.interviewPrep.resumeVersion,
        user_id: userId
      }]);
      if (data.interviewPrep.applications.length > 0) {
        await supabase.from("job_applications").upsert(data.interviewPrep.applications.map(a => ({
          id: a.id,
          company: a.company,
          role: a.role,
          status: a.status,
          applied_date: a.appliedDate,
          notes: a.notes,
          user_id: userId
        })));
      }
    }
    // Career
    if (data.career) {
      await supabase.from("career_goals").upsert([{
        id: data.career.id,
        current_phase: data.career.currentPhase,
        "current_role": data.career.currentRole,
        years_of_experience: data.career.yearsOfExperience,
        primary_focus: data.career.primaryFocus,
        target_salary_phase_3: data.career.targetSalaryPhase3,
        notes: data.career.notes,
        target_countries_europe: data.career.targetCountriesEurope,
        completed_projects: data.career.completedProjects,
        in_progress_projects: data.career.inProgressProjects,
        user_id: userId
      }]);
      
      if (data.career.milestones.length > 0) {
        await supabase.from("career_milestones").upsert(data.career.milestones.map(m => ({ 
          id: m.id,
          phase: m.phase,
          year: m.year,
          title: m.title,
          description: m.description,
          completed: m.completed,
          due_date: m.dueDate,
          user_id: userId, 
          career_id: data.career!.id 
        })));
      }
      if (data.career.skills.length > 0) {
        await supabase.from("skills").upsert(data.career.skills.map(s => ({
          id: s.id,
          name: s.name,
          category: s.category,
          level: s.level,
          years_experience: s.yearsExperience,
          last_updated: s.lastUpdated,
          user_id: userId, 
          career_id: data.career!.id 
        })));
      }
      if (data.career.targetCompanies.length > 0) {
        await supabase.from("target_companies").upsert(data.career.targetCompanies.map(c => ({ 
          id: c.id,
          name: c.name,
          industry: c.industry,
          reason: c.reason,
          difficulty: c.difficulty,
          target_phase: c.targetPhase,
          notes: c.notes,
          user_id: userId, 
          career_id: data.career!.id 
        })));
      }
    }

    return true;
  } catch (error) {
    console.error("Failed to seed data:", error);
    return false;
  }
}
