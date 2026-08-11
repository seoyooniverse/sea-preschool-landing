import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { normalizeCohort } from "@/lib/cohorts";
import { findActiveStudentByEmail, normalizeEmail } from "@/lib/students";
import { saveSubmission, uploadAssignmentFile, type Submission } from "@/lib/submissions";

export const runtime = "nodejs";

const allowedExtensions = new Set(["pdf", "ppt", "pptx", "doc", "docx", "hwp", "hwpx", "png", "jpg", "jpeg", "webp"]);
const maxFileSize = 20 * 1024 * 1024;

function safeFilename(filename: string) {
  const trimmed = filename.trim().replace(/\s+/g, "-");
  return trimmed.replace(/[^a-zA-Z0-9._가-힣-]/g, "");
}

function storageSafeFilename(filename: string, extension: string) {
  const base = filename
    .replace(/\.[^.]+$/, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 80);

  return `${base || "submission"}.${extension}`;
}

function extensionOf(filename: string) {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

function cohortSlug(cohort: string) {
  if (cohort.includes("9월") || cohort.includes("3기")) {
    return "2026-09";
  }

  if (cohort.includes("8월")) {
    return "2026-08";
  }

  return "2026-07";
}

function assignmentSlug(title: string) {
  const week = title.match(/week\s*(\d+)/i)?.[1] ?? title.match(/Week\s*(\d+)/)?.[1];

  if (week) {
    return `week-${week.padStart(2, "0")}`;
  }

  if (title.includes("시장")) {
    return "market-analysis";
  }

  if (title.includes("브랜드")) {
    return "brand-core";
  }

  if (title.includes("장르")) {
    return "genre-language";
  }

  if (title.includes("프리프로덕션")) {
    return "pre-production";
  }

  return "assignment";
}

function publicErrorDetail(error: unknown) {
  if (!(error instanceof Error)) {
    return "알 수 없는 오류";
  }

  return error.message
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [hidden]")
    .replace(/apikey['\"]?\s*:\s*['\"][^'\"]+['\"]/gi, "apikey: [hidden]");
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const email = cookieStore.get("sea_student_email")?.value;
  const student = email ? await findActiveStudentByEmail(email) : null;

  if (!student) {
    return NextResponse.json({ message: "로그인 후 제출할 수 있습니다." }, { status: 401 });
  }

  const formData = await request.formData();
  const assignmentTitle = String(formData.get("assignmentTitle") ?? "").trim();
  const comment = String(formData.get("comment") ?? "").trim();
  const file = formData.get("file");

  if (!assignmentTitle) {
    return NextResponse.json({ message: "과제 정보가 없습니다." }, { status: 400 });
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "제출할 파일을 선택해주세요." }, { status: 400 });
  }

  if (file.size > maxFileSize) {
    return NextResponse.json({ message: "파일은 20MB 이하로 업로드해주세요." }, { status: 400 });
  }

  const extension = extensionOf(file.name);
  if (!allowedExtensions.has(extension)) {
    return NextResponse.json({ message: "PDF, PPT, 문서, 이미지 파일만 업로드할 수 있습니다." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const cohort = normalizeCohort(student.cohort);
  const studentEmail = normalizeEmail(student.email);
  const originalFilename = safeFilename(file.name) || `submission.${extension}`;
  const storageFilename = storageSafeFilename(file.name, extension);
  const filePath = `${cohortSlug(cohort)}/${assignmentSlug(assignmentTitle)}/${studentEmail}/${id}-${storageFilename}`;

  try {
    await uploadAssignmentFile(file, filePath);

    const submission: Submission = {
      id,
      createdAt: new Date().toISOString(),
      studentEmail,
      studentName: student.name,
      cohort,
      assignmentTitle,
      filePath,
      originalFilename,
      fileSize: file.size,
      fileType: file.type || extension,
      comment,
      status: "submitted",
    };

    await saveSubmission(submission);
    return NextResponse.json({ id, message: "과제가 제출되었습니다." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "업로드 저장 중 문제가 발생했습니다.",
        detail: publicErrorDetail(error),
      },
      { status: 500 },
    );
  }
}
