import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  return {
    title: "Atlas 学生端｜大学申请智能工作台",
    description: "把申请中的不确定，变成每天可以执行的计划。",
    metadataBase: new URL(baseUrl),
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Atlas 学生端",
      description: "把申请中的不确定，变成每天可以执行的计划。",
      url: baseUrl,
      siteName: "Atlas",
      locale: "zh_CN",
      type: "website",
      images: [{ url: `${baseUrl}/og.png`, width: 1200, height: 630, alt: "Atlas 学生端大学申请智能工作台" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Atlas 学生端",
      description: "把申请中的不确定，变成每天可以执行的计划。",
      images: [`${baseUrl}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
