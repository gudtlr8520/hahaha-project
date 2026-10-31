import type { Metadata } from "next";
import "@fontsource-variable/noto-sans-kr";
import "@fontsource-variable/noto-serif-kr";
import "./globals.css";

export const metadata: Metadata = {
  title: "잔향 : 1408 | 끝나지 않은 밤",
  description: "정전된 아파트 14층. 당신의 선택으로 완성되는 픽셀 아트 생존 노벨. 문밖의 목소리를 믿지 마세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
