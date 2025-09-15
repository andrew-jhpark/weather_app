"use client";

import { usePreferences } from "@/contexts/PreferencesContext";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { WeatherData } from "@/types/weather.types";
import { formatTime, formatTemperature } from "@/lib/format";
import { WeatherIcon } from "@/components/ui/weather-icon";
import { useI18n } from "@/contexts/I18nContext";

interface HourlyForecastProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
}

export function HourlyForecast({ weatherData, isLoading }: HourlyForecastProps) {
  const { preferences } = usePreferences();
  const { t } = useI18n();

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-6 pb-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // 데이터가 없는 경우
  if (!weatherData || !weatherData.hourly || weatherData.hourly.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            {t("errorMessages.noHourlyData")}
          </p>
        </CardContent>
      </Card>
    );
  }

  // 다음 24시간 데이터만 표시 (최대 24개)
  const hourlyData = weatherData.hourly.slice(0, 24);

  return (
    <Card>
      <CardContent className="p-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-6 pb-2">
            {hourlyData.map((hour, index) => {
              const weather = hour.weather && hour.weather.length > 0 
                ? hour.weather[0] 
                : { icon: "01d", description: "알 수 없음" };
              
              return (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <span className="text-sm text-muted-foreground">
                    {index === 0 ? t("common.now") : formatTime(hour.dt)}
                  </span>
                  <WeatherIcon
                    iconCode={weather.icon}
                    size="small"
                    alt={weather.description}
                    className="h-10 w-10"
                  />
                  <span className="font-medium">
                    {formatTemperature(hour.temp, preferences.units)}
                  </span>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
