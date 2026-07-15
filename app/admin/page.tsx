import { readApplications } from "@/lib/applications";
import { enrollStudentFromApplication, normalizeEmail, readStudents } from "@/lib/students";
import { redirect } from "next/navigation";

type AdminPageProps = {
  searchParams: Promise<{ key?: string }>;
};

async function approveStudent(formData: FormData) {
  "use server";

  const key = String(formData.get("key") ?? "");
  const applicationId = String(formData.get("applicationId") ?? "");
  const adminKey = process.env.ADMIN_KEY ?? "sea2026";

  if (key !== adminKey || !applicationId) {
    redirect("/admin");
  }

  const applications = await readApplications();
  const application = applications.find((item) => item.id === applicationId);

  if (application) {
    await enrollStudentFromApplication(application);
  }

  redirect(`/admin?key=${encodeURIComponent(key)}`);
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const adminKey = process.env.ADMIN_KEY ?? "sea2026";
  const authorized = params.key === adminKey;
  const applications = authorized ? await readApplications() : [];
  const students = authorized ? await readStudents() : [];
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
            <div className="mb-6 flex flex-col gap-2 text-sm font-bold text-muted sm:flex-row sm:items-center sm:justify-between">
              <p>총 {applications.length}건 접수</p>
              <p>포털 로그인 가능 수강생 {students.length}명</p>
            </div>
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
                        <p className="mt-2 text-sm font-black text-signal">{item.cohort || "기수 미지정"}</p>
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
                          <input type="hidden" name="key" value={params.key ?? ""} />
                          <input type="hidden" name="applicationId" value={item.id} />
                          <button
                            disabled={approved}
                            className="rounded-full border border-line px-5 py-2 text-xs font-black transition hover:border-bone hover:bg-bone hover:text-ink disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            {approved ? "로그인 허용됨" : "수강생으로 승인"}
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
