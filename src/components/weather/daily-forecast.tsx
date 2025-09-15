"use client";

import { usePreferences } from "@/contexts/PreferencesContext";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherData } from "@/types/weather.types";
import {
  formatDate,
  formatTemperature,
} from "@/lib/format";
import { WeatherIcon } from "@/components/ui/weather-icon";
import { useI18n } from "@/contexts/I18nContext";

interface DailyForecastProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
}

export function DailyForecast({ weatherData, isLoading }: DailyForecastProps) {
  const { preferences } = usePreferences();
  const { t, language } = useI18n();

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // 데이터가 없는 경우
  if (!weatherData || !weatherData.daily || weatherData.daily.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            {t("errorMessages.noDailyData")}
          </p>
        </CardContent>
      </Card>
    );
  }

  // 다음 7일 데이터 표시 (최대 7개)
  const dailyData = weatherData.daily.slice(0, 7);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2 lg:grid-cols-3">
          {dailyData.map((day, index) => {
            const weather =
              day.weather && day.weather.length > 0
                ? day.weather[0]
                : { icon: "01d", description: "알 수 없음" };

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const forecastDate = new Date(day.dt * 1000);
            forecastDate.setHours(0, 0, 0, 0);

            // 오늘, 내일, 또는 요일 표시
            let dayLabel = formatDate(day.dt, "weekday", language);
            if (forecastDate.getTime() === today.getTime()) {
              dayLabel = t("common.today");
            } else if (forecastDate.getTime() === today.getTime() + 86400000) {
              dayLabel = t("common.tomorrow");
            }

            return (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50"
              >
                <div className="flex flex-1 items-center gap-2">
                  <WeatherIcon
                    iconCode={weather.icon}
                    size="small"
                    alt={weather.description}
                    className="h-10 w-10"
                  />
                  <div className="flex-col">
                    <div className="font-medium">{dayLabel}</div>
                    <span className="text-xs text-muted-foreground">
                      {weather.description}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 text-sm">
                  <div className="font-medium">
                    {formatTemperature(day.temp.max, preferences.units)}
                  </div>
                  <div className="text-muted-foreground">
                    {formatTemperature(day.temp.min, preferences.units)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
