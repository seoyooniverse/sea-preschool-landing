import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { curriculumWeeks } from "@/lib/content";

export const metadata = {
  title: "16주 상세 커리큘럼 | MJU x SEA 엔터 취업 포트폴리오",
  description: "시장 분석부터 최종 발표까지 이어지는 16주 프로젝트형 커리큘럼.",
};

export default function CurriculumPage() {
  return (
    <main className="min-h-screen bg-ink px-[var(--page-x)] py-8 text-bone">
      <div className="mx-auto max-w-content">
        <Link href="/#curriculum" className="inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-bone">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          첫페이지 돌아가기
        </Link>

        <section className="py-12 lg:py-20">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.18em] text-signal">16 Week Curriculum</p>
          <h1 className="max-w-[900px] text-[clamp(2.5rem,7vw,6.8rem)] font-black leading-[1.08] [word-break:keep-all]">
            시장 분석부터 발표까지,
            <span className="block text-smoke">하나의 프로젝트로.</span>
          </h1>
          <p className="mt-7 max-w-[620px] text-base font-medium leading-7 text-muted sm:text-lg sm:leading-8">
            매주 하나의 관점을 배우고, 하나의 결과물을 쌓습니다. 마지막에는 지원서에 담을 수 있는 아티스트 브랜딩·마케팅 제안서로 완성합니다.
          </p>
        </section>

        <section className="border-y border-line">
          {curriculumWeeks.map((item, index) => (
            <article key={item.week} className="grid gap-5 border-b border-line py-7 last:border-b-0 lg:grid-cols-[130px_1fr_220px]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-signal">{item.week}</p>
                <p className="mt-2 text-sm font-semibold text-muted">{String(index + 1).padStart(2, "0")} / 16</p>
              </div>
              <div>
                <h2 className="text-2xl font-black leading-tight [word-break:keep-all]">{item.title}</h2>
                <p className="mt-3 max-w-[760px] text-sm font-medium leading-6 text-muted sm:text-base sm:leading-7">{item.detail}</p>
              </div>
              <div className="grid content-start gap-2 text-sm font-bold">
                <p className="text-bone">{item.date}</p>
                <p className="text-muted">{item.time}</p>
                <p className={item.mode === "오프라인" ? "text-signal" : "text-smoke"}>{item.mode}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="flex flex-col gap-5 py-12 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[520px] text-base font-bold leading-7 text-smoke">
            16주 뒤, 관심은 보여줄 수 있는 결과물이 됩니다.
          </p>
          <Link
            href="/apply"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-bone px-8 text-base font-black text-ink transition hover:bg-signal hover:text-bone"
          >
            지원하기
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}
