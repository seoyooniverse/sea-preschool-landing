"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { bankInfo } from "@/lib/program";

type SubmitState = "idle" | "submitting" | "error";

export default function ApplyPage() {
  const router = useRouter();
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        agreed: data.get("agreed") === "on",
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      setState("error");
      setMessage(result.message ?? "접수 중 문제가 발생했습니다.");
      return;
    }

    router.push(`/apply/complete?id=${result.id}`);
  }

  const inputClass =
    "w-full border border-line bg-transparent px-4 py-3 text-base text-bone outline-none transition placeholder:text-muted focus:border-bone";
  const labelClass = "mb-2 block text-sm font-black text-smoke";

  return (
    <main className="min-h-screen bg-ink px-[var(--page-x)] py-8 text-bone">
      <div className="mx-auto max-w-content">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-bone">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          첫페이지 돌아가기
        </Link>

        <section className="grid gap-12 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.18em] text-signal">Application</p>
            <h1 className="text-[clamp(2.4rem,7vw,6.2rem)] font-black leading-[1.08] [word-break:keep-all]">
              과정 신청서
              <span className="block text-smoke">MJU x SEA</span>
            </h1>
            <p className="mt-6 max-w-[520px] text-base font-medium leading-7 text-muted">
              기본 정보를 남겨주시면 운영팀이 신청 내용을 확인합니다. 수강료 입금 확인 후 최종 등록이 완료됩니다.
            </p>

            <div className="mt-10 border-y border-line py-7">
              <p className="text-sm font-black text-signal">수강료 안내</p>
              <dl className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">금액</dt>
                  <dd className="font-black">{bankInfo.amount}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">은행</dt>
                  <dd className="font-black">{bankInfo.bank}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">계좌</dt>
                  <dd className="font-black">{bankInfo.account}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">예금주</dt>
                  <dd className="font-black">{bankInfo.holder}</dd>
                </div>
              </dl>
              <p className="mt-5 text-xs font-medium leading-5 text-muted">
                입금자명은 신청자명과 동일하게 입력해주세요. 확인이 필요한 경우 운영팀에서 개별 연락드립니다.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border-y border-line py-2">
            <div className="grid gap-5 py-6 sm:grid-cols-2">
              <label>
                <span className={labelClass}>이름 *</span>
                <input className={inputClass} name="name" autoComplete="name" required placeholder="홍길동" />
              </label>
              <label>
                <span className={labelClass}>연락처 *</span>
                <input className={inputClass} name="phone" autoComplete="tel" required placeholder="010-0000-0000" />
              </label>
              <label>
                <span className={labelClass}>이메일 *</span>
                <input className={inputClass} name="email" type="email" autoComplete="email" required placeholder="you@email.com" />
              </label>
              <label>
                <span className={labelClass}>현재 상태 *</span>
                <select className={inputClass} name="status" required defaultValue="">
                  <option value="" disabled>
                    선택
                  </option>
                  <option>대학생</option>
                  <option>휴학생</option>
                  <option>졸업예정자</option>
                  <option>취업준비생</option>
                  <option>편입 준비생</option>
                  <option>기타</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>학교</span>
                <input className={inputClass} name="school" placeholder="선택 입력" />
              </label>
              <label>
                <span className={labelClass}>전공</span>
                <input className={inputClass} name="major" placeholder="선택 입력" />
              </label>
              <label>
                <span className={labelClass}>관심 직무 *</span>
                <select className={inputClass} name="interest" required defaultValue="">
                  <option value="" disabled>
                    선택
                  </option>
                  <option>A&R</option>
                  <option>마케팅</option>
                  <option>아티스트 기획</option>
                  <option>콘텐츠/비주얼</option>
                  <option>유통/저작권</option>
                  <option>아직 고민 중</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>입금자명 *</span>
                <input className={inputClass} name="depositor" required placeholder="지원자명과 동일 권장" />
              </label>
            </div>

            <div className="grid gap-5 py-6">
              <label>
                <span className={labelClass}>이번 과정을 통해 얻고 싶은 것 *</span>
                <textarea className={`${inputClass} min-h-28 resize-y`} name="goal" required placeholder="예: 엔터 회사에 제출할 작업물을 만들고 싶어요." />
              </label>
              <label>
                <span className={labelClass}>지원 동기 *</span>
                <textarea className={`${inputClass} min-h-32 resize-y`} name="motivation" required placeholder="관심 아티스트, 희망 직무, 준비 중인 목표 등을 적어주세요." />
              </label>
              <label>
                <span className={labelClass}>알게 된 경로</span>
                <input className={inputClass} name="referral" placeholder="인스타그램, 지인 추천, 학교 안내 등" />
              </label>
            </div>

            <label className="flex gap-3 border-t border-line py-6 text-sm font-medium leading-6 text-smoke">
              <input name="agreed" type="checkbox" required className="mt-1 h-4 w-4 accent-signal" />
              지원 접수 및 입금 확인을 위해 개인정보를 수집·이용하는 것에 동의합니다.
            </label>

            {message ? (
              <p className="mb-5 flex gap-2 text-sm font-bold text-signal">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={state === "submitting"}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-bone px-7 text-sm font-black text-ink transition hover:bg-signal hover:text-bone disabled:cursor-not-allowed disabled:opacity-60"
            >
              {state === "submitting" ? "접수 중" : "지원서 제출하기"}
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
