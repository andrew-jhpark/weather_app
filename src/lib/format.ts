/**
 * 온도 포맷팅
 * 
 * @param temp 온도 값
 * @param units 단위 시스템 ('metric' | 'imperial')
 * @returns 포맷팅된 온도 문자열
 */
export function formatTemperature(temp: number, units: 'metric' | 'imperial' = 'metric'): string {
  const value = Math.round(temp);
  const symbol = units === 'metric' ? '°C' : '°F';
  return `${value}${symbol}`;
}

/**
 * 풍속 포맷팅
 * 
 * @param speed 풍속 값
 * @param units 단위 시스템 ('metric' | 'imperial')
 * @param format 출력 형식 ('m/s' | 'km/h' | 'mph')
 * @returns 포맷팅된 풍속 문자열
 */
export function formatWindSpeed(
  speed: number, 
  units: 'metric' | 'imperial' = 'metric',
  format: 'm/s' | 'km/h' | 'mph' = 'm/s'
): string {
  let value = speed;
  let symbol = '';
  
  // 기본 단위 변환
  if (units === 'imperial') {
    // 이미 mph로 제공됨
    symbol = 'mph';
    
    if (format === 'm/s') {
      value = speed * 0.44704; // mph to m/s
      symbol = 'm/s';
    } else if (format === 'km/h') {
      value = speed * 1.60934; // mph to km/h
      symbol = 'km/h';
    }
  } else {
    // metric은 기본적으로 m/s로 제공됨
    symbol = 'm/s';
    
    if (format === 'km/h') {
      value = speed * 3.6; // m/s to km/h
      symbol = 'km/h';
    } else if (format === 'mph') {
      value = speed * 2.23694; // m/s to mph
      symbol = 'mph';
    }
  }
  
  return `${value.toFixed(1)} ${symbol}`;
}

/**
 * 습도 포맷팅
 * 
 * @param humidity 습도 값 (%)
 * @returns 포맷팅된 습도 문자열
 */
export function formatHumidity(humidity: number): string {
  return `${humidity}%`;
}

/**
 * 강수확률 포맷팅
 * 
 * @param pop 강수 확률 (0~1)
 * @returns 포맷팅된 강수확률 문자열
 */
export function formatPrecipitationProbability(pop: number): string {
  return `${Math.round(pop * 100)}%`;
}

/**
 * 압력 포맷팅
 * 
 * @param pressure 압력 값 (hPa)
 * @returns 포맷팅된 압력 문자열
 */
export function formatPressure(pressure: number): string {
  return `${pressure} hPa`;
}

/**
 * 시간 포맷팅
 * 
 * @param timestamp 유닉스 타임스탬프
 * @param format 출력 형식 ('short' | 'long')
 * @param locale 로케일 코드
 * @returns 포맷팅된 시간 문자열
 */
export function formatTime(
  timestamp: number,
  format: 'short' | 'long' = 'short',
  locale: string = 'ko-KR'
): string {
  const date = new Date(timestamp * 1000);
  
  if (format === 'short') {
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }
  
  return date.toLocaleTimeString(locale);
}

/**
 * 날짜 포맷팅
 * 
 * @param timestamp 유닉스 타임스탬프
 * @param format 출력 형식 ('weekday' | 'short' | 'long')
 * @param locale 로케일 코드
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(
  timestamp: number,
  format: 'weekday' | 'short' | 'long' = 'short',
  locale: string = 'ko-KR'
): string {
  const date = new Date(timestamp * 1000);
  
  if (format === 'weekday') {
    return date.toLocaleDateString(locale, { weekday: 'short' });
  }
  
  if (format === 'short') {
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  }
  
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * 날씨 아이콘 URL 생성
 * 
 * @param iconCode OpenWeatherMap 아이콘 코드
 * @param size 아이콘 크기 ('small' | 'large')
 * @returns 아이콘 URL
 */
export function getWeatherIconUrl(iconCode: string, size: 'small' | 'large' = 'small'): string {
  const sizeStr = size === 'large' ? '@4x' : '';
  return `https://openweathermap.org/img/wn/${iconCode}${sizeStr}.png`;
}

/**
 * UV 지수 표시
 *
 * @param uvi UV 지수
 * @returns UV 단계에 해당하는 번역 키와 Tailwind CSS 색상 클래스
 */
export function getUviLevel(uvi: number): {
  levelKey: string;
  color: string;
} {
  if (uvi <= 2) {
    return { levelKey: "uvi.low", color: "bg-green-500" };
  } else if (uvi <= 5) {
    return { levelKey: "uvi.moderate", color: "bg-yellow-500" };
  } else if (uvi <= 7) {
    return { levelKey: "uvi.high", color: "bg-orange-500" };
  } else if (uvi <= 10) {
    return { levelKey: "uvi.veryHigh", color: "bg-red-500" };
  } else {
    return { levelKey: "uvi.extreme", color: "bg-purple-600" };
  }
}

