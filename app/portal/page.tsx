import { ArrowRight, Bell, CalendarDays, CheckCircle2, Clock3, ExternalLink, FileText, Link2, MessageSquareText, UploadCloud, Video } from "lucide-react";
import { curriculumWeeks } from "@/lib/content";

const assignments = [
  {
    title: "시장 분석 리포트 초안",
    due: "2026.07.20 23:59",
    status: "제출 전",
    tone: "signal",
    body: "선택한 아티스트와 경쟁 레퍼런스 3팀의 포지션을 비교해 주세요.",
  },
  {
    title: "브랜드 코어 시트",
    due: "2026.07.27 23:59",
    status: "예정",
    tone: "muted",
    body: "타깃 팬덤, 콘셉트 키워드, 차별화 포인트를 한 페이지로 정리합니다.",
  },
  {
    title: "수강 오리엔테이션 확인",
    due: "2026.07.14 19:30",
    status: "완료",
    tone: "complete",
    body: "Zoom 접속명과 과제 제출 규칙 확인을 마쳤습니다.",
  },
];

const notices = [
  "온라인 수업은 매주 화요일 20:00에 같은 Zoom 링크로 입장합니다.",
  "과제는 마감 전까지 파일 또는 공유 링크로 제출할 수 있습니다.",
  "오프라인 실습 장소와 준비물은 해당 주차 3일 전 별도 공지됩니다.",
];

const quickActions = [
  { label: "Zoom 입장", icon: Video, href: "#" },
  { label: "과제 제출", icon: UploadCloud, href: "#assignments" },
  { label: "공지 확인", icon: Bell, href: "#notices" },
];

const nextClass = curriculumWeeks[0];
const upcomingWeeks = curriculumWeeks.slice(0, 4);

function StatusPill({ status, tone }: { status: string; tone: string }) {
  const className =
    tone === "complete"
      ? "border-bone/20 bg-bone text-ink"
      : tone === "signal"
        ? "border-signal/40 bg-signal/10 text-signal"
        : "border-line bg-transparent text-muted";

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${className}`}>{status}</span>;
}

export default function PortalPage() {
  return (
    <main className="min-h-screen bg-ink text-bone">
      <div className="noise" aria-hidden="true" />

      <header className="sticky top-0 z-40 border-b border-line bg-ink/78 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-page items-center justify-between px-[var(--page-x)]" aria-label="Portal navigation">
          <a href="/" className="brand-logo text-[13px] leading-tight text-bone sm:text-sm">
            MJU x SEA 수강 포털
          </a>
          <div className="hidden items-center gap-6 md:flex">
            <a href="#class" className="text-xs font-semibold text-muted transition hover:text-bone">
              수업
            </a>
            <a href="#assignments" className="text-xs font-semibold text-muted transition hover:text-bone">
              과제
            </a>
            <a href="#notices" className="text-xs font-semibold text-muted transition hover:text-bone">
              공지
            </a>
          </div>
          <a
            href="/"
            className="rounded-full border border-line px-4 py-2 text-xs font-bold transition hover:border-bone hover:bg-bone hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            랜딩으로
          </a>
        </nav>
      </header>

      <section className="mx-auto grid max-w-page gap-8 px-[var(--page-x)] pb-10 pt-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:pb-16 lg:pt-14">
        <div>
          <p className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-signal">
            <span className="h-px w-8 bg-signal" aria-hidden="true" />
            Student Home
          </p>
          <h1 className="max-w-[840px] text-[clamp(2.25rem,6vw,5.4rem)] font-black leading-[1.08] [word-break:keep-all]">
            오늘 수업 링크와
            <span className="block text-smoke">이번 주 과제만 빠르게.</span>
          </h1>
          <p className="mt-6 max-w-read text-base font-medium leading-7 text-smoke sm:text-lg">
            Zoom으로 진행되는 수업에 맞춰 진도율 대신 일정, 공지, 제출 상태를 한 화면에서 관리합니다.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-line px-6 text-sm font-black transition hover:border-bone hover:bg-bone hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {item.label}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              );
            })}
          </div>
        </div>

        <aside id="class" className="border-y border-line py-6 lg:border lg:p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">Next Class</p>
            <span className="rounded-full bg-signal px-3 py-1 text-xs font-black text-bone">{nextClass.mode}</span>
          </div>
          <h2 className="mt-6 text-3xl font-black leading-tight [word-break:keep-all]">{nextClass.title}</h2>
          <dl className="mt-6 grid gap-3 text-sm font-semibold text-smoke">
            <div className="flex items-center gap-3">
              <CalendarDays aria-hidden="true" className="h-4 w-4 text-signal" />
              <dt className="sr-only">일정</dt>
              <dd>{nextClass.date}</dd>
            </div>
            <div className="flex items-center gap-3">
              <Clock3 aria-hidden="true" className="h-4 w-4 text-signal" />
              <dt className="sr-only">시간</dt>
              <dd>{nextClass.time}</dd>
            </div>
            <div className="flex items-center gap-3">
              <Link2 aria-hidden="true" className="h-4 w-4 text-signal" />
              <dt className="sr-only">링크</dt>
              <dd>Zoom 고정 링크</dd>
            </div>
          </dl>
          <a
            href="#"
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-bone px-5 text-sm font-black text-ink transition hover:bg-signal hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            Zoom 수업 입장
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          </a>
        </aside>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-page gap-0 px-[var(--page-x)] lg:grid-cols-4">
          {upcomingWeeks.map((week) => (
            <article key={week.week} className="border-line py-6 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
              <p className="text-xs font-black text-signal">{week.week}</p>
              <h2 className="mt-3 min-h-14 text-lg font-black leading-tight [word-break:keep-all]">{week.title}</h2>
              <p className="mt-4 text-sm font-semibold text-muted">
                {week.date} · {week.time}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="assignments" className="mx-auto grid max-w-page gap-10 px-[var(--page-x)] py-16 lg:grid-cols-[0.72fr_1.28fr] lg:py-24">
        <div>
          <p className="mb-6 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-muted">
            <span className="h-px w-8 bg-signal" aria-hidden="true" />
            Assignments
          </p>
          <h2 className="text-[clamp(2rem,4.6vw,4.5rem)] font-black leading-[1.1] [word-break:keep-all]">
            제출해야 할 것만
            <span className="block text-signal">선명하게.</span>
          </h2>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {assignments.map((assignment) => (
            <article key={assignment.title} className="grid gap-5 py-6 md:grid-cols-[1fr_140px] md:items-center">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <FileText aria-hidden="true" className="h-5 w-5 text-signal" />
                  <StatusPill status={assignment.status} tone={assignment.tone} />
                </div>
                <h3 className="text-2xl font-black leading-tight [word-break:keep-all]">{assignment.title}</h3>
                <p className="mt-3 max-w-read text-sm font-medium leading-6 text-muted">{assignment.body}</p>
                <p className="mt-4 text-xs font-bold text-smoke">마감 {assignment.due}</p>
              </div>
              <a
                href="#"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm font-black transition hover:border-bone hover:bg-bone hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                제출하기
                <UploadCloud aria-hidden="true" className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="notices" className="mx-auto max-w-page px-[var(--page-x)] pb-16 lg:pb-24">
        <div className="grid gap-8 border-t border-line pt-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-muted">
              <span className="h-px w-8 bg-signal" aria-hidden="true" />
              Notices
            </p>
            <h2 className="text-3xl font-black leading-tight [word-break:keep-all]">수업 전 확인할 공지</h2>
          </div>
          <div className="grid gap-3">
            {notices.map((notice) => (
              <p key={notice} className="flex gap-3 border-b border-line pb-4 text-sm font-medium leading-6 text-smoke">
                <MessageSquareText aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
                {notice}
              </p>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-[var(--page-x)] py-8">
        <div className="mx-auto flex max-w-page flex-col gap-3 text-xs font-semibold text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>MJU x SEA Student Portal Prototype</p>
          <p className="flex items-center gap-2">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-signal" />
            Zoom 수업 운영에 맞춘 MVP 화면
          </p>
        </div>
      </footer>
    </main>
  );
}
