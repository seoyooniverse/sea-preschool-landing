import { readApplications } from "@/lib/applications";
import { cohortOptions, normalizeCohort } from "@/lib/cohorts";
import { createPortalVideo, formatLessonDate, getPortalLessons, savePortalLesson, type PortalLesson } from "@/lib/portal-lessons";
import { PORTAL_PREVIEW_EMAIL, enrollStudentFromApplication, normalizeEmail, readStudents } from "@/lib/students";
import { readSubmissions } from "@/lib/submissions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type AdminPageProps = {
  searchParams: Promise<{ error?: string; key?: string; saved?: string }>;
};

function dateInputValue(dateKey: number) {
  const value = String(dateKey);
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

async function approveStudent(formData: FormData) {
  "use server";

  const key = String(formData.get("key") ?? "").trim();
  const applicationId = String(formData.get("applicationId") ?? "");
  const adminKey = (process.env.ADMIN_KEY ?? "sea2026").trim();

  if (key !== adminKey || !applicationId) {
    redirect("/admin");
  }

  const applications = await readApplications();
  const application = applications.find((item) => item.id === applicationId);

  if (application) {
    try {
      await enrollStudentFromApplication(application);
    } catch (error) {
      console.error(error);
      redirect(`/admin?key=${encodeURIComponent(key)}&error=approval`);
    }

  }

  redirect(`/admin?key=${encodeURIComponent(key)}`);
}

async function openPortalPreview(formData: FormData) {
  "use server";

  const key = String(formData.get("key") ?? "").trim();
  const adminKey = (process.env.ADMIN_KEY ?? "sea2026").trim();

  if (key !== adminKey) {
    redirect("/admin");
  }

  const cohort = normalizeCohort(String(formData.get("cohort") ?? ""));
  if (!cohortOptions.includes(cohort)) {
    redirect(`/admin?key=${encodeURIComponent(key)}&error=preview`);
  }

  const cookieStore = await cookies();
  cookieStore.set("sea_student_email", PORTAL_PREVIEW_EMAIL, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 2,
  });
  cookieStore.set("sea_preview_cohort", cohort, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 2,
  });

  redirect("/portal");
}

async function updatePortalLesson(formData: FormData) {
  "use server";

  const key = String(formData.get("key") ?? "").trim();
  const adminKey = (process.env.ADMIN_KEY ?? "sea2026").trim();

  if (key !== adminKey) {
    redirect("/admin");
  }

  const cohort = normalizeCohort(String(formData.get("cohort") ?? ""));
  const week = String(formData.get("week") ?? "").trim();
  const dateValue = String(formData.get("date") ?? "").replace(/\D/g, "");
  const dateKey = Number(dateValue);
  const mode = String(formData.get("mode") ?? "") === "실시간" ? "실시간" : "인강";
  const title = String(formData.get("title") ?? "").trim();
  const instructor = String(formData.get("instructor") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();

  if (!cohortOptions.includes(cohort) || !week || dateValue.length !== 8 || !title || !instructor || !time) {
    redirect(`/admin?key=${encodeURIComponent(key)}&error=lesson-input`);
  }

  try {
    const videoUrls = [String(formData.get("video1") ?? "").trim(), String(formData.get("video2") ?? "").trim()].filter(Boolean);
    if (mode === "인강" && videoUrls.length === 0) {
      throw new Error("온라인 강의에는 YouTube 링크가 필요합니다.");
    }
    const videos = mode === "인강" ? videoUrls.map((url, index) => createPortalVideo(`${week} ${index + 1}교시`, url)) : undefined;
    const lesson: PortalLesson = {
      week,
      date: formatLessonDate(dateKey),
      dateKey,
      time,
      mode,
      instructor,
      title,
      videos,
    };

    await savePortalLesson(cohort, lesson);
  } catch (error) {
    console.error(error);
    redirect(`/admin?key=${encodeURIComponent(key)}&error=lesson-save`);
  }

  redirect(`/admin?key=${encodeURIComponent(key)}&saved=${encodeURIComponent(`${cohort} ${week}`)}`);
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const adminKey = (process.env.ADMIN_KEY ?? "sea2026").trim();
  const enteredKey = String(params.key ?? "").trim();
  const authorized = enteredKey === adminKey;
  let dataError = false;
  let applications: Awaited<ReturnType<typeof readApplications>> = [];
  let students: Awaited<ReturnType<typeof readStudents>> = [];
  let submissions: Awaited<ReturnType<typeof readSubmissions>> = [];
  let lessonGroups: Array<{ cohort: string; lessons: PortalLesson[] }> = [];

  if (authorized) {
    try {
      applications = await readApplications();
      students = await readStudents();
      submissions = await readSubmissions();
      lessonGroups = await Promise.all(
        cohortOptions.map(async (cohort) => ({ cohort, lessons: await getPortalLessons(cohort) })),
      );
    } catch (error) {
      console.error(error);
      dataError = true;
    }
  }

  const activeStudentEmails = new Set(students.filter((student) => student.status === "active").map((student) => normalizeEmail(student.email)));

  return (
    <main className="min-h-screen bg-ink px-[var(--page-x)] py-10 text-bone">
      <div className="mx-auto max-w-content">
        <p className="mb-5 text-xs font-black uppercase tracking-[0.18em] text-signal">Admin</p>
        <h1 className="text-[clamp(2.4rem,7vw,5.8rem)] font-black leading-[1.08]">지원자 확인</h1>

        {!authorized ? (
          <section className="mt-10 max-w-lg border-y border-line py-8">
            <p className="text-base font-medium leading-7 text-muted">관리자 키를 입력하면 접수 내역을 볼 수 있습니다.</p>
            <form className="mt-6 flex gap-3">
              <input
                name="key"
                type="password"
                className="min-h-12 flex-1 border border-line bg-transparent px-4 text-bone outline-none focus:border-bone"
                placeholder="관리자 키"
              />
              <button className="rounded-full bg-bone px-6 text-sm font-black text-ink">확인</button>
            </form>
            <p className="mt-4 text-xs text-muted">기본 키는 임시값입니다. 배포 전 `ADMIN_KEY` 환경변수로 변경하세요.</p>
          </section>
        ) : (
          <section className="mt-10">
            {dataError ? (
              <div className="mb-6 border border-signal/40 bg-signal/10 p-4 text-sm font-bold leading-6 text-smoke">
                Supabase 연결을 확인해야 합니다. 환경변수와 `applications` 테이블 생성 여부를 확인해주세요.
              </div>
            ) : null}
            {params.error === "approval" ? (
              <div className="mb-6 border border-signal/40 bg-signal/10 p-4 text-sm font-bold leading-6 text-smoke">
                승인 저장에 실패했습니다. Supabase에 `students` 테이블이 만들어져 있는지 확인해주세요.
              </div>
            ) : null}
            {params.error === "lesson-save" ? (
              <div className="mb-6 border border-signal/40 bg-signal/10 p-4 text-sm font-bold leading-6 text-smoke">
                강의 저장에 실패했습니다. Supabase에 `portal_lessons` 테이블을 생성했는지 확인해주세요.
              </div>
            ) : null}
            {params.error === "lesson-input" ? (
              <div className="mb-6 border border-signal/40 bg-signal/10 p-4 text-sm font-bold leading-6 text-smoke">
                강의 정보를 모두 정확하게 입력해주세요. 인강에는 올바른 YouTube 링크가 필요합니다.
              </div>
            ) : null}
            {params.saved ? (
              <div className="mb-6 border border-bone/20 bg-bone/10 p-4 text-sm font-bold leading-6 text-smoke">
                {params.saved} 강의 정보를 저장했습니다.
              </div>
            ) : null}
            <div className="mb-6 flex flex-col gap-4 border-y border-line py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2 text-sm font-bold text-muted sm:flex-row sm:gap-6">
                <p>총 {applications.length}건 접수</p>
                <p>포털 로그인 가능 수강생 {students.length}명</p>
              </div>
              <form action={openPortalPreview} className="flex flex-col gap-2 sm:flex-row">
                <input type="hidden" name="key" value={enteredKey} />
                <select
                  name="cohort"
                  defaultValue={cohortOptions[0]}
                  className="min-h-11 rounded-lg border border-line bg-ink px-3 text-sm font-bold text-bone outline-none focus:border-bone"
                >
                  {cohortOptions.map((cohort) => (
                    <option key={cohort} value={cohort} className="bg-ink text-bone">
                      {cohort}
                    </option>
                  ))}
                </select>
                <button className="inline-flex min-h-11 items-center justify-center rounded-lg bg-bone px-5 text-sm font-black text-ink transition hover:bg-signal hover:text-bone">
                  강의 포털 테스트
                </button>
              </form>
            </div>
            <section className="mb-16">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-signal">Lecture Manager</p>
                <h2 className="mt-2 text-3xl font-black">강의 관리</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-muted">
                  저장한 내용은 해당 기수 학생 포털에 바로 반영됩니다. 인강은 공개일부터 7일간 열립니다.
                </p>
              </div>

              <div className="divide-y divide-line border-y border-line">
                {lessonGroups.map(({ cohort, lessons }) => (
                  <details key={cohort} className="group py-5" open={cohort === cohortOptions[0]}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xl font-black">
                      {cohort}
                      <span className="text-sm text-muted transition group-open:rotate-45">+</span>
                    </summary>
                    <div className="mt-6 divide-y divide-line border-t border-line">
                      {lessons.map((lesson) => (
                        <form key={lesson.week} action={updatePortalLesson} className="grid gap-5 py-7">
                          <input type="hidden" name="key" value={enteredKey} />
                          <input type="hidden" name="cohort" value={cohort} />
                          <input type="hidden" name="week" value={lesson.week} />

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-black text-signal">{lesson.week}</p>
                              <p className="mt-1 text-xs font-semibold text-muted">현재 {lesson.date} · {lesson.mode}</p>
                            </div>
                            <button className="min-h-10 rounded-lg border border-line px-5 text-xs font-black transition hover:border-bone hover:bg-bone hover:text-ink">
                              저장
                            </button>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <label className="grid gap-2 lg:col-span-2">
                              <span className="text-xs font-black text-muted">강의명</span>
                              <input name="title" defaultValue={lesson.title} required className="min-h-11 border border-line bg-transparent px-3 text-sm font-semibold outline-none focus:border-bone" />
                            </label>
                            <label className="grid gap-2">
                              <span className="text-xs font-black text-muted">강사</span>
                              <input name="instructor" defaultValue={lesson.instructor} required className="min-h-11 border border-line bg-transparent px-3 text-sm font-semibold outline-none focus:border-bone" />
                            </label>
                            <label className="grid gap-2">
                              <span className="text-xs font-black text-muted">진행 방식</span>
                              <select name="mode" defaultValue={lesson.mode} className="min-h-11 border border-line bg-ink px-3 text-sm font-semibold outline-none focus:border-bone">
                                <option value="인강">인강</option>
                                <option value="실시간">실시간</option>
                              </select>
                            </label>
                            <label className="grid gap-2">
                              <span className="text-xs font-black text-muted">날짜</span>
                              <input name="date" type="date" defaultValue={dateInputValue(lesson.dateKey)} required className="min-h-11 border border-line bg-transparent px-3 text-sm font-semibold outline-none focus:border-bone" />
                            </label>
                            <label className="grid gap-2">
                              <span className="text-xs font-black text-muted">시간 또는 공개 문구</span>
                              <input name="time" defaultValue={lesson.time} required className="min-h-11 border border-line bg-transparent px-3 text-sm font-semibold outline-none focus:border-bone" />
                            </label>
                            <label className="grid gap-2 lg:col-span-2">
                              <span className="text-xs font-black text-muted">YouTube 1교시</span>
                              <input name="video1" type="url" defaultValue={lesson.videos?.[0]?.watchUrl ?? ""} placeholder="https://youtu.be/..." className="min-h-11 border border-line bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-muted focus:border-bone" />
                            </label>
                            <label className="grid gap-2 lg:col-span-2">
                              <span className="text-xs font-black text-muted">YouTube 2교시</span>
                              <input name="video2" type="url" defaultValue={lesson.videos?.[1]?.watchUrl ?? ""} placeholder="https://youtu.be/..." className="min-h-11 border border-line bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-muted focus:border-bone" />
                            </label>
                          </div>
                        </form>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-black">과제 제출물</h2>
              <div className="mt-5 divide-y divide-line border-y border-line">
                {submissions.length === 0 ? (
                  <p className="py-6 text-sm font-medium text-muted">아직 제출된 과제가 없습니다.</p>
                ) : (
                  submissions.map((submission) => (
                    <article key={submission.id} className="grid gap-4 py-5 lg:grid-cols-[0.8fr_1.2fr_150px] lg:items-center">
                      <div>
                        <p className="text-xs font-black text-signal">{submission.cohort}</p>
                        <h3 className="mt-2 text-xl font-black leading-tight [word-break:keep-all]">{submission.assignmentTitle}</h3>
                        <p className="mt-2 text-xs font-semibold text-muted">{new Date(submission.createdAt).toLocaleString("ko-KR")}</p>
                      </div>
                      <div className="text-sm font-medium leading-6 text-smoke">
                        <p>
                          <span className="font-black text-bone">{submission.studentName}</span> · {submission.studentEmail}
                        </p>
                        <p className="text-muted">{submission.originalFilename}</p>
                        {submission.comment ? <p className="mt-2">{submission.comment}</p> : null}
                      </div>
                      <a
                        href={`/api/submissions/${submission.id}/download?key=${encodeURIComponent(enteredKey)}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 text-sm font-black transition hover:border-bone hover:bg-bone hover:text-ink"
                      >
                        다운로드
                      </a>
                    </article>
                  ))
                )}
              </div>
            </section>
            <div className="divide-y divide-line border-y border-line">
              {applications.length === 0 ? (
                <p className="py-8 text-muted">아직 접수된 지원서가 없습니다.</p>
              ) : (
                applications.map((item) => {
                  const approved = activeStudentEmails.has(normalizeEmail(item.email));

                  return (
                    <article key={item.id} className="grid gap-5 py-7 lg:grid-cols-[0.8fr_1.2fr]">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-black">{item.name}</h2>
                          <span className={`rounded-full border px-3 py-1 text-xs font-black ${approved ? "border-bone/20 bg-bone text-ink" : "border-signal/40 bg-signal/10 text-signal"}`}>
                            {approved ? "수강생 승인됨" : "승인 대기"}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-black text-signal">{normalizeCohort(item.cohort)}</p>
                        <p className="mt-1 text-xs font-semibold text-muted">{new Date(item.createdAt).toLocaleString("ko-KR")}</p>
                        <dl className="mt-5 grid gap-2 text-sm text-smoke">
                          <div>
                            <dt className="text-muted">연락처</dt>
                            <dd>{item.phone}</dd>
                          </div>
                          <div>
                            <dt className="text-muted">이메일</dt>
                            <dd>{item.email}</dd>
                          </div>
                          <div>
                            <dt className="text-muted">입금자명</dt>
                            <dd>{item.depositor}</dd>
                          </div>
                        </dl>
                        <form action={approveStudent} className="mt-5">
                          <input type="hidden" name="key" value={enteredKey} />
                          <input type="hidden" name="applicationId" value={item.id} />
                          <button
                            disabled={approved}
                            className="rounded-full border border-line px-5 py-2 text-xs font-black transition hover:border-bone hover:bg-bone hover:text-ink disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            {approved ? "승인 완료" : "입금 확인 후 승인"}
                          </button>
                        </form>
                      </div>
                      <div className="grid gap-4 text-sm leading-6 text-smoke">
                        <p>
                          <span className="font-black text-bone">상태</span> {item.status} · {item.school || "학교 미입력"} · {item.major || "전공 미입력"}
                        </p>
                        <p>
                          <span className="font-black text-bone">관심 직무</span> {item.interest}
                        </p>
                        <p>
                          <span className="font-black text-bone">얻고 싶은 것</span>
                          <br />
                          {item.goal}
                        </p>
                        <p>
                          <span className="font-black text-bone">지원 동기</span>
                          <br />
                          {item.motivation}
                        </p>
                        {item.referral ? (
                          <p>
                            <span className="font-black text-bone">유입 경로</span> {item.referral}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
