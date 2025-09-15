import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Footer } from "@/components/layout/footer";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Main>
        <div className="grid gap-8">
          <Skeleton className="h-20 w-full" />
          <div className="grid gap-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div>
                  <Skeleton className="mb-2 h-8 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
            <div>
              <Skeleton className="mb-2 h-10 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </Main>
      <Footer />
    </div>
  );
}
