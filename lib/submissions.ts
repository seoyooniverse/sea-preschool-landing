import { normalizeCohort } from "@/lib/cohorts";

export const ASSIGNMENT_BUCKET = "assignment-files";

export type Submission = {
  id: string;
  createdAt: string;
  studentEmail: string;
  studentName: string;
  cohort: string;
  assignmentTitle: string;
  filePath: string;
  originalFilename: string;
  fileSize: number;
  fileType: string;
  comment: string;
  status: "submitted";
};

type SupabaseSubmissionRow = {
  id: string;
  created_at: string;
  student_email: string;
  student_name: string;
  cohort: string;
  assignment_title: string;
  file_path: string;
  original_filename: string;
  file_size: number | null;
  file_type: string | null;
  comment: string | null;
  status: "submitted";
};

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseHeaders(contentType = "application/json") {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": contentType,
  };
}

function getSupabaseUrl() {
  const url = process.env.SUPABASE_URL;

  if (!url) {
    throw new Error("SUPABASE_URL is not configured.");
  }

  return url.replace(/\/$/, "");
}

function getTableEndpoint(query = "") {
  return `${getSupabaseUrl()}/rest/v1/submissions${query}`;
}

function encodeStoragePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function toRow(submission: Submission): SupabaseSubmissionRow {
  return {
    id: submission.id,
    created_at: submission.createdAt,
    student_email: submission.studentEmail,
    student_name: submission.studentName,
    cohort: normalizeCohort(submission.cohort),
    assignment_title: submission.assignmentTitle,
    file_path: submission.filePath,
    original_filename: submission.originalFilename,
    file_size: submission.fileSize,
    file_type: submission.fileType,
    comment: submission.comment || null,
    status: submission.status,
  };
}

function fromRow(row: SupabaseSubmissionRow): Submission {
  return {
    id: row.id,
    createdAt: row.created_at,
    studentEmail: row.student_email,
    studentName: row.student_name,
    cohort: normalizeCohort(row.cohort),
    assignmentTitle: row.assignment_title,
    filePath: row.file_path,
    originalFilename: row.original_filename,
    fileSize: row.file_size ?? 0,
    fileType: row.file_type ?? "",
    comment: row.comment ?? "",
    status: row.status,
  };
}

export function requireSupabaseStorage() {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase is required for file submissions.");
  }
}

export async function uploadAssignmentFile(file: File, filePath: string) {
  requireSupabaseStorage();

  const response = await fetch(`${getSupabaseUrl()}/storage/v1/object/${ASSIGNMENT_BUCKET}/${encodeStoragePath(filePath)}`, {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(file.type || "application/octet-stream"),
      "x-upsert": "true",
    },
    body: await file.arrayBuffer(),
  });

  if (!response.ok) {
    throw new Error(`Could not upload assignment file: ${await response.text()}`);
  }
}

export async function saveSubmission(submission: Submission) {
  requireSupabaseStorage();

  const response = await fetch(getTableEndpoint(), {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(),
      Prefer: "return=minimal",
    },
    body: JSON.stringify(toRow(submission)),
  });

  if (!response.ok) {
    throw new Error(`Could not save submission: ${await response.text()}`);
  }
}

export async function readSubmissions(): Promise<Submission[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const response = await fetch(getTableEndpoint("?select=*&order=created_at.desc"), {
    headers: getSupabaseHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    if (response.status === 404 || message.includes("submissions")) {
      return [];
    }
    throw new Error(`Could not read submissions: ${message}`);
  }

  const rows = (await response.json()) as SupabaseSubmissionRow[];
  return rows.map(fromRow);
}

export async function findSubmissionById(id: string) {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const response = await fetch(getTableEndpoint(`?select=*&id=eq.${encodeURIComponent(id)}&limit=1`), {
    headers: getSupabaseHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not read submission: ${await response.text()}`);
  }

  const rows = (await response.json()) as SupabaseSubmissionRow[];
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function createSubmissionDownloadUrl(filePath: string) {
  requireSupabaseStorage();

  const response = await fetch(`${getSupabaseUrl()}/storage/v1/object/sign/${ASSIGNMENT_BUCKET}/${encodeStoragePath(filePath)}`, {
    method: "POST",
    headers: getSupabaseHeaders(),
    body: JSON.stringify({ expiresIn: 60 }),
  });

  if (!response.ok) {
    throw new Error(`Could not create download URL: ${await response.text()}`);
  }

  const result = (await response.json()) as { signedURL?: string; signedUrl?: string };
  const signedPath = result.signedURL ?? result.signedUrl;

  if (!signedPath) {
    throw new Error("Supabase did not return a signed download URL.");
  }

  return signedPath.startsWith("http") ? signedPath : `${getSupabaseUrl()}/storage/v1${signedPath}`;
}
