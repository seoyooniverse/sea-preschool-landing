"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn, Mail } from "lucide-react";

type SubmitState = "idle" | "submitting" | "error";

export default function LoginPage() {
  const router = useRouter();
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.get("email") }),
    });
    const result = await response.json();

    if (!response.ok) {
      setState("error");
      setMessage(result.message ?? "로그인 중 문제가 발생했습니다.");
      return;
    }

    router.push(result.redirectTo ?? "/portal");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-ink px-[var(--page-x)] py-8 text-bone">
      <div className="noise" aria-hidden="true" />
      <div className="mx-auto max-w-content">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-bone">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          첫페이지 돌아가기
        </Link>

        <section className="grid gap-12 py-12 lg:grid-cols-[0.82fr_1.18fr] lg:py-20">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-signal">
              <span className="h-px w-8 bg-signal" aria-hidden="true" />
              Student Login
            </p>
            <h1 className="text-[clamp(2.4rem,7vw,6rem)] font-black leading-[1.08] [word-break:keep-all]">
              등록된 이메일로
              <span className="block text-smoke">포털에 입장합니다.</span>
            </h1>
            <p className="mt-6 max-w-[560px] text-base font-medium leading-7 text-muted">
              지원서 제출 후 운영팀이 수강생으로 승인한 이메일만 로그인할 수 있습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="self-start border-y border-line py-8">
            <label>
              <span className="mb-3 block text-sm font-black text-smoke">수강생 이메일</span>
              <span className="flex min-h-14 items-center gap-3 border border-line px-4 transition focus-within:border-bone">
                <Mail aria-hidden="true" className="h-5 w-5 text-signal" />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@email.com"
                  className="min-w-0 flex-1 bg-transparent text-base text-bone outline-none placeholder:text-muted"
                />
              </span>
            </label>

            {message ? <p className="mt-5 text-sm font-bold leading-6 text-signal">{message}</p> : null}

            <button
              type="submit"
              disabled={state === "submitting"}
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-bone px-7 text-sm font-black text-ink transition hover:bg-signal hover:text-bone disabled:cursor-not-allowed disabled:opacity-60"
            >
              {state === "submitting" ? "확인 중" : "포털 입장"}
              <LogIn aria-hidden="true" className="h-4 w-4" />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
