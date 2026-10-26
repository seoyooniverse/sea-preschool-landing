import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEA 프리스쿨 강의 포털",
  description: "SEA 프리스쿨 수강생 전용 강의 포털 로그인",
};

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
