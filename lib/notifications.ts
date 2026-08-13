import crypto from "crypto";
import type { Application } from "@/lib/applications";
import { bankInfo, programInfo } from "@/lib/program";
import { getProgramPricing } from "@/lib/pricing";

const SOLAPI_ENDPOINT = "https://api.solapi.com/messages/v4/send";

type SolapiConfig = {
  apiKey: string;
  apiSecret: string;
  from: string;
  adminTo: string;
};

function getSolapiConfig() {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const from = process.env.SOLAPI_FROM;

  if (!apiKey || !apiSecret || !from) {
    return null;
  }

  const adminTo = process.env.SOLAPI_ADMIN_TO || from;

  return { apiKey, apiSecret, from, adminTo };
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function createSolapiAuthorization(apiKey: string, apiSecret: string) {
  const date = new Date().toISOString();
  const salt = crypto.randomUUID().replace(/-/g, "");
  const signature = crypto.createHmac("sha256", apiSecret).update(date + salt).digest("hex");

  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
}

function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "https://sea-preschool-landing.vercel.app";
}

function getAdminUrl() {
  const key = process.env.ADMIN_KEY?.trim();
  const adminPath = key ? `/admin?key=${encodeURIComponent(key)}` : "/admin";

  return `${getSiteUrl()}${adminPath}`;
}

async function sendSolapiMessage(config: SolapiConfig, to: string, text: string) {
  const response = await fetch(SOLAPI_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: createSolapiAuthorization(config.apiKey, config.apiSecret),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        to: normalizePhone(to),
        from: normalizePhone(config.from),
        text,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Solapi notification failed: ${await response.text()}`);
  }
}

export async function notifyNewApplication(application: Application) {
  const config = getSolapiConfig();
  const pricing = getProgramPricing(new Date(application.createdAt));

  if (!config) {
    console.warn("Solapi notification skipped: missing SOLAPI_API_KEY, SOLAPI_API_SECRET, or SOLAPI_FROM.");
    return;
  }

  const applicantText = [
    `${application.name}님, SEA 프리스쿨 ${programInfo.cohort} 신청이 접수되었습니다.`,
    `개강일: ${programInfo.startsAt}`,
    `${pricing.activeLabel}: ${pricing.bankLabel}`,
    ...(pricing.earlyBirdActive ? [`적용 기간: ${programInfo.earlyBirdEndsAt}까지`] : []),
    `${bankInfo.bank} ${bankInfo.account}`,
    `예금주: ${bankInfo.holder}`,
    "입금자명은 신청자명과 동일하게 진행해주세요.",
    "입금 확인 후 최종 등록 안내를 보내드릴게요.",
    `접수번호: ${application.id.slice(0, 8)}`,
  ].join("\n");

  const adminText = [
    `[SEA 프리스쿨 신규 신청] ${programInfo.cohort}`,
    `이름: ${application.name}`,
    `연락처: ${application.phone}`,
    `입금자명: ${application.depositor}`,
    `관심 직무: ${application.interest}`,
    `접수번호: ${application.id.slice(0, 8)}`,
    `지원서 확인: ${getAdminUrl()}`,
  ].join("\n");

  const results = await Promise.allSettled([
    sendSolapiMessage(config, application.phone, applicantText),
    sendSolapiMessage(config, config.adminTo, adminText),
  ]);

  const failed = results.find((result) => result.status === "rejected");
  if (failed?.status === "rejected") {
    throw failed.reason;
  }
}

export async function notifyApplicationApproved(application: Application) {
  const config = getSolapiConfig();

  if (!config) {
    console.warn("Solapi approval notification skipped: missing SOLAPI_API_KEY, SOLAPI_API_SECRET, or SOLAPI_FROM.");
    return;
  }

  const text = [
    `${application.name}님, SEA 프리스쿨 ${programInfo.cohort} 등록이 완료되었습니다.`,
    "첫 달 수강료 입금 확인까지 정상 처리되었습니다.",
    "신청서도 운영팀에서 확인 완료했습니다.",
    `개강일: ${programInfo.startsAt}`,
    "수업 안내와 접속 링크는 개강 전 순차적으로 보내드릴게요.",
    `접수번호: ${application.id.slice(0, 8)}`,
  ].join("\n");

  await sendSolapiMessage(config, application.phone, text);
}
