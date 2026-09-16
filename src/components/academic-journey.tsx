import { ArrowLeft, ArrowDown, BookOpen, CheckCircle2, ChevronRight, CircleDashed, GraduationCap, Lock, PlayCircle, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { studentProfile } from "@/data/profile";
import { CURRENT_SEMESTER, TOTAL_SKS, courseByCode, curriculum, curriculumStructure, type CurriculumCourse } from "@/data/curriculum";

export type JourneyStatus = "completed" | "current" | "planned" | "available" | "locked";

const statusLabel: Record<JourneyStatus, string> = {
  completed: "Completed",
  current: "Currently taking",
  planned: "Planned",
  available: "Available",
  locked: "Locked",
};

const statusStyle: Record<JourneyStatus, string> = {
  completed: "bg-success/12 text-success",
  current: "bg-primary text-primary-foreground",
  planned: "bg-accent text-academic",
  available: "bg-muted text-muted-foreground",
  locked: "bg-muted text-muted-foreground",
};

const statusIcon: Record<JourneyStatus, typeof CheckCircle2> = {
  completed: CheckCircle2,
  current: PlayCircle,
  planned: Target,
  available: CircleDashed,
  locked: Lock,
};

const defaultManual: Record<string, JourneyStatus> = {};
for (const course of curriculum) {
  if (course.semester < CURRENT_SEMESTER) defaultManual[course.code] = "completed";
  if (course.semester === CURRENT_SEMESTER) defaultManual[course.code] = "current";
}
// Mata kuliah peminatan yang sudah diambil lebih awal pada semester berjalan.
defaultManual["ECMN600040"] = "current";

function resolveStatuses(manual: Record<string, JourneyStatus>) {
  const resolved = new Map<string, JourneyStatus>();
  for (const course of curriculum) {
    const set = manual[course.code];
    if (set) { resolved.set(course.code, set); continue; }
    const blocked = course.prereq.some((code) => manual[code] !== "completed");
    resolved.set(course.code, blocked ? "locked" : "available");
  }
  return resolved;
}

function useJourney() {
  const [manual, setManual] = useState<Record<string, JourneyStatus>>(defaultManual);
  const statuses = useMemo(() => resolveStatuses(manual), [manual]);
  const completedSks = curriculum.filter((c) => statuses.get(c.code) === "completed").reduce((sum, c) => sum + c.sks, 0);
  const completedCourses = curriculum.filter((c) => statuses.get(c.code) === "completed").length;
  return { manual, setManual, statuses, completedSks, completedCourses };
}

export function JourneyCard({ onOpen }: { onOpen: () => void }) {
  const { statuses, completedSks, completedCourses } = useJourney();
  const percent = Math.round((completedSks / TOTAL_SKS) * 100);
  const current = curriculum.filter((c) => statuses.get(c.code) === "current").length;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold md:text-lg">Academic journey</h2>
        <button onClick={onOpen} className="text-xs font-semibold text-academic">Open roadmap</button>
      </div>
      <button onClick={onOpen} className="academic-card w-full overflow-hidden text-left transition-transform hover:-translate-y-0.5">
        <div className="h-1.5 bg-academic" />
        <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Management FEB UI · Curriculum 2024</p>
            <h3 className="mt-1 text-lg font-bold">Degree progress</h3>
            <div className="mt-4 flex items-end gap-2">
              <span className="font-display text-3xl font-bold text-academic">{completedSks}</span>
              <span className="pb-1 text-sm text-muted-foreground">/ {TOTAL_SKS} SKS</span>
            </div>
            <Progress value={percent} className="mt-3 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">{percent}% of the degree · semester {CURRENT_SEMESTER} of 8 · {completedCourses} courses completed · {current} in progress</p>
          </div>
          <span className="flex items-center gap-1 justify-self-start rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-academic md:justify-self-end">
            View roadmap <ChevronRight className="size-3.5" />
          </span>
        </div>
      </button>
    </section>
  );
}

export function AcademicJourney({ onBack, onOpenCourse }: { onBack: () => void; onOpenCourse: (course: CurriculumCourse) => void }) {
  const { manual, setManual, statuses, completedSks, completedCourses } = useJourney();
  const [selected, setSelected] = useState<CurriculumCourse | null>(null);

  const percent = Math.round((completedSks / TOTAL_SKS) * 100);
  const semesters = useMemo(() => Array.from({ length: 8 }, (_, i) => i + 1).map((semester) => ({
    semester,
    items: curriculum.filter((course) => course.semester === semester),
  })), []);

  const setStatus = (code: string, status: JourneyStatus) =>
    setManual((current) => {
      const next = { ...current };
      if (status === "available") delete next[code];
      else next[code] = status;
      return next;
    });

  const unlocks = selected ? curriculum.filter((course) => course.prereq.includes(selected.code)) : [];

  return (
    <div className="page-enter">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 -ml-2"><ArrowLeft /> Home</Button>

      <header className="mb-6 overflow-hidden rounded-2xl bg-academic p-5 text-academic-foreground md:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-semibold opacity-80"><GraduationCap className="size-4" /> Universitas Indonesia · FEB</span>
          <span className="rounded-lg bg-academic-foreground/15 px-2.5 py-1 text-xs font-semibold">Curriculum 2024</span>
        </div>
        <h1 className="mt-5 text-2xl font-bold md:text-3xl">Management FEB UI</h1>
        <p className="mt-1 text-sm opacity-80">Bachelor of Management — academic journey to graduation</p>
        <p className="mt-1 text-xs opacity-70">{studentProfile.name} · Angkatan {studentProfile.entryYear} · Semester {studentProfile.currentSemester} · Target GPA {studentProfile.targetGpa.toFixed(2)}</p>

        <div className="mt-6 border-t border-academic-foreground/15 pt-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs opacity-75">Degree progress</p>
              <p className="mt-1 font-display text-3xl font-bold">{completedSks} <span className="text-base font-semibold opacity-75">/ {TOTAL_SKS} SKS</span></p>
            </div>
            <p className="font-display text-2xl font-bold">{percent}%</p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-academic-foreground/15">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-xs opacity-75">Current semester {CURRENT_SEMESTER} of 8 · Semester Gasal 2026/2027</p>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="mb-3 text-base font-bold md:text-lg">Graduation tracker</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Completed SKS" value={String(completedSks)} tone="text-success" />
          <Stat label="Remaining SKS" value={String(Math.max(0, TOTAL_SKS - completedSks))} />
          <Stat label="Courses completed" value={String(completedCourses)} />
          <Stat label="Courses remaining" value={String(curriculum.length - completedCourses)} />
        </div>
        <div className="academic-card mt-3 p-5">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Curriculum structure</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {curriculumStructure.map((group) => (
              <div key={group.label} className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">{group.label}</p>
                <p className="mt-1 font-display text-lg font-bold text-academic">{group.sks} SKS</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold md:text-lg">Curriculum roadmap</h2>
          <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
            {(["completed", "current", "planned", "available", "locked"] as JourneyStatus[]).map((status) => (
              <span key={status} className={`rounded-full px-2.5 py-1 ${statusStyle[status]}`}>{statusLabel[status]}</span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {semesters.map(({ semester, items }) => {
            const sks = items.reduce((sum, course) => sum + course.sks, 0);
            const done = items.filter((course) => statuses.get(course.code) === "completed").length;
            const isCurrent = semester === CURRENT_SEMESTER;
            return (
              <article key={semester} className="academic-card overflow-hidden">
                <div className={`h-1.5 ${isCurrent ? "bg-primary" : done === items.length ? "bg-success" : "bg-muted"}`} />
                <div className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold">Semester {semester}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{items.length} courses · {sks} SKS · {done} completed</p>
                    </div>
                    {isCurrent && <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">You are here</span>}
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((course) => {
                      const status = statuses.get(course.code) ?? "available";
                      const Icon = statusIcon[status];
                      return (
                        <button
                          key={course.code}
                          onClick={() => setSelected(course)}
                          className={`rounded-xl border border-border p-4 text-left transition-colors hover:border-academic ${status === "locked" ? "opacity-60" : ""} ${selected?.code === course.code ? "border-academic bg-accent/40" : "bg-surface"}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-semibold text-muted-foreground">{course.code}</span>
                            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold">{course.sks} SKS</span>
                          </div>
                          <p className="mt-2 min-h-10 text-sm font-bold leading-5">{course.name}</p>
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyle[status]}`}>
                              <Icon className="size-3" /> {statusLabel[status]}
                            </span>
                            <span className="text-[10px] font-semibold text-muted-foreground">{course.group}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {selected && (
        <section className="mt-8">
          <h2 className="mb-3 text-base font-bold md:text-lg">Course detail</h2>
          <div className="academic-card p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted-foreground">{selected.code} · {selected.group} · Semester {selected.semester}</p>
                <h3 className="mt-1 text-lg font-bold">{selected.name}</h3>
                {selected.note && <p className="mt-1 text-xs text-muted-foreground">{selected.note}</p>}
              </div>
              <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold">{selected.sks} SKS</span>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Prerequisites</p>
                {selected.prereq.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">No prerequisite — this course can be taken directly.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {selected.prereq.map((code) => {
                      const prereq = courseByCode.get(code);
                      const status = statuses.get(code) ?? "available";
                      return (
                        <div key={code} className="rounded-xl border border-border p-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold">{prereq?.name ?? code}</p>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyle[status]}`}>{statusLabel[status]}</span>
                          </div>
                          <p className="mt-1 text-[10px] text-muted-foreground">{code}</p>
                        </div>
                      );
                    })}
                    <div className="flex justify-center text-academic"><ArrowDown className="size-4" /></div>
                    <div className="rounded-xl bg-accent p-3 text-sm font-semibold text-academic">{selected.name}</div>
                  </div>
                )}

                {unlocks.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Unlocks</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {unlocks.map((course) => (
                        <li key={course.code} className="flex items-center gap-2 text-muted-foreground">
                          <ChevronRight className="size-3.5 text-academic" />{course.name} <span className="text-[10px]">· Sem {course.semester}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Course status</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(["completed", "current", "planned", "available"] as JourneyStatus[]).map((status) => {
                    const active = (statuses.get(selected.code) ?? "available") === status;
                    return (
                      <button
                        key={status}
                        onClick={() => setStatus(selected.code, status)}
                        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${active ? "border-academic bg-academic text-academic-foreground" : "border-border bg-surface hover:border-academic"}`}
                      >
                        {statusLabel[status]}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">Courses stay locked automatically until every prerequisite is marked completed.</p>

                <div className="mt-5 rounded-xl border border-border p-4">
                  <p className="text-sm font-semibold">Course workspace</p>
                  <p className="mt-1 text-xs text-muted-foreground">Overview, materials, notes, tasks, and schedule for this course.</p>
                  <Button variant="yellow" size="sm" className="mt-3" onClick={() => onOpenCourse(selected)}>
                    <BookOpen /> Open workspace
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="academic-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${tone ?? "text-academic"}`}>{value}</p>
    </div>
  );
}
