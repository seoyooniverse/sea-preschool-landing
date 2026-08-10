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

function extensionOf(filename: string) {
  return filename.split(".").pop()?.toLowerCase() ?? "";
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
  const filePath = `${cohort}/${assignmentTitle}/${studentEmail}/${id}-${originalFilename}`;

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
    return NextResponse.json({ message: "업로드 저장 중 문제가 발생했습니다. 운영팀에 문의해주세요." }, { status: 500 });
  }
}
