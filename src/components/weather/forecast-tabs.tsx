"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HourlyForecast } from "@/components/weather/hourly-forecast";
import { DailyForecast } from "@/components/weather/daily-forecast";
import { WeatherData } from "@/types/weather.types";
import { useI18n } from "@/contexts/I18nContext";

interface ForecastTabsProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
}

export function ForecastTabs({ weatherData, isLoading }: ForecastTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("hourly");
  const { t } = useI18n();

  return (
    <Tabs
      defaultValue="hourly"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-2">{t("weather.forecast")}</h2>
        <TabsList>
          <TabsTrigger value="hourly">{t("weather.hourly")}</TabsTrigger>
          <TabsTrigger value="daily">{t("weather.daily")}</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="hourly" className="mt-4">
        <HourlyForecast weatherData={weatherData} isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="daily" className="mt-4">
        <DailyForecast weatherData={weatherData} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
}
