/**
 * 보안 관련 유틸리티 함수들
 */

/**
 * XSS 방지를 위한 HTML 이스케이프
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * 안전한 URL 검증
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    // HTTPS만 허용하고, 허용된 도메인만 접근 가능
    return parsedUrl.protocol === 'https:' && 
           (parsedUrl.hostname === 'api.openweathermap.org' || 
            parsedUrl.hostname === 'openweathermap.org');
  } catch {
    return false;
  }
}

/**
 * 입력 값 검증 및 정제
 */
export function sanitizeInput(input: string): string {
  // 기본적인 정제: 앞뒤 공백 제거, 특수 문자 제한
  return input
    .trim()
    .replace(/[<>]/g, '') // 기본적인 HTML 태그 제거
    .substring(0, 100); // 최대 길이 제한
}

/**
 * 지역 검색 쿼리 검증
 */
export function validateSearchQuery(query: string): boolean {
  // 빈 문자열이거나 너무 짧은 경우
  if (!query || query.trim().length < 1) {
    return false;
  }
  
  // 너무 긴 경우
  if (query.length > 100) {
    return false;
  }
  
  // 기본적인 SQL 인젝션 패턴 검사
  const suspiciousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /(--|\/\*|\*\/|;)/,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(query));
}

/**
 * API 응답 데이터 검증
 */
export function validateApiResponse(data: unknown): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  // 기본적인 구조 검증
  return true;
}

/**
 * 환경 변수 검증
 */
export function validateEnvironmentVariables(): {
  isValid: boolean;
  missing: string[];
} {
  const required = ['OPENWEATHERMAP_API_KEY'];
  const missing: string[] = [];
  
  for (const envVar of required) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  return {
    isValid: missing.length === 0,
    missing,
  };
}
