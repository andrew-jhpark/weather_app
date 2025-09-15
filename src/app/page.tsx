"use client";

import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Footer } from "@/components/layout/footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { ErrorMessage } from "@/components/ui/error-message";
import { CurrentWeatherCard } from "@/components/weather/current-weather-card";
import { ForecastTabs } from "@/components/weather/forecast-tabs";
import { useLocationContext } from "@/contexts/LocationContext";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useI18n } from "@/contexts/I18nContext";

export default function Page() {
  const { selectedLocation } = useLocationContext();
  const {
    data: weatherData,
    isLoading,
    error,
    refreshWeatherData,
  } = useWeatherData(selectedLocation);
  const { t } = useI18n();

  const renderContent = () => {
    if (!selectedLocation) {
      return (
        <Alert className="mb-2">
          <Info className="h-4 w-4" />
          <AlertTitle>{t("welcome.title")}</AlertTitle>
          <AlertDescription>{t("welcome.description")}</AlertDescription>
        </Alert>
      );
    }

    // 에러 발생 시 에러 메시지 표시
    if (error) {
      return (
        <ErrorMessage
          type="api"
          title={t("common.error")}
          message={`${t("errorMessages.fetchFailed")} ${error.message || ""}`}
          onRetry={() => refreshWeatherData()}
        />
      );
    }
    
    return (
      <div className="grid gap-6">
        <CurrentWeatherCard
          weatherData={weatherData}
          isLoading={isLoading}
          locationName={selectedLocation.name}
        />
        <ForecastTabs weatherData={weatherData} isLoading={isLoading} />
      </div>
    );
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Main>
        <div className="grid gap-8">{renderContent()}</div>
      </Main>
      <Footer />
    </div>
  );
}
