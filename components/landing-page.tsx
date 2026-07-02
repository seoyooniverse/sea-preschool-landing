"use client";

import Image from "next/image";
import { ArrowDown, ArrowRight, BadgeCheck, Check, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  academicSchedule,
  curriculum,
  faqs,
  featuredWeeks,
  guarantees,
  heroPoints,
  journey,
  navItems,
  outcomes,
  outputs,
  painPoints,
  proofPoints,
} from "@/lib/content";
import { FadeIn, Reveal } from "@/components/motion";

function CTA({ href = "/apply", children, variant = "primary" }: { href?: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <a
      href={href}
      className={[
        "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
        variant === "primary"
          ? "bg-bone text-ink hover:bg-signal hover:text-bone"
          : "border border-line bg-transparent text-bone hover:border-bone",
      ].join(" ")}
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" />
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-muted">
      <span className="h-px w-8 bg-signal" aria-hidden="true" />
      {children}
    </p>
  );
}

function SectionShell({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-page px-[var(--page-x)] py-16 sm:py-24 lg:py-28 ${className}`}>
      {children}
    </section>
  );
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.28], [0, -90]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0.25]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-bone">
      <div className="noise" aria-hidden="true" />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink/70 backdrop-blur-xl">
        <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-page items-center justify-between px-[var(--page-x)]">
          <a href="#" className="brand-logo text-[13px] leading-tight text-bone sm:text-sm">
            MJU x SEA &apos;엔터 취업 포트폴리오&apos;
          </a>
          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-xs font-semibold text-muted transition hover:text-bone">
                {item.label}
              </a>
            ))}
          </div>
          <a
            href="/apply"
            className="rounded-full border border-line px-4 py-2 text-xs font-bold transition hover:border-bone hover:bg-bone hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            지원하기
          </a>
        </nav>
      </header>

      <section className="relative mx-auto flex min-h-[92svh] max-w-page flex-col justify-end px-[var(--page-x)] pb-12 pt-28 sm:pb-16">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-x-0 top-16 h-[60svh] overflow-hidden opacity-80">
          <Image
            src="/studio-photo.png"
            alt="붉은 스튜디오 조명 아래 놓인 마이크와 콘솔"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/50 to-ink" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_32%,transparent_0,rgba(10,10,10,0.28)_34%,#0a0a0a_78%)]" />
        </motion.div>

        <div className="relative z-10 grid gap-9 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <FadeIn className="max-w-[900px]">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-signal">MJU x SEA</p>
            <h1 className="max-w-[760px] text-[clamp(2.25rem,6.2vw,5.8rem)] font-black leading-[1.14] [word-break:keep-all]">
              <span className="block">엔터 취업 포트폴리오.</span>
              <span className="block text-smoke">팬심을 스펙으로</span>
              <span className="block text-smoke">바꾸는 16주.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.12} className="max-w-read lg:pb-3">
            <p className="max-w-[520px] text-[15px] font-medium leading-7 text-smoke sm:text-lg">
              좋아하는 마음을 취업 언어로 바꾸고, 지원서에서 보여줄 수 있는 결과물로 남깁니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTA>지원하기</CTA>
              <CTA href="#curriculum" variant="secondary">
                커리큘럼 보기
              </CTA>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.22} className="relative z-10 mt-10 grid gap-3 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {heroPoints.map((point) => (
            <p key={point} className="flex items-center gap-2 text-sm font-semibold text-smoke">
              <Check aria-hidden="true" className="h-4 w-4 text-signal" />
              {point}
            </p>
          ))}
        </FadeIn>

        <a href="#problem" aria-label="Scroll to problem" className="absolute bottom-5 right-[var(--page-x)] z-10 hidden rounded-full border border-line p-3 text-muted transition hover:text-bone md:block">
          <ArrowDown aria-hidden="true" className="h-5 w-5" />
        </a>
      </section>

      <SectionShell id="proof" className="border-y border-line">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <SectionLabel>Industry Proof</SectionLabel>
            <h2 className="max-w-[680px] text-[clamp(2rem,4.8vw,4.8rem)] font-black leading-[1.1] [word-break:keep-all]">
              업계가 평가하는 방식으로
            </h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {proofPoints.map((point, index) => (
              <Reveal key={point.title} delay={index * 0.05} className="border-t border-line pt-5">
                <h3 className="text-xl font-black leading-tight">{point.title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-muted">{point.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell id="problem">
        <Reveal className="max-w-[980px]">
          <SectionLabel>Problem</SectionLabel>
          <h2 className="max-w-[760px] text-[clamp(2.15rem,5vw,5rem)] font-black leading-[1.1] [word-break:keep-all]">
            엔터 취업,
            <span className="block text-muted">말보다 보여줄 게 필요합니다.</span>
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-0 border-y border-line lg:grid-cols-3">
          {painPoints.map((point, index) => (
            <Reveal key={point.label} delay={index * 0.08} className="border-line py-7 lg:border-r lg:px-7 lg:last:border-r-0">
              <p className="mb-6 text-xs font-black text-signal">{point.label}</p>
              <h3 className="text-xl font-black">{point.title}</h3>
              <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-muted">{point.body}</p>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <Reveal>
            <SectionLabel>Solution</SectionLabel>
            <h2 className="text-[clamp(2.1rem,5vw,5rem)] font-black leading-[1.1] [word-break:keep-all]">
              강의가 아니라
              <span className="block text-signal">프로젝트.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-read">
            <p className="text-base font-medium leading-7 text-smoke sm:text-lg sm:leading-8">
              하나의 아티스트를 정하고, 시장·브랜드·사운드·비주얼·마케팅을 하나의 흐름으로 설계합니다.
            </p>
            <p className="mt-5 text-xl font-black leading-snug">
              마지막에는 “제가 만든 결과물입니다”라고 보여줄 수 있어야 하니까.
            </p>
          </Reveal>
          <Reveal delay={0.16} className="relative min-h-[260px] overflow-hidden border border-line sm:min-h-[360px] lg:min-h-[460px]">
            <Image
              src="/planning-photo.png"
              alt="아티스트 콘셉트 기획 자료를 정리하는 제작 미팅 장면"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell id="portfolio" className="border-y border-line">
        <Reveal>
          <SectionLabel>Outcome</SectionLabel>
          <h2 className="max-w-[700px] text-[clamp(2.05rem,5vw,5rem)] font-black leading-[1.1] [word-break:keep-all]">
            취업 준비가 달라지는 이유
          </h2>
        </Reveal>
        <div className="mt-10 divide-y divide-line">
          {outcomes.map((item, index) => (
            <Reveal key={item.number} delay={index * 0.05} className="grid gap-3 py-5 md:grid-cols-[80px_1fr_0.9fr] md:items-baseline">
              <p className="text-xs font-black text-signal">{item.number}</p>
              <h3 className="text-xl font-black leading-tight md:text-3xl">{item.title}</h3>
              <p className="max-w-md text-sm font-medium leading-6 text-muted">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="journey">
        <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal>
            <SectionLabel>Portfolio Journey</SectionLabel>
            <h2 className="text-[clamp(2rem,4.8vw,4.8rem)] font-black leading-[1.1] [word-break:keep-all]">
              팬심은 이렇게 <span className="text-signal">실무 언어</span>가 됩니다.
            </h2>
          </Reveal>
          <div className="space-y-3">
            {journey.map((item, index) => (
              <Reveal key={item.phase} delay={index * 0.04} className="grid gap-4 border-t border-line py-7 sm:grid-cols-[112px_1fr]">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-signal">{item.phase}</p>
                <div>
                  <h3 className="text-2xl font-black">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-muted">{item.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell>
        <Reveal>
          <SectionLabel>Outputs</SectionLabel>
          <h2 className="max-w-[680px] text-[clamp(1.75rem,3.8vw,4rem)] font-black leading-[1.16] [word-break:keep-all]">
            매주 결과물이 쌓입니다.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-3">
          {outputs.slice(0, 7).map((output) => (
            <span key={output} className="rounded-full border border-line px-4 py-2.5 text-sm font-bold text-smoke">
              {output}
            </span>
          ))}
        </Reveal>
      </SectionShell>

      <SectionShell id="experience" className="relative overflow-hidden border-y border-line">
        <div className="absolute inset-0 opacity-25" aria-hidden="true">
          <Image src="/cinematic-studio.png" alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-ink/70" />
        </div>
        <div className="relative grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <Reveal>
            <SectionLabel>Experience</SectionLabel>
            <h2 className="text-[clamp(2.05rem,5vw,5rem)] font-black leading-[1.1] [word-break:keep-all]">
              <span className="block">화면 밖의</span>
              <span className="block">현장을 봅니다.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base font-medium leading-7 text-smoke sm:text-lg sm:leading-8">
              엠피아 스튜디오, 프로젝트 미팅, 현업 피드백까지.
            </p>
            <div className="mt-9 grid gap-3 text-sm font-black uppercase tracking-[0.16em] text-bone">
              <span>ONLINE x OFFLINE</span>
              <span>이론 x 실습</span>
              <span>기획 x 실행</span>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell>
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionLabel>Difference</SectionLabel>
            <h2 className="text-[clamp(2.2rem,5vw,5rem)] font-black leading-[1.08]">왜 혹할 만한가</h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-8">
            <div className="border-t border-line pt-7">
              <p className="text-sm font-bold text-muted">일반 강의</p>
              <p className="mt-3 text-2xl font-black text-muted">듣는다 → 금방 흐려진다</p>
            </div>
            <div className="border-t border-signal pt-7">
              <p className="text-sm font-bold text-signal">MJU x SEA</p>
              <p className="mt-3 text-2xl font-black">기획한다 → 만든다 → 나를 보여준다</p>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell id="curriculum" className="border-y border-line">
        <Reveal>
          <SectionLabel>Curriculum</SectionLabel>
          <h2 className="max-w-[620px] text-[clamp(1.38rem,6.2vw,3.7rem)] font-black leading-[1.2] [word-break:keep-all] sm:text-[clamp(1.65rem,3.5vw,3.7rem)]">
            <span className="block whitespace-nowrap">시장 분석부터 발표까지,</span>
            <span className="block whitespace-nowrap">
              <span className="text-signal">하나의 프로젝트</span>로.
            </span>
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-x-10 gap-y-0 md:grid-cols-2">
          {curriculum.slice(0, 8).map((item, index) => (
            <Reveal key={item} delay={(index % 4) * 0.03} className="flex gap-5 border-t border-line py-4">
              <span className="w-10 shrink-0 text-sm font-black text-signal">{String(index + 1).padStart(2, "0")}</span>
              <p className="text-base font-black leading-snug">{item}</p>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <SectionLabel>Credential</SectionLabel>
            <h2 className="text-[clamp(2rem,4.8vw,4.8rem)] font-black leading-[1.1] [word-break:keep-all]">
              내 결과에 공식 인증을 더합니다.
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="border-y border-line py-10">
            <BadgeCheck aria-hidden="true" className="mb-8 h-12 w-12 text-signal" />
            <p className="text-base font-medium leading-7 text-smoke sm:text-lg sm:leading-8">
              수료생 전원에게 명지대학교 미래융합대학 공식 수료증과 디지털 배지가 발급됩니다.
              4년제 정규학과 편입 개런티 및 가산점 반영 트랙까지 함께 안내됩니다.
            </p>
            <p className="mt-5 text-sm font-semibold leading-6 text-muted">
              우수 기획서 선정자 3~5명에게는 현직 기획사 A&R 팀장급 대면 피드백 기회가 제공됩니다.
            </p>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell id="schedule" className="border-y border-line">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <SectionLabel>Schedule</SectionLabel>
            <h2 className="text-[clamp(2rem,4.8vw,4.8rem)] font-black leading-[1.1] [word-break:keep-all]">
              2026년 1기 학사일정
            </h2>
          </Reveal>
          <div>
            <div className="divide-y divide-line border-y border-line">
              {academicSchedule.map((item, index) => (
                <Reveal key={item.label} delay={index * 0.04} className="grid gap-2 py-5 sm:grid-cols-[140px_1fr]">
                  <p className="text-sm font-black text-signal">{item.label}</p>
                  <p className="text-lg font-black leading-snug text-smoke">{item.value}</p>
                </Reveal>
              ))}
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {featuredWeeks.map((item, index) => (
                <Reveal key={item.week} delay={index * 0.05} className="border border-line p-5">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-signal">{item.week}</p>
                  <h3 className="mt-4 text-xl font-black leading-tight">{item.title}</h3>
                  <p className="mt-4 text-sm font-semibold text-muted">{item.date} · {item.type}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="price" className="border-y border-line">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <SectionLabel>Guarantee & Price</SectionLabel>
            <h2 className="text-[clamp(2rem,4.8vw,4.8rem)] font-black leading-[1.1] [word-break:keep-all]">
              <span className="block">
                가격은 <span className="text-signal">가볍게,</span>
              </span>
              <span className="block">
                혜택은 <span className="text-signal">확실하게.</span>
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="border-y border-line py-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-signal">Course Fee</p>
              <p className="mt-3 text-[clamp(2.8rem,8vw,6.5rem)] font-black leading-none">월 15만원</p>
              <p className="mt-3 text-lg font-black text-smoke">4개월 과정</p>
              <p className="mt-4 text-sm font-medium leading-6 text-muted">
                현장체험, 피드백, 수료 인증, 편입 트랙까지 포함한 월 수강료입니다.
              </p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {guarantees.map((item) => (
                <p key={item} className="flex gap-3 border-t border-line pt-4 text-sm font-semibold leading-6 text-smoke">
                  <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-signal" />
                  {item}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell id="faq" className="border-y border-line">
        <Reveal>
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-[clamp(2.2rem,5vw,5rem)] font-black leading-[1.08]">마지막 확인</h2>
        </Reveal>
        <div className="mt-12 divide-y divide-line">
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 0.05} className="grid gap-4 py-8 lg:grid-cols-[0.75fr_1fr]">
              <h3 className="text-xl font-black">{faq.question}</h3>
              <p className="max-w-read text-base font-medium leading-7 text-muted">{faq.answer}</p>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="apply" className="min-h-[70svh] content-center">
        <Reveal className="mx-auto max-w-[1120px] text-center">
          <p className="mb-7 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-signal">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Apply
          </p>
          <h2 className="mx-auto max-w-[700px] text-[clamp(2.1rem,5.2vw,5rem)] font-black leading-[1.14] [word-break:keep-all]">
            <span className="block">16주 뒤,</span>
            <span className="block">“엔터 좋아해요”가 아니라</span>
            <span className="block text-smoke">“제가 만들었습니다.”</span>
          </h2>
          <p className="mx-auto mt-7 max-w-[560px] text-base font-medium leading-7 text-muted">
            관심을 결과물로 바꾸는 첫 번째 프로젝트.
          </p>
          <div className="mt-10 flex justify-center">
            <CTA>지원하기</CTA>
          </div>
        </Reveal>
      </SectionShell>

      <footer className="mx-auto flex max-w-page flex-col gap-4 border-t border-line px-[var(--page-x)] py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold text-bone">MJU x SEA Entertainment Portfolio Program</p>
        <p>From consumer to creator.</p>
      </footer>
    </main>
  );
}
