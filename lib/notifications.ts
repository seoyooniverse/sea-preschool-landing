import crypto from "crypto";
import type { Application } from "@/lib/applications";

const SOLAPI_ENDPOINT = "https://api.solapi.com/messages/v4/send";

function getSolapiConfig() {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const from = process.env.SOLAPI_FROM;

  if (!apiKey || !apiSecret || !from) {
    return null;
  }

  return { apiKey, apiSecret, from };
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

export async function notifyNewApplication(application: Application) {
  const config = getSolapiConfig();

  if (!config) {
    return;
  }

  const text = [
    `${application.name}님, SEA 프리스쿨 과정 신청이 접수되었습니다.`,
    "운영팀 확인 후 등록 안내를 보내드릴게요.",
    "입금자명은 신청자명과 동일하게 진행해주세요.",
    `접수번호: ${application.id.slice(0, 8)}`,
  ].join("\n");

  const response = await fetch(SOLAPI_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: createSolapiAuthorization(config.apiKey, config.apiSecret),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        to: normalizePhone(application.phone),
        from: normalizePhone(config.from),
        text,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Solapi notification failed: ${await response.text()}`);
  }
}
