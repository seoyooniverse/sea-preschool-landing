import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "로그아웃되었습니다.", redirectTo: "/login" });
  response.cookies.delete("sea_student_email");
  return response;
}
