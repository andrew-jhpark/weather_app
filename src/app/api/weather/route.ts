import { NextRequest, NextResponse } from "next/server";
import { openweatherApi } from "@/lib/api/openweather";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic"; // 항상 동적으로 재실행

export async function GET(request: NextRequest) {
  try {
    // API 키 검증
    if (!env.isApiKeyConfigured()) {
      return NextResponse.json(
        { success: false, error: "API_KEY_MISSING", message: "API 키가 설정되지 않았습니다" },
        { status: 500 }
      );
    }

    // 쿼리 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const units = (searchParams.get("units") as "metric" | "imperial") || "metric";
    const lang = (searchParams.get("lang") as "ko" | "en") || "ko";

    // 필수 파라미터 검증
    if (!lat || !lon) {
      return NextResponse.json(
        { success: false, error: "INVALID_PARAMS", message: "위도(lat)와 경도(lon)가 필요합니다" },
        { status: 400 }
      );
    }

    // 위도, 경도 숫자로 변환
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    // 위도, 경도 범위 검증 
    if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { success: false, error: "INVALID_COORDS", message: "올바른 위도와 경도 값을 입력하세요" },
        { status: 400 }
      );
    }

    // 날씨 데이터 가져오기
    const weatherData = await openweatherApi.getForecast(latitude, longitude, units, lang);

    return NextResponse.json(
      { 
        success: true, 
        data: weatherData 
      },
      { 
        status: 200,
        headers: {
          // 현재 날씨와 시간별 예보는 5분, 일별 예보는 30분 캐싱
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60"
        }
      }
    );
  } catch (error) {
    console.error("Weather API error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "API_ERROR", 
        message: error instanceof Error ? error.message : "날씨 API 오류가 발생했습니다"
      },
      { status: 500 }
    );
  }
}

