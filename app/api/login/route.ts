import { NextResponse } from "next/server";
import { findActiveStudentByEmail, normalizeEmail } from "@/lib/students";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const email = normalizeEmail(String(body.email ?? ""));

  if (!email) {
    return NextResponse.json({ message: "이메일을 입력해주세요." }, { status: 400 });
  }

  const student = await findActiveStudentByEmail(email);
  if (!student) {
    return NextResponse.json({ message: "등록된 수강생 이메일이 아닙니다. 운영팀에 등록 상태를 확인해주세요." }, { status: 403 });
  }

  const response = NextResponse.json({ message: "로그인되었습니다.", redirectTo: "/portal" });
  response.cookies.set("sea_student_email", student.email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return response;
}
