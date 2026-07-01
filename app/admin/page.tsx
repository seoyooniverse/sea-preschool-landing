import { readApplications } from "@/lib/applications";

type AdminPageProps = {
  searchParams: Promise<{ key?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const adminKey = process.env.ADMIN_KEY ?? "sea2026";
  const authorized = params.key === adminKey;
  const applications = authorized ? await readApplications() : [];

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
            <p className="mb-6 text-sm font-bold text-muted">총 {applications.length}건 접수</p>
            <div className="divide-y divide-line border-y border-line">
              {applications.length === 0 ? (
                <p className="py-8 text-muted">아직 접수된 지원서가 없습니다.</p>
              ) : (
                applications.map((item) => (
                  <article key={item.id} className="grid gap-5 py-7 lg:grid-cols-[0.8fr_1.2fr]">
                    <div>
                      <h2 className="text-2xl font-black">{item.name}</h2>
                      <p className="mt-2 text-sm font-semibold text-signal">{new Date(item.createdAt).toLocaleString("ko-KR")}</p>
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
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
