import { promises as fs } from "fs";
import path from "path";
import type { Application } from "@/lib/applications";

export type Student = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  role: "student" | "admin";
  status: "active" | "inactive";
  sourceApplicationId?: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "students.json");

type SupabaseStudentRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  role: "student" | "admin";
  status: "active" | "inactive";
  source_application_id: string | null;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
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

  return `${url.replace(/\/$/, "")}/rest/v1/students${query}`;
}

function toRow(student: Student): SupabaseStudentRow {
  return {
    id: student.id,
    created_at: student.createdAt,
    name: student.name,
    email: normalizeEmail(student.email),
    role: student.role,
    status: student.status,
    source_application_id: student.sourceApplicationId ?? null,
  };
}

function fromRow(row: SupabaseStudentRow): Student {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    email: normalizeEmail(row.email),
    role: row.role,
    status: row.status,
    sourceApplicationId: row.source_application_id ?? undefined,
  };
}

async function readSupabaseStudents(): Promise<Student[]> {
  const response = await fetch(getSupabaseEndpoint("?select=*&order=created_at.desc"), {
    headers: getSupabaseHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    if (response.status === 404 || message.includes("students")) {
      return [];
    }
    throw new Error(`Could not read Supabase students: ${message}`);
  }

  const rows = (await response.json()) as SupabaseStudentRow[];
  return rows.map(fromRow);
}

async function findSupabaseActiveStudentByEmail(email: string) {
  const normalized = normalizeEmail(email);
  const response = await fetch(getSupabaseEndpoint(`?select=*&email=eq.${encodeURIComponent(normalized)}&status=eq.active&limit=1`), {
    headers: getSupabaseHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    if (response.status === 404 || message.includes("students")) {
      return null;
    }
    throw new Error(`Could not read Supabase student: ${message}`);
  }

  const rows = (await response.json()) as SupabaseStudentRow[];
  return rows[0] ? fromRow(rows[0]) : null;
}

async function upsertSupabaseStudent(student: Student) {
  const response = await fetch(getSupabaseEndpoint("?on_conflict=email"), {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(toRow(student)),
  });

  if (!response.ok) {
    throw new Error(`Could not save Supabase student: ${await response.text()}`);
  }
}

export async function readStudents(): Promise<Student[]> {
  if (hasSupabaseConfig()) {
    return readSupabaseStudents();
  }

  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw) as Student[];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeStudents(students: Student[]) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(students, null, 2), "utf8");
}

export async function findActiveStudentByEmail(email: string) {
  if (hasSupabaseConfig()) {
    return findSupabaseActiveStudentByEmail(email);
  }

  const normalized = normalizeEmail(email);
  const students = await readStudents();
  return students.find((student) => normalizeEmail(student.email) === normalized && student.status === "active") ?? null;
}

export async function enrollStudentFromApplication(application: Application) {
  const students = await readStudents();
  const normalized = normalizeEmail(application.email);
  const existingIndex = students.findIndex((student) => normalizeEmail(student.email) === normalized);
  const student: Student = {
    id: existingIndex >= 0 ? students[existingIndex].id : crypto.randomUUID(),
    createdAt: existingIndex >= 0 ? students[existingIndex].createdAt : new Date().toISOString(),
    name: application.name,
    email: normalized,
    role: "student",
    status: "active",
    sourceApplicationId: application.id,
  };

  if (hasSupabaseConfig()) {
    await upsertSupabaseStudent(student);
    return student;
  }

  if (existingIndex >= 0) {
    students[existingIndex] = student;
  } else {
    students.unshift(student);
  }

  await writeStudents(students);
  return student;
}
