import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-background">
      <div className="container flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between md:py-6">
        <div className="text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} 날씨 앱. 모든 권리 보유.</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <p>데이터 출처: OpenWeatherMap</p>
          <Separator orientation="vertical" className="h-4" />
          <p>버전: 0.1.0</p>
          <Separator orientation="vertical" className="h-4" />
          <a 
            href="#"
            className="hover:text-foreground hover:underline"
          >
            피드백
          </a>
        </div>
      </div>
    </footer>
  );
}
