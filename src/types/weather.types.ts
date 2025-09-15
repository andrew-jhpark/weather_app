/**
 * 위치 정보 타입
 */
export interface LocationInfo {
  id: string;
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

/**
 * 날씨 상태 정보
 */
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

/**
 * 현재 날씨 정보
 */
export interface CurrentWeather {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  rain?: {
    "1h"?: number;
  };
  snow?: {
    "1h"?: number;
  };
  pop?: number; // 강수 확률 (0~1)
}

/**
 * 시간별 날씨 예보
 */
export interface HourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  pop: number; // 강수 확률 (0~1)
  rain?: {
    "1h"?: number;
  };
  snow?: {
    "1h"?: number;
  };
}

/**
 * 일별 날씨 예보
 */
export interface DailyForecast {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  clouds: number;
  pop: number;
  rain?: number;
  snow?: number;
  uvi: number;
}

/**
 * 날씨 경보 정보
 */
export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

/**
 * 통합 날씨 데이터 (One Call API 응답)
 */
export interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts?: WeatherAlert[];
}

/**
 * 사용자 설정 옵션 타입
 */
export interface UserPreferences {
  units: "metric" | "imperial";
  language: "ko" | "en";
  windSpeedUnit: "m/s" | "km/h" | "mph";
  pressureUnit: "hPa";
  theme: "light" | "dark" | "system";
}

/**
 * 최근 검색 위치 타입
 */
export interface RecentLocation {
  id: string;
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
  timestamp: number;
  isFavorite: boolean;
}
