import { NextRequest, NextResponse } from "next/server";
import { openweatherApi } from "@/lib/api/openweather";
import { env } from "@/lib/env";
import { validateSearchQuery, sanitizeInput } from "@/lib/security";

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
    const rawQuery = searchParams.get("q");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 10;
    const lang = (searchParams.get("lang") as "ko" | "en") || "ko";

    // 필수 파라미터 검증
    if (!rawQuery) {
      return NextResponse.json(
        { success: false, error: "INVALID_PARAMS", message: "검색어(q)가 필요합니다" },
        { status: 400 }
      );
    }

    // 보안 검증
    if (!validateSearchQuery(rawQuery)) {
      return NextResponse.json(
        { success: false, error: "INVALID_QUERY_FORMAT", message: "유효하지 않은 검색어 형식입니다" },
        { status: 400 }
      );
    }

    const query = sanitizeInput(rawQuery);

    const data = await openweatherApi.geocodeSearch(query, limit, lang);
    
    console.log("지오코딩 API 응답 데이터:", data);
    
    // 검색 결과가 비어있는 경우 처리
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("검색 결과가 없습니다:", query);
      return NextResponse.json(
        { 
          success: true, 
          data: []
        },
        { status: 200 }
      );
    }
    
    // 검색 결과에 ID 추가
    const locationsWithId = data.map((loc: any) => ({
      ...loc,
      id: `${loc.country.toLowerCase()}-${loc.name.toLowerCase().replace(/\s+/g, "-")}`,
    }));

    return NextResponse.json(
      { 
        success: true, 
        data: locationsWithId
      },
      { 
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" // 5분 캐싱
        }
      }
    );
  } catch (error) {
    console.error("Geocode API error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "API_ERROR", 
        message: error instanceof Error ? error.message : "지오코딩 API 오류가 발생했습니다"
      },
      { status: 500 }
    );
  }
}
