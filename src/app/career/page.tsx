"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CheckCircle2, Circle, Briefcase, Zap, Target, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/app-context";
import type { Skill } from "@/lib/types";

export default function CareerPage() {
  const { data, updateCareerGoal, toggleCareerMilestone, updateSkillLevel } = useApp();
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
          <TabsList>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="companies">Target Companies</TabsTrigger>
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
