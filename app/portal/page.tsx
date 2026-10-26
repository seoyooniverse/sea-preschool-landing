import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  LockKeyhole,
  MessageSquareText,
  PlayCircle,
  Radio,
  Video,
} from "lucide-react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { normalizeCohort } from "@/lib/cohorts";
import { getPortalLessons, type PortalLesson } from "@/lib/portal-lessons";
import { findActiveStudentByEmail } from "@/lib/students";

const quickActions = [
  { label: "인강 보기", icon: PlayCircle, href: "#lectures" },
  { label: "일정 보기", icon: CalendarDays, href: "#schedule" },
  { label: "공지 확인", icon: Bell, href: "#notices" },
];

export const metadata: Metadata = {
  title: "MJU X SEA 엔터 취업 포트폴리오 강의 포털",
};

function todayKeyInSeoul() {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return Number(`${value.year}${value.month}${value.day}`);
}

function getNextLesson(lessons: PortalLesson[], todayKey: number) {
  return lessons.find((lesson) => lesson.dateKey >= todayKey) ?? lessons[lessons.length - 1] ?? null;
}

function addDaysToDateKey(dateKey: number, days: number) {
  const value = String(dateKey);
  const date = new Date(Date.UTC(Number(value.slice(0, 4)), Number(value.slice(4, 6)) - 1, Number(value.slice(6, 8))));
  date.setUTCDate(date.getUTCDate() + days);

  return Number(
    `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}`,
  );
}

function formatDateKey(dateKey: number) {
  const value = String(dateKey);
  return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}`;
}

function getLessonAvailability(lesson: PortalLesson, todayKey: number, previewAll = false) {
  if (lesson.mode !== "인강") {
    return "live" as const;
  }

  if (previewAll) {
    return "open" as const;
  }

  if (todayKey < lesson.dateKey) {
    return "upcoming" as const;
  }

  return todayKey < addDaysToDateKey(lesson.dateKey, 7) ? ("open" as const) : ("closed" as const);
}

export default async function PortalPage() {
  const cookieStore = await cookies();
  const email = cookieStore.get("sea_student_email")?.value;
  const student = email ? await findActiveStudentByEmail(email) : null;

  if (!student) {
    redirect("/login");
  }

  const cohort = normalizeCohort(student.cohort);
  const lessons = getPortalLessons(cohort);
  const todayKey = todayKeyInSeoul();
  const previewAllVideos = student.role === "admin";
  const nextLesson = getNextLesson(lessons, todayKey);
  const nextLessonAvailability = nextLesson ? getLessonAvailability(nextLesson, todayKey, previewAllVideos) : null;
  const videoLessons = lessons.filter((lesson) => lesson.mode === "인강");
  const notices = [
    "인강은 각 기수별 공개일 00:00부터 7일간 시청할 수 있습니다.",
    "공개 7일 후 00:00에 시청이 종료되므로 기간 안에 수강해주세요.",
    "실시간 수업 접속 링크는 수업 전 별도 공지됩니다.",
  ];

  async function logout() {
    "use server";

    const nextCookies = await cookies();
    nextCookies.delete("sea_student_email");
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-ink text-bone">
      <div className="noise" aria-hidden="true" />

      <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-lg">
        <nav className="mx-auto flex h-16 max-w-page items-center justify-between px-[var(--page-x)]" aria-label="수강 포털 메뉴">
          <a href="/" className="brand-logo text-[13px] leading-tight text-bone sm:text-sm">
            MJU X SEA 엔터 취업 포트폴리오 강의 포털
          </a>
          <div className="hidden items-center gap-6 md:flex">
            <a href="#lectures" className="text-xs font-semibold text-muted transition hover:text-bone">
              인강
            </a>
            <a href="#schedule" className="text-xs font-semibold text-muted transition hover:text-bone">
              일정
            </a>
            <a href="#notices" className="text-xs font-semibold text-muted transition hover:text-bone">
              공지
            </a>
          </div>
          <form action={logout}>
            <button className="rounded-lg border border-line px-4 py-2 text-xs font-bold transition hover:border-bone hover:bg-bone hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">
              로그아웃
            </button>
          </form>
        </nav>
      </header>

      <section className="mx-auto grid max-w-page gap-8 px-[var(--page-x)] pb-10 pt-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:pb-16 lg:pt-14">
        <div>
          <p className="mb-4 text-sm font-black text-signal">MJU X SEA 엔터 취업 포트폴리오 강의 포털</p>
          <h1 className="max-w-[760px] text-[clamp(2.1rem,5vw,4.2rem)] font-black leading-[1.1] [word-break:keep-all]">
            공개된 인강과 남은 일정을
            <span className="block text-smoke">한곳에서 확인하세요.</span>
          </h1>
          <p className="mt-5 max-w-read text-base font-medium leading-7 text-smoke">
            {student.name}님, 인강은 각 기수의 공개일부터 7일간 시청할 수 있습니다. 실시간 수업 링크는 수업 전 별도로 안내됩니다.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-line px-5 text-sm font-black transition hover:border-bone hover:bg-bone hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {item.label}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <aside className="border-y border-line py-6 lg:border lg:p-6">
          {nextLesson ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-black text-muted">다음 일정</p>
                <span className="rounded-md bg-signal px-3 py-1 text-xs font-black text-bone">{nextLesson.mode}</span>
              </div>
              <p className="mt-6 text-sm font-black text-signal">{nextLesson.week} · {nextLesson.instructor}</p>
              <h2 className="mt-2 text-3xl font-black leading-tight [word-break:keep-all]">{nextLesson.title}</h2>
              <dl className="mt-6 grid gap-3 text-sm font-semibold text-smoke">
                <div className="flex items-center gap-3">
                  <CalendarDays aria-hidden="true" className="h-4 w-4 text-signal" />
                  <dt className="sr-only">일정</dt>
                  <dd>{nextLesson.date}</dd>
                </div>
                <div className="flex items-center gap-3">
                  <Clock3 aria-hidden="true" className="h-4 w-4 text-signal" />
                  <dt className="sr-only">시간</dt>
                  <dd>{nextLesson.time}</dd>
                </div>
              </dl>
              {nextLessonAvailability === "open" ? (
                <a
                  href={`#lesson-${nextLesson.week}`}
                  className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-bone px-5 text-sm font-black text-ink transition hover:bg-signal hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  인강 바로 보기
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
              ) : (
                <p className="mt-7 border-t border-line pt-4 text-sm font-bold leading-6 text-muted">
                  {nextLessonAvailability === "live"
                    ? "접속 링크는 수업 전 별도 공지됩니다."
                    : nextLessonAvailability === "closed"
                      ? "시청 기간이 종료되었습니다."
                      : `${nextLesson.date} 00:00에 공개됩니다.`}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm font-bold leading-6 text-muted">현재 추가로 예정된 수업이 없습니다.</p>
          )}
        </aside>
      </section>

      <section id="schedule" className="border-y border-line">
        <div className="mx-auto max-w-page px-[var(--page-x)] py-12 lg:py-16">
          <div className="mb-7">
            <h2 className="text-3xl font-black">남은 수업 일정</h2>
            <p className="mt-2 text-sm font-medium text-muted">기수에 맞는 일정만 표시됩니다.</p>
          </div>

          {lessons.length ? (
            <div className="divide-y divide-line border-y border-line">
              {lessons.map((lesson) => {
                const availability = getLessonAvailability(lesson, todayKey, previewAllVideos);

                return (
                  <article key={lesson.week} className="grid gap-4 py-6 md:grid-cols-[110px_minmax(0,1fr)_180px] md:items-center">
                    <div>
                      <p className="text-sm font-black text-signal">{lesson.week}</p>
                      <p className="mt-1 text-xs font-bold text-muted">{lesson.mode}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-black leading-tight [word-break:keep-all]">{lesson.title}</h3>
                      <p className="mt-2 text-sm font-semibold text-smoke">{lesson.instructor}</p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-sm font-black">{lesson.date}</p>
                      <p className="mt-1 text-xs font-semibold text-muted">{lesson.time}</p>
                      {lesson.mode === "인강" ? (
                        <p className={`mt-2 text-xs font-black ${availability === "open" ? "text-signal" : "text-muted"}`}>
                          {availability === "open" ? "시청 가능" : availability === "closed" ? "시청 기간 종료" : "공개 예정"}
                        </p>
                      ) : (
                        <p className="mt-2 text-xs font-black text-signal">실시간 수업</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="border-y border-line py-6 text-sm font-medium text-muted">해당 기수의 남은 수업 일정이 없습니다.</p>
          )}
        </div>
      </section>

      <section id="lectures" className="mx-auto max-w-page px-[var(--page-x)] py-16 lg:py-24">
        <div className="mb-10">
          <div className="flex items-center gap-3 text-signal">
            <Video aria-hidden="true" className="h-5 w-5" />
            <p className="text-sm font-black">온라인 강의</p>
          </div>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3.8rem)] font-black leading-[1.1] [word-break:keep-all]">공개된 강의를 바로 시청하세요.</h2>
        </div>

        {videoLessons.length ? (
          <div className="divide-y divide-line border-y border-line">
            {videoLessons.map((lesson) => {
              const availability = getLessonAvailability(lesson, todayKey, previewAllVideos);
              const closeDateKey = addDaysToDateKey(lesson.dateKey, 7);

              return (
                <article id={`lesson-${lesson.week}`} key={lesson.week} className="scroll-mt-24 py-8 lg:py-10">
                  <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <div>
                      <p className="text-sm font-black text-signal">{lesson.week} · {lesson.instructor}</p>
                      <h3 className="mt-2 text-2xl font-black leading-tight [word-break:keep-all]">{lesson.title}</h3>
                      <p className="mt-3 text-sm font-semibold text-muted">{lesson.date} 00:00 공개</p>
                    </div>

                    {availability === "open" ? (
                      <div className="grid gap-6 xl:grid-cols-2">
                        {lesson.videos?.map((video) => (
                          <div key={video.label}>
                            <div className="aspect-video overflow-hidden border border-line bg-black">
                              <iframe
                                src={video.embedUrl}
                                title={video.label}
                                className="h-full w-full"
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-3">
                              <p className="text-sm font-black">{video.label}</p>
                              <a
                                href={video.watchUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-muted transition hover:text-bone"
                              >
                                YouTube에서 보기
                                <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex min-h-44 items-center gap-4 border border-line px-5 py-6">
                        <LockKeyhole aria-hidden="true" className="h-6 w-6 shrink-0 text-muted" />
                        <div>
                          <p className="font-black">
                            {availability === "closed" ? "시청 기간이 종료된 강의입니다." : "아직 공개되지 않은 강의입니다."}
                          </p>
                          <p className="mt-2 text-sm font-medium text-muted">
                            {availability === "closed"
                              ? `${formatDateKey(closeDateKey)} 00:00에 시청이 종료되었습니다.`
                              : `${lesson.date} 00:00부터 7일간 시청할 수 있습니다.`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="border-y border-line py-6 text-sm font-medium text-muted">현재 이 기수에 공개 예정인 인강이 없습니다.</p>
        )}
      </section>

      <section id="notices" className="mx-auto max-w-page px-[var(--page-x)] pb-16 lg:pb-24">
        <div className="grid gap-8 border-t border-line pt-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="flex items-center gap-3 text-signal">
              <Radio aria-hidden="true" className="h-5 w-5" />
              <p className="text-sm font-black">수업 공지</p>
            </div>
            <h2 className="mt-3 text-3xl font-black leading-tight [word-break:keep-all]">수강 전 확인해주세요.</h2>
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
          <p>MJU x SEA 수강 포털</p>
          <p className="flex items-center gap-2">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-signal" />
            기수별 수업 일정과 인강 제공
          </p>
        </div>
      </footer>
    </main>
  );
}
