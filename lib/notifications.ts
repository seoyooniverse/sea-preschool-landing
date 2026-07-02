import crypto from "crypto";
import type { Application } from "@/lib/applications";

const SOLAPI_ENDPOINT = "https://api.solapi.com/messages/v4/send";

function getSolapiConfig() {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const from = process.env.SOLAPI_FROM;
  const to = process.env.SOLAPI_TO;

  if (!apiKey || !apiSecret || !from || !to) {
    return null;
  }

  return { apiKey, apiSecret, from, to };
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
    "[SEA 프리스쿨 신청 접수]",
    `이름: ${application.name}`,
    `연락처: ${application.phone}`,
    `관심 직무: ${application.interest}`,
    `상태: ${application.status}`,
    `접수번호: ${application.id}`,
  ].join("\n");

  const response = await fetch(SOLAPI_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: createSolapiAuthorization(config.apiKey, config.apiSecret),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        to: normalizePhone(config.to),
        from: normalizePhone(config.from),
        text,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Solapi notification failed: ${await response.text()}`);
  }
}
