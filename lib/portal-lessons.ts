import { AUGUST_COHORT, JULY_COHORT, SEPTEMBER_COHORT, normalizeCohort } from "@/lib/cohorts";

export type PortalVideo = {
  label: string;
  watchUrl: string;
  embedUrl: string;
};

export type PortalLesson = {
  week: string;
  date: string;
  dateKey: number;
  time: string;
  mode: "인강" | "실시간";
  instructor: string;
  title: string;
  videos?: PortalVideo[];
};

type PortalLessonRow = {
  cohort: string;
  week: string;
  date: string;
  date_key: number;
  time: string;
  mode: "인강" | "실시간";
  instructor: string;
  title: string;
  videos: PortalVideo[] | null;
};

const week13Videos: PortalVideo[] = [
  createPortalVideo("13강 1교시", "https://youtu.be/_vinFW809h8"),
  createPortalVideo("13강 2교시", "https://youtu.be/FBWgruxyY9Y"),
];

const week15Videos: PortalVideo[] = [
  createPortalVideo("15강 1교시", "https://youtu.be/7f2L-3O6J6M"),
  createPortalVideo("15강 2교시", "https://youtu.be/oFjaIEUbnq8"),
];

const defaultLessons: Record<string, PortalLesson[]> = {
  [JULY_COHORT]: [
    lesson("13강", 20261006, "인강", "문원경 교수", "유통·저작권·퍼블리싱 실무", week13Videos),
    lesson("14강", 20261013, "실시간", "안서윤 교수", "소셜 마케팅 트렌드 & SEO"),
    lesson("15강", 20261020, "인강", "문원경 교수", "글로벌 역주행 전략", week15Videos),
  ],
  [AUGUST_COHORT]: [
    lesson("13강", 20261026, "인강", "문원경 교수", "유통·저작권·퍼블리싱 실무", week13Videos),
    lesson("14강", 20261102, "실시간", "안서윤 교수", "소셜 마케팅 트렌드 & SEO"),
    lesson("15강", 20261103, "인강", "문원경 교수", "글로벌 역주행 전략", week15Videos),
  ],
  [SEPTEMBER_COHORT]: [
    lesson("13강", 20261110, "인강", "문원경 교수", "유통·저작권·퍼블리싱 실무", week13Videos),
    lesson("14강", 20261117, "실시간", "안서윤 교수", "소셜 마케팅 트렌드 & SEO"),
    lesson("15강", 20261124, "인강", "문원경 교수", "글로벌 역주행 전략", week15Videos),
  ],
};

function lesson(
  week: string,
  dateKey: number,
  mode: PortalLesson["mode"],
  instructor: string,
  title: string,
  videos?: PortalVideo[],
): PortalLesson {
  return {
    week,
    date: formatLessonDate(dateKey),
    dateKey,
    time: mode === "인강" ? "00:00 공개" : "20:00-22:00",
    mode,
    instructor,
    title,
    videos,
  };
}

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

function getSupabaseEndpoint(query = "") {
  const url = process.env.SUPABASE_URL;

  if (!url) {
    throw new Error("SUPABASE_URL is not configured.");
  }

  return `${url.replace(/\/$/, "")}/rest/v1/portal_lessons${query}`;
}

function fromRow(row: PortalLessonRow): PortalLesson {
  return {
    week: row.week,
    date: row.date,
    dateKey: row.date_key,
    time: row.time,
    mode: row.mode,
    instructor: row.instructor,
    title: row.title,
    videos: row.videos ?? undefined,
  };
}

function toRow(cohort: string, lessonValue: PortalLesson): PortalLessonRow {
  return {
    cohort: normalizeCohort(cohort),
    week: lessonValue.week,
    date: lessonValue.date,
    date_key: lessonValue.dateKey,
    time: lessonValue.time,
    mode: lessonValue.mode,
    instructor: lessonValue.instructor,
    title: lessonValue.title,
    videos: lessonValue.videos ?? null,
  };
}

function isMissingTable(response: Response, message: string) {
  return response.status === 404 || message.includes("portal_lessons") || message.includes("PGRST205");
}

async function readOverrides(cohort: string) {
  const normalized = normalizeCohort(cohort);
  const response = await fetch(
    getSupabaseEndpoint(`?select=*&cohort=eq.${encodeURIComponent(normalized)}&order=date_key.asc`),
    { headers: getSupabaseHeaders(), cache: "no-store" },
  );

  if (!response.ok) {
    const message = await response.text();
    if (isMissingTable(response, message)) {
      return [];
    }
    throw new Error(`Could not read portal lessons: ${message}`);
  }

  return ((await response.json()) as PortalLessonRow[]).map(fromRow);
}

export function createPortalVideo(label: string, watchUrl: string): PortalVideo {
  const trimmedUrl = watchUrl.trim();
  const parsed = new URL(trimmedUrl);
  let videoId = "";

  if (parsed.hostname === "youtu.be") {
    videoId = parsed.pathname.slice(1).split("/")[0];
  } else if (parsed.hostname.endsWith("youtube.com")) {
    videoId = parsed.searchParams.get("v") ?? parsed.pathname.split("/").filter(Boolean).at(-1) ?? "";
  }

  if (!videoId) {
    throw new Error("올바른 YouTube 링크를 입력해주세요.");
  }

  return {
    label,
    watchUrl: trimmedUrl,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
  };
}

export function formatLessonDate(dateKey: number) {
  const value = String(dateKey);
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][new Date(Date.UTC(year, month - 1, day)).getUTCDay()];

  return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}(${weekday})`;
}

export async function getPortalLessons(cohort: string) {
  const normalized = normalizeCohort(cohort);
  const defaults = defaultLessons[normalized] ?? [];

  if (!hasSupabaseConfig()) {
    return defaults;
  }

  const overrides = await readOverrides(normalized);
  const overrideByWeek = new Map(overrides.map((item) => [item.week, item]));
  const merged = defaults.map((item) => overrideByWeek.get(item.week) ?? item);
  const defaultWeeks = new Set(defaults.map((item) => item.week));

  return [...merged, ...overrides.filter((item) => !defaultWeeks.has(item.week))].sort((a, b) => a.dateKey - b.dateKey);
}

export async function savePortalLesson(cohort: string, lessonValue: PortalLesson) {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const response = await fetch(getSupabaseEndpoint("?on_conflict=cohort,week"), {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(toRow(cohort, lessonValue)),
  });

  if (!response.ok) {
    throw new Error(`Could not save portal lesson: ${await response.text()}`);
  }
}
