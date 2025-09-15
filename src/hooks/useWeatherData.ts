"use client";

import useSWR from "swr";
import { LocationInfo } from "@/types/weather.types";
import { usePreferences } from "@/contexts/PreferencesContext";

const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(
      errorData.message || "An error occurred while fetching the data."
    );
    throw error;
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || "Failed to get weather data");
  }
  return result.data;
};

export function useWeatherData(location: LocationInfo | null) {
  const { preferences } = usePreferences();
  const { units, language } = preferences;

  // location이 유효할 때만 API URL을 생성하고, 그렇지 않으면 null을 사용해 요청을 보내지 않음
  const apiUrl = location
    ? `/api/weather?lat=${location.lat}&lon=${location.lon}&units=${units}&lang=${language}`
    : null;

  const { data, error, isLoading, mutate } = useSWR(apiUrl, fetcher, {
    // 10분마다 자동으로 데이터를 갱신 (stale-while-revalidate)
    refreshInterval: 1000 * 60 * 10,
    // 브라우저 포커스 시 데이터를 다시 가져옴
    revalidateOnFocus: true,
    // 네트워크 재연결 시 데이터를 다시 가져옴
    revalidateOnReconnect: true,
    // 에러 발생 시 재시도 횟수
    errorRetryCount: 3,
    // 에러 재시도 간격 (ms)
    errorRetryInterval: 5000,
  });

  return {
    data,
    isLoading,
    error,
    refreshWeatherData: mutate, // SWR의 mutate 함수를 refresh로 제공
  };
}
