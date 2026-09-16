import { useEffect, useState } from "react";
import { courseByCode } from "@/data/curriculum";
import type { StudentSetup } from "@/data/setup";

export const LINK_KINDS = ["Google Classroom", "Google Drive", "Google Sheets", "LMS (EMAS)", "Assistant link", "Other"] as const;
export type LinkKind = (typeof LINK_KINDS)[number];

export type CourseLink = { id: number; code: string; kind: LinkKind; label: string; url: string };

export type AssistantSession = {
  id: number;
  code: string;
  section: string;
  assistant: string;
  day: string;
  start: string;
  end: string;
  room: string;
  link: string;
};

export type ArchivedSemester = {
  id: number;
  semester: number;
  academicYear: string;
  courses: string[];
  sks: number;
  gpa: number;
  resources: number;
  completedTasks: number;
  notes: string;
};

export type SemesterData = {
  links: CourseLink[];
  sessions: AssistantSession[];
  archive: ArchivedSemester[];
};

const STORAGE_KEY = "academic-os.semester.v1";
const empty: SemesterData = { links: [], sessions: [], archive: [] };

/** Client-only semester workspace state (links, assistant sessions, archive). */
export function useSemesterData() {
  const [data, setData] = useState<SemesterData>(empty);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...empty, ...(JSON.parse(raw) as SemesterData) });
    } catch {
      /* ignore unreadable storage */
    }
  }, []);

  const write = (next: SemesterData) => {
    setData(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore full storage */
    }
  };

  return {
    ...data,
    addLink: (link: Omit<CourseLink, "id">) => write({ ...data, links: [...data.links, { ...link, id: Date.now() }] }),
    removeLink: (id: number) => write({ ...data, links: data.links.filter((item) => item.id !== id) }),
    addSession: (session: Omit<AssistantSession, "id">) => write({ ...data, sessions: [...data.sessions, { ...session, id: Date.now() }] }),
    removeSession: (id: number) => write({ ...data, sessions: data.sessions.filter((item) => item.id !== id) }),
    addArchive: (entry: Omit<ArchivedSemester, "id">) => write({ ...data, archive: [...data.archive, { ...entry, id: Date.now() }].sort((a, b) => a.semester - b.semester) }),
    removeArchive: (id: number) => write({ ...data, archive: data.archive.filter((item) => item.id !== id) }),
  };
}

/** Semester 1 starts in the entry year's odd (Gasal) term; each year holds two semesters. */
export function academicYearLabel(entryYear: number, semester: number) {
  const yearOffset = Math.floor((semester - 1) / 2);
  const startYear = entryYear + yearOffset;
  const term = semester % 2 === 1 ? "Gasal" : "Genap";
  return `${term} ${startYear}/${startYear + 1}`;
}

export function courseTitle(code: string) {
  return courseByCode.get(code)?.name ?? code;
}

/** Everything the semester workspace header needs, derived from the onboarding setup. */
export function semesterSummary(setup: StudentSetup | null, activeSks: number, activeCount: number, completedSks: number, totalSks: number) {
  const semester = setup?.currentSemester ?? 1;
  return {
    semester,
    academicYear: academicYearLabel(setup?.entryYear ?? new Date().getFullYear(), semester),
    completedSks,
    totalSks,
    activeSks,
    activeCount,
  };
}
