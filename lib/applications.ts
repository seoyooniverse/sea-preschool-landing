import { promises as fs } from "fs";
import path from "path";
export { bankInfo } from "@/lib/program";

export type Application = {
  id: string;
  createdAt: string;
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

export async function readApplications(): Promise<Application[]> {
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
  await fs.mkdir(dataDir, { recursive: true });
  const applications = await readApplications();
  applications.unshift(application);
  await fs.writeFile(dataFile, JSON.stringify(applications, null, 2), "utf8");
}
