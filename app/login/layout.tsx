import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MJU X SEA 엔터 취업 포트폴리오 강의 포털",
  description: "MJU X SEA 엔터 취업 포트폴리오 수강생 전용 강의 포털 로그인",
};

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
