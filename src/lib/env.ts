// 환경 변수 디버깅
console.log("환경 변수 로드 중...");
console.log("NEXT_PUBLIC_OPENWEATHERMAP_API_KEY:", process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY ? "설정됨" : "설정되지 않음");
console.log("NEXT_PUBLIC_OPENWEATHERMAP_API_URL:", process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_URL);

// 하드코딩된 API 키 (임시 테스트용)
const HARDCODED_API_KEY = "eef1ae1c43f4d8b65ab0303c2512a1b5";

export const env = {
  /**
   * OpenWeatherMap API 키
   * 
   * @see https://openweathermap.org/api
   * @env NEXT_PUBLIC_OPENWEATHERMAP_API_KEY
   */
  OPENWEATHER_API_KEY: process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY || HARDCODED_API_KEY,

  /**
   * OpenWeatherMap API URL
   */
  OPENWEATHER_API_URL: process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_URL || "https://api.openweathermap.org/data/2.5",

  /**
   * API 키가 설정되어 있는지 확인
   */
  isApiKeyConfigured: () => {
    const isConfigured = !!env.OPENWEATHER_API_KEY;
    console.log("API 키 설정 여부:", isConfigured);
    return isConfigured;
  },

  /**
   * 환경 변수 검증
   */
  validateEnv: () => {
    if (!env.OPENWEATHER_API_KEY) {
      console.warn("NEXT_PUBLIC_OPENWEATHERMAP_API_KEY 환경 변수가 설정되지 않았습니다.");
      return false;
    }
    console.log("환경 변수 검증 완료");
    return true;
  }
};
