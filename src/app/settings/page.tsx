"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Footer } from "@/components/layout/footer";
import { useI18n } from "@/contexts/I18nContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UnitToggle } from "@/components/settings/unit-toggle";
import { WindUnitToggle } from "@/components/settings/wind-unit-toggle";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { LanguageToggle } from "@/components/settings/language-toggle";

export default function SettingsPage() {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Main>
        <div className="w-full max-w-3xl mx-auto my-4">
          {/* 뒤로가기 버튼 */}
          <div className="mb-6 flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("common.back") || "뒤로가기"}
            </Button>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              {t("common.home") || "홈으로"}
            </Link>
          </div>
          
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{t("settings.title") || "설정"}</CardTitle>
              <CardDescription>
                {t("settings.description") || "앱의 환경설정을 조정하세요"}
              </CardDescription>
            </CardHeader>
          <CardContent className="space-y-6">
            {/* 온도 단위 설정 */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t("settings.temperatureUnit")}</h3>
              <div className="flex items-center justify-start">
                <UnitToggle />
              </div>
              <Separator className="my-4" />
            </div>

            {/* 풍속 단위 설정 */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t("settings.windSpeed")}</h3>
              <div className="flex items-center justify-start">
                <WindUnitToggle />
              </div>
              <Separator className="my-4" />
            </div>

            {/* 테마 설정 */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t("settings.theme")}</h3>
              <div className="flex items-center justify-start">
                <div className="flex items-center space-x-2">
                  <ModeToggle />
                </div>
              </div>
              <Separator className="my-4" />
            </div>

            {/* 언어 설정 */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t("settings.language")}</h3>
              <div className="flex items-center justify-start">
                <LanguageToggle />
              </div>
            </div>
          </CardContent>
          </Card>
        </div>
      </Main>
      <Footer />
    </div>
  );
}
