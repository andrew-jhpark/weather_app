import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET() {
  try {
    console.log("API 테스트 엔드포인트 호출됨");
    
    // API 키 확인
    const apiKey = env.OPENWEATHER_API_KEY;
    console.log("API 키 존재 여부:", !!apiKey);
    
    // API 키 마스킹 (보안을 위해 일부만 표시)
    const maskedKey = apiKey ? 
      `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : 
      "설정되지 않음";
    
    // 환경 변수 정보
    const envInfo = {
      NEXT_PUBLIC_OPENWEATHERMAP_API_KEY: process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY ? "설정됨" : "설정되지 않음",
      NEXT_PUBLIC_OPENWEATHERMAP_API_URL: process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_URL || "설정되지 않음",
      ENV_OPENWEATHER_API_KEY: env.OPENWEATHER_API_KEY ? "설정됨" : "설정되지 않음",
      ENV_OPENWEATHER_API_URL: env.OPENWEATHER_API_URL || "설정되지 않음"
    };
    
    // 간단한 API 테스트 (현재 날씨 API)
    console.log("API 호출 시작");
    const testUrl = `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${apiKey}&units=metric&lang=ko`;
    const response = await fetch(testUrl);
    const data = await response.json();
    console.log("API 응답 상태:", response.status);
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      apiKeyConfigured: !!apiKey,
      apiKeyMasked: maskedKey,
      envInfo,
      data: response.ok ? data : null,
      error: !response.ok ? data : null
    });
  } catch (error) {
    console.error("API 테스트 오류:", error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message || "알 수 없는 오류"
    }, { status: 500 });
  }
}
