"use client";

import React, { memo, useMemo } from "react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useI18n } from "@/contexts/I18nContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BadgeAlert, Droplets, Thermometer, Wind } from "lucide-react";
import {
  formatDate,
  formatTemperature,
  formatHumidity,
  formatWindSpeed,
  getUviLevel,
} from "@/lib/format";
import { WeatherIcon } from "@/components/ui/weather-icon";
import { WeatherData } from "@/types/weather.types";

interface OptimizedCurrentWeatherCardProps {
  weatherData: WeatherData | null | undefined;
  isLoading: boolean;
  locationName: string;
}

const OptimizedCurrentWeatherCard = memo(({
  weatherData,
  isLoading,
  locationName,
}: OptimizedCurrentWeatherCardProps) => {
  const { preferences } = usePreferences();
  const { t, language } = useI18n();

  // 메모이제이션된 계산값들
  const computedValues = useMemo(() => {
    if (!weatherData?.current) return null;

    const { current } = weatherData;
    const uviData = getUviLevel(current.uvi);

    return {
      temperature: formatTemperature(current.temp, preferences.units),
      feelsLike: formatTemperature(current.feels_like, preferences.units),
      humidity: formatHumidity(current.humidity),
      windSpeed: formatWindSpeed(current.wind_speed, preferences.units, preferences.windSpeedUnit),
      formattedDate: formatDate(current.dt, 'long', language === 'ko' ? 'ko-KR' : 'en-US'),
      uviLevel: uviData.levelKey,
      uviColor: uviData.color,
    };
  }, [weatherData, preferences.units, preferences.windSpeedUnit, language]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-20 w-20 rounded-md" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData?.current || !computedValues) {
    return (
      <Alert variant="destructive">
        <BadgeAlert className="h-4 w-4" />
        <AlertTitle>{t("errors.noData")}</AlertTitle>
        <AlertDescription>{t("errors.tryRefresh")}</AlertDescription>
      </Alert>
    );
  }

  const { current } = weatherData;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {locationName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {computedValues.formattedDate}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex items-center">
            <WeatherIcon
              iconCode={current.weather[0]?.icon || '01d'}
              size="large"
              alt={current.weather[0]?.description || 'Weather'}
              className="h-20 w-20"
            />
            <div className="ml-4">
              <h3 className="text-xl font-medium">{current.weather[0]?.main || 'Clear'}</h3>
              <p className="text-sm text-muted-foreground">
                {current.weather[0]?.description || 'Clear sky'}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold">
                {computedValues.temperature}
              </span>
              <div className="text-right text-sm text-muted-foreground">
                <div>{t("weather.feelsLike")}: {computedValues.feelsLike}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div className="text-sm">
                  <div className="font-medium">{computedValues.humidity}</div>
                  <div className="text-muted-foreground">{t("weather.humidity")}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <div className="text-sm">
                  <div className="font-medium">{computedValues.windSpeed}</div>
                  <div className="text-muted-foreground">{t("weather.wind")}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <div className="text-sm">
                  <div className="font-medium">{current.uvi.toFixed(1)}</div>
                  <div className="text-muted-foreground">{t("weather.uvi")}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${computedValues.uviColor}`} />
                <div className="text-sm">
                  <div className="font-medium">{t(computedValues.uviLevel)}</div>
                  <div className="text-muted-foreground">{t("weather.uviLevel")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedCurrentWeatherCard.displayName = "OptimizedCurrentWeatherCard";

export { OptimizedCurrentWeatherCard };
