import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { bankInfo } from "@/lib/program";

type CompletePageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function CompletePage({ searchParams }: CompletePageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-ink px-[var(--page-x)] py-8 text-bone">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-content flex-col justify-center">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-signal">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Submitted
            </p>
            <h1 className="text-[clamp(2.6rem,8vw,7rem)] font-black leading-[1.06] [word-break:keep-all]">
              신청이 접수되었습니다.
              <span className="block text-smoke">등록 안내를 확인해주세요.</span>
            </h1>
            <p className="mt-7 max-w-[560px] text-base font-medium leading-7 text-muted">
              신청 내용을 확인한 뒤, 첫 달 수강료 입금 확인까지 완료되면 최종 등록 안내를 보내드립니다.
            </p>
            {params.id ? (
              <p className="mt-5 text-xs font-semibold text-muted">접수번호: {params.id}</p>
            ) : null}
          </div>

          <div className="border-y border-line py-8">
            <p className="text-sm font-black text-signal">등록 안내</p>
            <dl className="mt-7 grid gap-5">
              <div className="grid grid-cols-[90px_1fr] gap-4 border-t border-line pt-5">
                <dt className="text-sm font-semibold text-muted">금액</dt>
                <dd className="text-2xl font-black">{bankInfo.amount}</dd>
              </div>
              <div className="grid grid-cols-[90px_1fr] gap-4 border-t border-line pt-5">
                <dt className="text-sm font-semibold text-muted">은행</dt>
                <dd className="text-lg font-black">{bankInfo.bank}</dd>
              </div>
              <div className="grid grid-cols-[90px_1fr] gap-4 border-t border-line pt-5">
                <dt className="text-sm font-semibold text-muted">계좌</dt>
                <dd className="break-all text-lg font-black">{bankInfo.account}</dd>
              </div>
              <div className="grid grid-cols-[90px_1fr] gap-4 border-t border-line pt-5">
                <dt className="text-sm font-semibold text-muted">예금주</dt>
                <dd className="text-lg font-black">{bankInfo.holder}</dd>
              </div>
            </dl>

            <div className="mt-8 border-t border-line pt-6">
              <p className="text-sm font-black text-bone">다음 단계</p>
              <ol className="mt-4 grid gap-3 text-sm font-medium leading-6 text-muted">
                <li>1. 신청자명과 동일한 입금자명으로 첫 달 수강료 15만원을 입금해주세요.</li>
                <li>2. 운영팀이 신청서와 입금 내역을 확인합니다.</li>
                <li>3. 최종 등록 안내가 문자 또는 이메일로 발송됩니다.</li>
              </ol>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-bone px-6 text-sm font-black text-ink transition hover:bg-signal hover:text-bone"
              >
                첫페이지 돌아가기
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/apply"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-line px-6 text-sm font-black text-bone transition hover:border-bone"
              >
                신청서 다시 작성
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
