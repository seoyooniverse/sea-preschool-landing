import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { julyAcademicSchedule, julyCurriculumWeeks } from "@/lib/content";

export const metadata = {
  title: "2026년 7월 1기 아카이브 | MJU x SEA 엔터 취업 포트폴리오",
  description: "MJU x SEA 엔터 취업 포트폴리오 2026년 7월 1기 과정 안내 아카이브.",
};

export default function JulyArchivePage() {
  return (
    <main className="min-h-screen bg-ink px-[var(--page-x)] py-8 text-bone">
      <div className="mx-auto max-w-content">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-bone">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          첫페이지 돌아가기
        </Link>

        <section className="py-12 lg:py-20">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.18em] text-signal">Archive</p>
          <h1 className="max-w-[900px] text-[clamp(2.5rem,7vw,6.8rem)] font-black leading-[1.08] [word-break:keep-all]">
            2026년 7월 1기
            <span className="block text-smoke">과정 안내 아카이브.</span>
          </h1>
          <p className="mt-7 max-w-[640px] text-base font-medium leading-7 text-muted sm:text-lg sm:leading-8">
            기존 수강생과 운영 확인을 위한 2026년 7월 개강반 안내 페이지입니다. 현재 모집 정보는 첫페이지에서 확인해주세요.
          </p>
        </section>

        <section className="grid gap-12 border-y border-line py-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-signal">Schedule</p>
            <h2 className="mt-4 text-[clamp(2rem,4.8vw,4.8rem)] font-black leading-[1.1]">학사일정</h2>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {julyAcademicSchedule.map((item) => (
              <div key={item.label} className="grid gap-2 py-5 sm:grid-cols-[140px_1fr]">
                <p className="text-sm font-black text-signal">{item.label}</p>
                <p className="text-lg font-black leading-snug text-smoke">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.18em] text-signal">Curriculum</p>
          <h2 className="max-w-[760px] text-[clamp(2rem,4.8vw,4.8rem)] font-black leading-[1.1] [word-break:keep-all]">
            16주 커리큘럼
          </h2>
          <div className="mt-10 border-y border-line">
            {julyCurriculumWeeks.map((item, index) => (
              <article key={item.week} className="grid gap-5 border-b border-line py-6 last:border-b-0 lg:grid-cols-[120px_1fr_220px]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-signal">{item.week}</p>
                  <p className="mt-2 text-sm font-semibold text-muted">{String(index + 1).padStart(2, "0")} / 16</p>
                </div>
                <h3 className="text-xl font-black leading-tight [word-break:keep-all]">{item.title}</h3>
                <div className="grid content-start gap-2 text-sm font-bold">
                  <p className="text-bone">{item.date}</p>
                  <p className="text-muted">{item.time}</p>
                  <p className={item.mode === "오프라인" ? "text-signal" : "text-smoke"}>{item.mode}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
