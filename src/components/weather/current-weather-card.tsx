"use client";

import React from "react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useI18n } from "@/contexts/I18nContext";
import {
  Card,
  CardContent,
  CardFooter,
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
} from "@/lib/format";
import { WeatherIcon } from "@/components/ui/weather-icon";
import { WeatherData } from "@/types/weather.types";

interface CurrentWeatherCardProps {
  weatherData: WeatherData | null | undefined;
  isLoading: boolean;
  locationName: string;
}

export function CurrentWeatherCard({
  weatherData,
  isLoading,
  locationName,
}: CurrentWeatherCardProps) {
  const { preferences } = usePreferences();
  const { t } = useI18n();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-20 w-20" />
            <div className="text-right">
              <Skeleton className="h-12 w-24" />
              <Skeleton className="mt-2 h-4 w-20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-6 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (!weatherData) {
    // isLoading이 false인데 데이터가 없는 경우 (초기 상태 또는 에러 이후)
    // 상위 컴포넌트에서 에러를 처리하므로 여기서는 간단한 메시지만 표시하거나 아무것도 표시하지 않을 수 있습니다.
    return null;
  }

  const { current, alerts, daily } = weatherData;
  const todayForecast = daily?.[0];
  const weather =
    current.weather && current.weather.length > 0
      ? current.weather[0]
      : {
          main: t("common.unknown"),
          description: t("errorMessages.fetchFailed"),
          icon: "04d",
        };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl">{locationName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("weather.basedOn", { date: formatDate(current.dt, "long") })}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-4xl font-bold">
              {formatTemperature(current.temp, preferences.units)}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("weather.feelsLike")}{" "}
              {formatTemperature(current.feels_like, preferences.units)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex items-center">
            <WeatherIcon
              iconCode={weather.icon}
              size="large"
              alt={weather.description}
              className="h-20 w-20"
            />
            <div className="ml-4">
              <h3 className="text-xl font-medium">{weather.main}</h3>
              <p className="text-sm text-muted-foreground">
                {weather.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {todayForecast && (
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {t("weather.highLow")}:
                </span>
                <span className="text-sm font-medium">
                  {formatTemperature(todayForecast.temp.max, preferences.units)}
                  {" / "}
                  {formatTemperature(todayForecast.temp.min, preferences.units)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {t("weather.humidity")}:
              </span>
              <span className="text-sm font-medium">
                {formatHumidity(current.humidity)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {t("weather.wind")}:
              </span>
              <span className="text-sm font-medium">
                {formatWindSpeed(
                  current.wind_speed,
                  preferences.units,
                  preferences.windSpeedUnit
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {alerts && alerts.length > 0 ? (
          <Alert className="mt-2 w-full" variant="destructive">
            <BadgeAlert className="h-4 w-4" />
            <AlertTitle>{alerts[0].event}</AlertTitle>
            <AlertDescription className="line-clamp-2">
              {alerts[0].description}
            </AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("weather.sunrise")}: {formatDate(current.sunrise, "short")} /{" "}
            {t("weather.sunset")}: {formatDate(current.sunset, "short")}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
