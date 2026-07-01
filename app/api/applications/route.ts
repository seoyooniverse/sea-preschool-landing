import { NextResponse } from "next/server";
import { saveApplication, type Application } from "@/lib/applications";

export const runtime = "nodejs";

const requiredFields = ["name", "phone", "email", "status", "interest", "goal", "motivation", "depositor"] as const;

export async function POST(request: Request) {
  const body = await request.json();

  for (const field of requiredFields) {
    if (!String(body[field] ?? "").trim()) {
      return NextResponse.json({ message: "필수 항목을 모두 입력해주세요." }, { status: 400 });
    }
  }

  if (!body.agreed) {
    return NextResponse.json({ message: "개인정보 수집 및 이용에 동의해주세요." }, { status: 400 });
  }

  const application: Application = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: String(body.name).trim(),
    phone: String(body.phone).trim(),
    email: String(body.email).trim(),
    school: String(body.school ?? "").trim(),
    major: String(body.major ?? "").trim(),
    status: String(body.status).trim(),
    interest: String(body.interest).trim(),
    goal: String(body.goal).trim(),
    motivation: String(body.motivation).trim(),
    referral: String(body.referral ?? "").trim(),
    depositor: String(body.depositor).trim(),
    agreed: Boolean(body.agreed),
  };

  await saveApplication(application);

  return NextResponse.json({ id: application.id, message: "지원서가 접수되었습니다." });
}
