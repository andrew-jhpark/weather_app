"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
          <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm">
            <h1 className="text-2xl font-bold">앱에 문제가 발생했습니다</h1>
            <p className="text-muted-foreground">
              죄송합니다. 애플리케이션에 예기치 않은 오류가 발생했습니다.
            </p>
            <div className="text-sm text-muted-foreground border p-2 rounded bg-muted font-mono">
              {error.message || error.toString()}
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => reset()}>다시 시도</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                페이지 새로고침
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
