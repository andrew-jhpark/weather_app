import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Main>
        <div className="grid place-items-center py-20 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">404</h1>
            <h2 className="text-2xl font-medium">페이지를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground">
              요청하신 페이지가 존재하지 않거나 삭제되었을 수 있습니다.
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/">홈으로 돌아가기</Link>
              </Button>
            </div>
          </div>
        </div>
      </Main>
      <Footer />
    </div>
  );
}
