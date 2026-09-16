import { useEffect, useState } from "react";
import { curriculum, TOTAL_SKS, courseByCode } from "@/data/curriculum";

export const SECTIONS = ["A", "B", "C", "D", "E"] as const;
export type Section = (typeof SECTIONS)[number];

export const CLASS_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
export type ClassDay = (typeof CLASS_DAYS)[number];

export type ActiveCourseConfig = {
  code: string;
  section: Section;
  lecturer: string;
  assistant: string;
  day: ClassDay;
  start: string;
  end: string;
  room: string;
};

export type StudentSetup = {
  name: string;
  program: string;
  faculty: string;
  university: string;
  entryYear: number;
  currentSemester: number;
  completed: string[];
  active: ActiveCourseConfig[];
  completedAt: string;
};

const STORAGE_KEY = "academic-os.setup.v1";

export function loadSetup(): StudentSetup | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StudentSetup) : null;
  } catch {
    return null;
  }
}

export function persistSetup(setup: StudentSetup | null) {
  if (typeof window === "undefined") return;
  if (setup) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(setup));
  else window.localStorage.removeItem(STORAGE_KEY);
}

/** Client-only setup state. `ready` is false until localStorage has been read. */
export function useSetup() {
  const [ready, setReady] = useState(false);
  const [setup, setSetupState] = useState<StudentSetup | null>(null);

  useEffect(() => {
    setSetupState(loadSetup());
    setReady(true);
  }, []);

  const save = (next: StudentSetup) => { persistSetup(next); setSetupState(next); };
  const reset = () => { persistSetup(null); setSetupState(null); };

  return { ready, setup, save, reset };
}

export const semesterGroups = Array.from({ length: 8 }, (_, index) => index + 1).map((semester) => ({
  semester,
  courses: curriculum.filter((course) => course.semester === semester),
}));

export function sksOf(codes: string[]) {
  return codes.reduce((total, code) => total + (courseByCode.get(code)?.sks ?? 0), 0);
}

export function degreeProgress(codes: string[]) {
  const completedSks = sksOf(codes);
  return {
    completedSks,
    remainingSks: Math.max(TOTAL_SKS - completedSks, 0),
    percent: Math.min(Math.round((completedSks / TOTAL_SKS) * 100), 100),
    totalSks: TOTAL_SKS,
  };
}
