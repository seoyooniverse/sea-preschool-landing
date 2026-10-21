import { NextResponse } from "next/server";
import { findActiveStudentByNameAndPhone, normalizePhone } from "@/lib/students";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const phone = normalizePhone(String(body.phone ?? ""));

  if (!name || !phone) {
    return NextResponse.json({ message: "이름과 휴대폰 번호를 모두 입력해주세요." }, { status: 400 });
  }

  const student = await findActiveStudentByNameAndPhone(name, phone);
  if (!student) {
    return NextResponse.json(
      { message: "등록된 수강생 정보를 찾을 수 없습니다. 신청서에 작성한 이름과 휴대폰 번호를 확인해주세요." },
      { status: 403 },
    );
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
