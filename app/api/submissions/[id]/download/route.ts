import { NextResponse } from "next/server";
import { createSubmissionDownloadUrl, findSubmissionById } from "@/lib/submissions";

type DownloadRouteProps = {
  params: Promise<{ id: string }>;
};

export const runtime = "nodejs";

export async function GET(request: Request, { params }: DownloadRouteProps) {
  const { id } = await params;
  const requestUrl = new URL(request.url);
  const adminKey = (process.env.ADMIN_KEY ?? "sea2026").trim();
  const enteredKey = String(requestUrl.searchParams.get("key") ?? "").trim();

  if (enteredKey !== adminKey) {
    return NextResponse.json({ message: "관리자 권한이 필요합니다." }, { status: 401 });
  }

  const submission = await findSubmissionById(id);
  if (!submission) {
    return NextResponse.json({ message: "제출물을 찾을 수 없습니다." }, { status: 404 });
  }

  const downloadUrl = await createSubmissionDownloadUrl(submission.filePath);
  return NextResponse.redirect(downloadUrl);
}
