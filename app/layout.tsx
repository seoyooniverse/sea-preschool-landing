import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MJU x SEA 엔터 취업 포트폴리오 | 2026년 8월 개강반",
  description:
    "2026년 8월 3일 개강. 16주 동안 실제 엔터테인먼트 업계 제출 수준의 엔터 취업 포트폴리오를 완성하는 프로젝트형 과정.",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
