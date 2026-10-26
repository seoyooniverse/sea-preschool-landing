import type { Metadata } from "next";

const title = "MJU X SEA 엔터 취업 포트폴리오 강의 포털";
const description = "MJU X SEA 엔터 취업 포트폴리오 수강생 전용 강의 포털 로그인";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://sea-preschool-landing.vercel.app/login",
    siteName: "MJU X SEA",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
