"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  BookOpen, Briefcase, CheckCircle2, Circle, Code2,
  MessageSquare, Target, TrendingUp, Zap,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/app-context";
import type { Skill, StudyTopic } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function CareerPage() {
  const { data, updateCareerGoal, toggleCareerMilestone, updateSkillLevel, updateStudyTopic } = useApp();
  const career = data.career;
  const [selectedPhase, setSelectedPhase] = useState<1 | 2 | 3 | 4 | 5>(1);

  const phaseNames = {
    1: "Build Profile",
    2: "Increase Value",
    3: "Prepare for Europe",
    4: "Financial Positioning",
    5: "Differentiation",
  };

  const phaseDescriptions = {
    1: "Master core skills and build public proof",
    2: "Switch to stronger companies and increase compensation",
    3: "Target European roles and prepare to relocate",
    4: "Build wealth and financial security",
    5: "Evolve toward high-value specializations",
  };

  const phaseMilestones = career.milestones.filter((m) => m.phase === selectedPhase);
  const completedMilestones = phaseMilestones.filter((m) => m.completed).length;
  const phaseProgress =
    phaseMilestones.length > 0
      ? Math.round((completedMilestones / phaseMilestones.length) * 100)
      : 0;

  const coreSkills = career.skills.filter((s) => s.category === "core");
  const specSkills = career.skills.filter((s) => s.category === "specialization");

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Career Roadmap</h1>
          <p className="text-muted-foreground">3-year path to Europe with focus on {career.primaryFocus.replace("-", " ")}</p>
        </div>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="mt-1 font-semibold">{career.currentRole}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="mt-1 font-semibold">{career.yearsOfExperience} years</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Phase</p>
                <p className="mt-1 font-semibold">Phase {career.currentPhase}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Target Salary (Phase 3)</p>
                <p className="mt-1 font-semibold">₹{(career.targetSalaryPhase3 / 100000).toFixed(1)}L</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline of Phases */}
        <Card>
          <CardHeader>
            <CardTitle>5-Year Roadmap</CardTitle>
            <CardDescription>Phases and timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((phase) => {
                const phaseData = (phase as 1 | 2 | 3 | 4 | 5);
                const isActive = career.currentPhase === phaseData;
                const isCompleted = career.currentPhase > phaseData;
                return (
                  <button
                    key={phase}
                    onClick={() => setSelectedPhase(phaseData)}
                    className={`w-full text-left rounded-lg border-2 p-4 transition-all ${
                      selectedPhase === phaseData
                        ? "border-primary bg-primary/5"
                        : isCompleted
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCompleted ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500 flex-shrink-0" />
                      ) : isActive ? (
                        <Circle className="mt-0.5 h-5 w-5 text-primary flex-shrink-0 fill-current" />
                      ) : (
                        <Circle className="mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">Phase {phase}: {phaseNames[phaseData as keyof typeof phaseNames]}</p>
                        <p className="text-sm text-muted-foreground">
                          {phaseDescriptions[phaseData as keyof typeof phaseDescriptions]}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Phase Details */}
        <Tabs defaultValue="milestones" className="w-full">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="interview">Interview Prep</TabsTrigger>
            <TabsTrigger value="study">Study Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="milestones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Phase {selectedPhase} Milestones</CardTitle>
                <CardDescription>
                  Progress: {completedMilestones}/{phaseMilestones.length} completed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={phaseProgress} className="h-2" />
                <div className="space-y-3">
                  {phaseMilestones.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No milestones for this phase</p>
                  ) : (
                    phaseMilestones.map((milestone) => (
                      <button
                        key={milestone.id}
                        onClick={() => toggleCareerMilestone(milestone.id)}
                        className="w-full text-left rounded-lg border border-border p-3 hover:bg-accent transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {milestone.completed ? (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <Circle className="mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-medium text-sm ${
                                milestone.completed ? "line-through text-muted-foreground" : ""
                              }`}
                            >
                              {milestone.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                            {milestone.dueDate && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Due: {format(new Date(milestone.dueDate), "MMM yyyy")}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Core Skills</CardTitle>
                <CardDescription>Technical foundation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {coreSkills.map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{skill.name}</p>
                      <Badge
                        variant={
                          skill.level === "expert"
                            ? "default"
                            : skill.level === "advanced"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {skill.level}
                      </Badge>
                    </div>
                    <Select value={skill.level} onValueChange={(v) => updateSkillLevel(skill.id, v as Skill["level"])}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Specialization: {career.primaryFocus.replace("-", " ")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {specSkills.map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{skill.name}</p>
                      <Badge variant="secondary">{skill.level}</Badge>
                    </div>
                    <Select value={skill.level} onValueChange={(v) => updateSkillLevel(skill.id, v as Skill["level"])}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Target Companies</CardTitle>
                <CardDescription>Where to grow your career</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {career.targetCompanies.map((company) => (
                  <div key={company.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{company.name}</p>
                        <p className="text-xs text-muted-foreground">{company.industry}</p>
                        <p className="text-sm mt-2">{company.reason}</p>
                        {company.notes && (
                          <p className="text-xs text-muted-foreground mt-2">💡 {company.notes}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge variant={company.difficulty === "hard" ? "destructive" : company.difficulty === "medium" ? "secondary" : "outline"}>
                          {company.difficulty}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2">Phase {company.targetPhase}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Interview Prep ── */}
          <TabsContent value="interview" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "DSA Solved",     value: `${data.interviewPrep?.dsaSolved ?? 0}/${data.interviewPrep?.dsaTarget ?? 300}`, icon: Code2,        color: "text-primary" },
                { label: "System Design",  value: `${data.interviewPrep?.systemDesignSessions ?? 0} sessions`,                    icon: MessageSquare, color: "text-blue-400" },
                { label: "Mock Interviews", value: `${data.interviewPrep?.mockInterviews ?? 0} done`,                              icon: Briefcase,     color: "text-emerald-400" },
                { label: "Resume",         value: data.interviewPrep?.resumeVersion ?? "v1.0",                                    icon: Target,        color: "text-yellow-400" },
              ].map(({ label, value, icon: Icon, color }) => (
                <Card key={label}>
                  <CardContent className="p-4">
                    <Icon className={cn("h-4 w-4 mb-2", color)} />
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-semibold text-sm mt-0.5">{value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>DSA Progress</CardTitle>
                <CardDescription>{data.interviewPrep?.dsaSolved ?? 0} of {data.interviewPrep?.dsaTarget ?? 300} solved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-3 w-full rounded-full bg-secondary/70 overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.round(((data.interviewPrep?.dsaSolved ?? 0) / (data.interviewPrep?.dsaTarget ?? 300)) * 100)}%` }} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Job Applications</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {(data.interviewPrep?.applications ?? []).map((app) => {
                  const statusColor: Record<string, "secondary" | "destructive" | "default" | "outline" | "warning"> = {
                    wishlist: "secondary", applied: "secondary", screening: "warning",
                    interview: "default", offer: "secondary", rejected: "destructive",
                  };
                  return (
                    <div key={app.id} className="flex items-start justify-between rounded-lg border border-border px-4 py-3 gap-3">
                      <div>
                        <p className="font-medium text-sm">{app.company}</p>
                        <p className="text-xs text-muted-foreground">{app.role}</p>
                        {app.notes && <p className="text-xs text-muted-foreground mt-1 opacity-70">💡 {app.notes}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant={statusColor[app.status] ?? "secondary"} className="capitalize">{app.status}</Badge>
                        {app.appliedDate && <p className="text-[10px] text-muted-foreground mt-1">{format(new Date(app.appliedDate), "MMM d")}</p>}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Study Roadmap ── */}
          <TabsContent value="study" className="space-y-4">
            {Array.from(new Set(data.studyRoadmap.map((t) => t.skill))).map((skill) => {
              const topics = data.studyRoadmap.filter((t) => t.skill === skill);
              const done = topics.filter((t) => t.status === "completed").length;
              const pct = Math.round((done / topics.length) * 100);
              return (
                <Card key={skill}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{skill}</CardTitle>
                      <span className="text-xs text-muted-foreground">{done}/{topics.length} done · {pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-secondary/70 overflow-hidden mt-1">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1.5">
                    {topics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          const next = topic.status === "not_started" ? "in_progress" : topic.status === "in_progress" ? "completed" : "not_started";
                          updateStudyTopic(topic.id, { status: next });
                        }}
                        className="w-full flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent/40 transition-colors text-left"
                      >
                        <span className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.5 rounded border shrink-0",
                          topic.status === "completed"   ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" :
                          topic.status === "in_progress" ? "bg-primary/10 text-primary border-primary/20" :
                          "bg-muted/50 text-muted-foreground border-border"
                        )}>
                          {topic.status === "completed" ? "✓ Done" : topic.status === "in_progress" ? "Active" : "Todo"}
                        </span>
                        <span className={cn("text-sm flex-1", topic.status === "completed" && "line-through text-muted-foreground")}>{topic.topic}</span>
                        <span className="text-xs text-muted-foreground shrink-0">{topic.estimatedHours}h</span>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

        </Tabs>

        {/* Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Public Projects</CardTitle>
            <CardDescription>Build visible proof on GitHub</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {career.inProgressProjects.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">In Progress</p>
                <ul className="space-y-2">
                  {career.inProgressProjects.map((project, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <Zap className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      {project}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {career.completedProjects.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Completed</p>
                <ul className="space-y-2">
                  {career.completedProjects.map((project, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="line-through text-muted-foreground">{project}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Europe Targets */}
        <Card>
          <CardHeader>
            <CardTitle>Europe Target Countries</CardTitle>
            <CardDescription>Best opportunities for {career.primaryFocus.replace("-", " ")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {career.targetCountriesEurope.map((country) => (
                <Badge key={country} variant="secondary">
                  {country}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
