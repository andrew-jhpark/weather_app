/**
 * 날씨 상태별 색상 테마 유틸리티
 */

export interface WeatherColorTheme {
  background: string;
  text: string;
  accent: string;
  icon: string;
}

/**
 * 날씨 상태별 색상 매핑
 */
export const weatherColorMap: Record<string, WeatherColorTheme> = {
  // 맑음 (Clear)
  'clear': {
    background: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500',
    text: 'text-white',
    accent: 'text-yellow-100',
    icon: 'text-yellow-100'
  },
  
  // 구름 많음 (Clouds)
  'clouds': {
    background: 'bg-gradient-to-br from-gray-400 via-gray-500 to-blue-500',
    text: 'text-white',
    accent: 'text-gray-100',
    icon: 'text-gray-100'
  },
  
  // 비 (Rain)
  'rain': {
    background: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600',
    text: 'text-white',
    accent: 'text-blue-100',
    icon: 'text-blue-100'
  },
  
  // 소나기 (Drizzle)
  'drizzle': {
    background: 'bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500',
    text: 'text-white',
    accent: 'text-blue-100',
    icon: 'text-blue-100'
  },
  
  // 뇌우 (Thunderstorm)
  'thunderstorm': {
    background: 'bg-gradient-to-br from-gray-700 via-gray-800 to-purple-900',
    text: 'text-white',
    accent: 'text-purple-200',
    icon: 'text-purple-200'
  },
  
  // 눈 (Snow)
  'snow': {
    background: 'bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-300',
    text: 'text-gray-800',
    accent: 'text-blue-700',
    icon: 'text-blue-600'
  },
  
  // 안개/연무 (Mist, Fog, Haze)
  'mist': {
    background: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
    text: 'text-white',
    accent: 'text-gray-100',
    icon: 'text-gray-100'
  },
  
  // 먼지/모래 (Dust, Sand)
  'dust': {
    background: 'bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600',
    text: 'text-white',
    accent: 'text-yellow-100',
    icon: 'text-yellow-100'
  },
  
  // 기본값 (알 수 없는 날씨)
  'default': {
    background: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600',
    text: 'text-white',
    accent: 'text-blue-100',
    icon: 'text-blue-100'
  }
};

/**
 * 날씨 상태 코드를 기반으로 색상 테마를 반환합니다
 */
export function getWeatherColorTheme(weatherMain: string): WeatherColorTheme {
  const normalizedWeather = weatherMain.toLowerCase();
  
  // 날씨 상태별 매핑
  if (normalizedWeather.includes('clear')) return weatherColorMap.clear;
  if (normalizedWeather.includes('cloud')) return weatherColorMap.clouds;
  if (normalizedWeather.includes('rain')) return weatherColorMap.rain;
  if (normalizedWeather.includes('drizzle')) return weatherColorMap.drizzle;
  if (normalizedWeather.includes('thunderstorm')) return weatherColorMap.thunderstorm;
  if (normalizedWeather.includes('snow')) return weatherColorMap.snow;
  if (normalizedWeather.includes('mist') || normalizedWeather.includes('fog') || normalizedWeather.includes('haze')) {
    return weatherColorMap.mist;
  }
  if (normalizedWeather.includes('dust') || normalizedWeather.includes('sand')) {
    return weatherColorMap.dust;
  }
  
  return weatherColorMap.default;
}

/**
 * 시간대별 색상 보정 (선택적 기능)
 */
export function adjustColorForTime(theme: WeatherColorTheme, hour: number): WeatherColorTheme {
  const isNight = hour < 6 || hour > 20;
  
  if (isNight) {
    // 밤 시간대에는 더 어둡게
    return {
      ...theme,
      background: theme.background.replace('from-', 'from-slate-700 via-slate-800 to-'),
      text: 'text-gray-100',
      accent: 'text-gray-300',
      icon: 'text-gray-300'
    };
  }
  
  return theme;
}

/**
 * 온도별 색상 강도 조정 (선택적 기능)
 */
export function adjustColorForTemperature(theme: WeatherColorTheme, temperature: number): WeatherColorTheme {
  if (temperature > 30) {
    // 매우 더운 날씨 - 더 강렬한 색상
    return {
      ...theme,
      background: theme.background.replace('to-', 'to-red-500'),
    };
  } else if (temperature < 0) {
    // 매우 추운 날씨 - 차가운 색상
    return {
      ...theme,
      background: theme.background.replace('to-', 'to-blue-700'),
    };
  }
  
  return theme;
}
