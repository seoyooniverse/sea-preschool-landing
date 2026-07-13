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

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function readStudents(): Promise<Student[]> {
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

  if (existingIndex >= 0) {
    students[existingIndex] = student;
  } else {
    students.unshift(student);
  }

  await writeStudents(students);
  return student;
}
