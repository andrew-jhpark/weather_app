import type { LocationInfo, WeatherData } from "./weather.types";

/**
 * API 응답 베이스 타입
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 지오코딩 API 응답 타입
 */
export interface GeocodeResponse extends ApiResponse<LocationInfo[]> {
  // Geocoding API specific response properties
  cached?: boolean;
}

/**
 * 날씨 데이터 API 응답 타입
 */
export interface WeatherResponse extends ApiResponse<WeatherData> {
  // Weather API specific response properties
  cached?: boolean;
}

/**
 * 지오코딩 결과 타입
 */
export interface GeocodeResult {
  id?: string;
  name: string;
  local_names?: {
    ko?: string;
    en?: string;
  };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

/**
 * 지역 검색 API 요청 파라미터
 */
export interface GeocodeSearchParams {
  q: string;
  limit?: number;
  lang?: "ko" | "en";
}

/**
 * 날씨 데이터 API 요청 파라미터
 */
export interface WeatherRequestParams {
  lat: number;
  lon: number;
  units?: "metric" | "imperial";
  lang?: "ko" | "en";
}
