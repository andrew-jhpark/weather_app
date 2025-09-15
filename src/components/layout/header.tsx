"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Settings as SettingsIcon } from "lucide-react";
import { useLocationContext } from "@/contexts/LocationContext";
import { SearchCommand } from "@/components/search/search-command";
import { useI18n } from "@/contexts/I18nContext";
import { UnitToggle } from "../settings/unit-toggle";
import { LanguageToggle } from "../settings/language-toggle";

export function Header() {
  const { getCurrentLocation, isLoading } =
    useLocationContext();
  const { t } = useI18n();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="font-semibold">{t("common.appName")}</h1>
          </Link>
        </div>
        {/* 데스크탑에서는 헤더에 검색창 표시 */}
        <div className="hidden flex-1 px-4 md:flex">
          <SearchCommand />
        </div>
        {/* 모바일에서는 헤더 아래에 검색창 표시 */}
        <div className="md:hidden w-full absolute left-0 top-16 px-4 py-2 bg-background/95 backdrop-blur border-b z-10">
          <SearchCommand />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={getCurrentLocation}
            disabled={isLoading}
            aria-label={t("header.currentLocation")}
            className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {isLoading ? (
              <Loader2 className="h-[1.2rem] w-[1.2rem] animate-spin" />
            ) : (
              <MapPin className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">{t("header.currentLocation")}</span>
          </Button>
          {/* 데스크탑에서만 표시할 요소들 */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <UnitToggle />
            <ModeToggle />
            <LanguageToggle variant="icon" />
          </div>
          {/* 모바일과 데스크탑 모두 표시할 설정 버튼 */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/settings')}
            aria-label={t("settings.title")}
          >
            <SettingsIcon className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">{t("settings.title")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
