import { promises as fs } from "fs";
import path from "path";
export { bankInfo } from "@/lib/program";

export type Application = {
  id: string;
  createdAt: string;
  cohort: string;
  name: string;
  phone: string;
  email: string;
  school: string;
  major: string;
  status: string;
  interest: string;
  goal: string;
  motivation: string;
  referral: string;
  depositor: string;
  agreed: boolean;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "applications.json");

type SupabaseApplicationRow = {
  id: string;
  created_at: string;
  cohort: string | null;
  name: string;
  phone: string;
  email: string;
  school: string | null;
  major: string | null;
  status: string;
  interest: string;
  goal: string;
  motivation: string;
  referral: string | null;
  depositor: string;
  agreed: boolean;
};

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

  return `${url.replace(/\/$/, "")}/rest/v1/applications${query}`;
}

function toRow(application: Application): SupabaseApplicationRow {
  return {
    id: application.id,
    created_at: application.createdAt,
    cohort: application.cohort,
    name: application.name,
    phone: application.phone,
    email: application.email,
    school: application.school || null,
    major: application.major || null,
    status: application.status,
    interest: application.interest,
    goal: application.goal,
    motivation: application.motivation,
    referral: application.referral || null,
    depositor: application.depositor,
    agreed: application.agreed,
  };
}

function fromRow(row: SupabaseApplicationRow): Application {
  return {
    id: row.id,
    createdAt: row.created_at,
    cohort: row.cohort ?? "기수 미지정",
    name: row.name,
    phone: row.phone,
    email: row.email,
    school: row.school ?? "",
    major: row.major ?? "",
    status: row.status,
    interest: row.interest,
    goal: row.goal,
    motivation: row.motivation,
    referral: row.referral ?? "",
    depositor: row.depositor,
    agreed: row.agreed,
  };
}

async function readSupabaseApplications(): Promise<Application[]> {
  const response = await fetch(getSupabaseEndpoint("?select=*&order=created_at.desc"), {
    headers: getSupabaseHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not read Supabase applications: ${await response.text()}`);
  }

  const rows = (await response.json()) as SupabaseApplicationRow[];
  return rows.map(fromRow);
}

async function saveSupabaseApplication(application: Application) {
  const response = await fetch(getSupabaseEndpoint(), {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(),
      Prefer: "return=minimal",
    },
    body: JSON.stringify(toRow(application)),
  });

  if (!response.ok) {
    throw new Error(`Could not save Supabase application: ${await response.text()}`);
  }
}

export async function readApplications(): Promise<Application[]> {
  if (hasSupabaseConfig()) {
    return readSupabaseApplications();
  }

  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw) as Application[];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function saveApplication(application: Application) {
  if (hasSupabaseConfig()) {
    await saveSupabaseApplication(application);
    return;
  }

  await fs.mkdir(dataDir, { recursive: true });
  const applications = await readApplications();
  applications.unshift(application);
  await fs.writeFile(dataFile, JSON.stringify(applications, null, 2), "utf8");
}
