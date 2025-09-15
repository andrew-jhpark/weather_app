import { env } from "@/lib/env";

const BASE_URL = env.OPENWEATHER_API_URL || "https://api.openweathermap.org/data/2.5";
const GEO_BASE_URL = "https://api.openweathermap.org/geo/1.0";

/**
 * OpenWeatherMap API 클라이언트
 * 
 * API 키를 관리하고, API 호출을 추상화합니다.
 */
export const openweatherApi = {
  /**
   * API 키를 추가한 URL을 생성
   */
  getUrl: (endpoint: string, params: Record<string, string> = {}) => {
    const url = new URL(endpoint);
    
    // 기본 파라미터 설정
    url.searchParams.append("appid", env.OPENWEATHER_API_KEY);
    
    // 추가 파라미터 설정
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    return url.toString();
  },
  
  /**
   * 위도/경도 기반 현재 날씨 정보 조회
   */
  getCurrentWeather: async (lat: number, lon: number, units = "metric", lang = "ko") => {
    const endpoint = `${BASE_URL}/weather`;
    const url = openweatherApi.getUrl(endpoint, {
      lat: lat.toString(),
      lon: lon.toString(),
      units,
      lang,
    });
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    return response.json();
  },
  
  /**
   * 5일/3시간 예보 정보 조회
   */
  get5DayForecast: async (lat: number, lon: number, units = "metric", lang = "ko") => {
    const endpoint = `${BASE_URL}/forecast`;
    const url = openweatherApi.getUrl(endpoint, {
      lat: lat.toString(),
      lon: lon.toString(),
      units,
      lang,
    });
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`5-day forecast API error: ${response.status}`);
    }
    
    return response.json();
  },

  /**
   * 위도/경도 기반 날씨 예보 정보 조회 (시간별, 일별 포함)
   * OneCall API가 실패할 경우 현재 날씨와 5일 예보를 결합하여 사용
   */
  getForecast: async (lat: number, lon: number, units = "metric", lang = "ko") => {
    try {
      // 현재 날씨와 5일 예보를 가져와서 결합
      const currentWeather = await openweatherApi.getCurrentWeather(lat, lon, units, lang);
      const forecast5Day = await openweatherApi.get5DayForecast(lat, lon, units, lang);
      
      // 시간별 예보 데이터 변환 (5일/3시간 예보에서 추출)
      const hourlyData = forecast5Day.list.slice(0, 24).map((item: any) => ({
        dt: item.dt,
        temp: item.main.temp,
        feels_like: item.main.feels_like,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        dew_point: 0, // 기본값
        uvi: 0, // 기본값
        clouds: item.clouds.all,
        visibility: item.visibility || 10000,
        wind_speed: item.wind.speed,
        wind_deg: item.wind.deg,
        wind_gust: item.wind.gust,
        weather: item.weather,
        pop: item.pop || 0,
        rain: item.rain,
        snow: item.snow
      }));
      
      // 일별 예보 데이터 생성 (5일/3시간 예보에서 일별로 그룹화)
      const dailyMap = new Map();
      forecast5Day.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        date.setHours(0, 0, 0, 0);
        const dateKey = date.getTime();
        
        if (!dailyMap.has(dateKey)) {
          dailyMap.set(dateKey, {
            dt: Math.floor(date.getTime() / 1000),
            temp: {
              day: -100,
              min: 100,
              max: -100,
              night: -100,
              eve: -100,
              morn: -100
            },
            feels_like: {
              day: 0,
              night: 0,
              eve: 0,
              morn: 0
            },
            pressure: 0,
            humidity: 0,
            weather: [],
            clouds: 0,
            wind_speed: 0,
            wind_deg: 0,
            pop: 0,
            rain: 0,
            snow: 0,
            uvi: 0,
            sunrise: 0,
            sunset: 0,
            moonrise: 0,
            moonset: 0,
            moon_phase: 0,
            dew_point: 0,
            samples: 0
          });
        }
        
        const dayData = dailyMap.get(dateKey);
        dayData.samples++;
        
        // 시간에 따라 다른 값 설정
        const hour = date.getHours();
        if (hour >= 6 && hour < 12) { // 아침
          dayData.temp.morn = Math.max(dayData.temp.morn, item.main.temp);
          dayData.feels_like.morn = item.main.feels_like;
        } else if (hour >= 12 && hour < 18) { // 낮
          dayData.temp.day = Math.max(dayData.temp.day, item.main.temp);
          dayData.feels_like.day = item.main.feels_like;
        } else if (hour >= 18 && hour < 22) { // 저녁
          dayData.temp.eve = Math.max(dayData.temp.eve, item.main.temp);
          dayData.feels_like.eve = item.main.feels_like;
        } else { // 밤
          dayData.temp.night = Math.max(dayData.temp.night, item.main.temp);
          dayData.feels_like.night = item.main.feels_like;
        }
        
        // 최소/최대 온도 업데이트
        dayData.temp.min = Math.min(dayData.temp.min, item.main.temp);
        dayData.temp.max = Math.max(dayData.temp.max, item.main.temp);
        
        // 가장 확률이 높은 날씨 선택
        if (!dayData.weather.length || item.pop > dayData.pop) {
          dayData.weather = item.weather;
          dayData.pop = item.pop || 0;
        }
        
        // 누적 값 (나중에 평균 계산)
        dayData.pressure += item.main.pressure;
        dayData.humidity += item.main.humidity;
        dayData.clouds += item.clouds.all;
        dayData.wind_speed += item.wind.speed;
        dayData.wind_deg += item.wind.deg;
        
        // 비/눈 정보 (있으면 추가)
        if (item.rain && item.rain['3h']) {
          dayData.rain += item.rain['3h'];
        }
        if (item.snow && item.snow['3h']) {
          dayData.snow += item.snow['3h'];
        }
      });
      
      // 일별 데이터 평균 계산 및 정리
      const dailyData = Array.from(dailyMap.values()).map(day => {
        if (day.samples > 0) {
          day.pressure = Math.round(day.pressure / day.samples);
          day.humidity = Math.round(day.humidity / day.samples);
          day.clouds = Math.round(day.clouds / day.samples);
          day.wind_speed = day.wind_speed / day.samples;
          day.wind_deg = Math.round(day.wind_deg / day.samples);
        }
        
        // 기본값으로 대체
        if (day.temp.day === -100) day.temp.day = day.temp.max;
        if (day.temp.night === -100) day.temp.night = day.temp.min;
        if (day.temp.eve === -100) day.temp.eve = day.temp.max;
        if (day.temp.morn === -100) day.temp.morn = day.temp.min;
        
        // 일출/일몰 정보 (현재 날씨에서 가져옴)
        day.sunrise = currentWeather.sys?.sunrise || Math.floor(Date.now() / 1000);
        day.sunset = currentWeather.sys?.sunset || Math.floor(Date.now() / 1000) + 12 * 3600;
        
        delete day.samples;
        return day;
      }).slice(0, 7); // 최대 7일
      
      // 현재 날씨 데이터를 OneCall 형식으로 변환
      return {
        lat,
        lon,
        timezone: currentWeather.name || "Unknown",
        timezone_offset: currentWeather.timezone || 0,
        current: {
          dt: currentWeather.dt,
          sunrise: currentWeather.sys?.sunrise,
          sunset: currentWeather.sys?.sunset,
          temp: currentWeather.main?.temp,
          feels_like: currentWeather.main?.feels_like,
          pressure: currentWeather.main?.pressure,
          humidity: currentWeather.main?.humidity,
          dew_point: 0, // 기본값 설정
          uvi: currentWeather.uvi || 0,
          clouds: currentWeather.clouds?.all,
          visibility: currentWeather.visibility,
          wind_speed: currentWeather.wind?.speed,
          wind_deg: currentWeather.wind?.deg,
          weather: currentWeather.weather || [],
        },
        hourly: hourlyData,
        daily: dailyData,
      };
    } catch (error) {
      console.error("Failed to fetch forecast data:", error);
      
      // 최소한의 데이터로 응답
      const currentWeather = await openweatherApi.getCurrentWeather(lat, lon, units, lang);
      
      return {
        lat,
        lon,
        timezone: currentWeather.name || "Unknown",
        timezone_offset: currentWeather.timezone || 0,
        current: {
          dt: currentWeather.dt,
          sunrise: currentWeather.sys?.sunrise,
          sunset: currentWeather.sys?.sunset,
          temp: currentWeather.main?.temp,
          feels_like: currentWeather.main?.feels_like,
          pressure: currentWeather.main?.pressure,
          humidity: currentWeather.main?.humidity,
          dew_point: 0, // 기본값 설정
          uvi: currentWeather.uvi || 0,
          clouds: currentWeather.clouds?.all,
          visibility: currentWeather.visibility,
          wind_speed: currentWeather.wind?.speed,
          wind_deg: currentWeather.wind?.deg,
          weather: currentWeather.weather || [],
        },
        hourly: [], // 비어있는 배열
        daily: [],  // 비어있는 배열
      };
    }
  },
  
  /**
   * 지역명으로 위치 검색 (자동완성용)
   */
  geocodeSearch: async (query: string, limit = 5, lang = "ko") => {
    // 한글 검색어 처리 최적화
    const processedQuery = query.trim();
    
    // 디버깅 정보
    console.log(`지오코딩 검색 요청: "${processedQuery}", 언어: ${lang}, 제한: ${limit}`);
    
    const endpoint = `${GEO_BASE_URL}/direct`;
    const url = openweatherApi.getUrl(endpoint, {
      q: processedQuery,
      limit: limit.toString(),
      lang,
    });
    
    console.log("지오코딩 API URL:", url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 빈 결과인 경우 영어로 재시도
    if (Array.isArray(data) && data.length === 0 && lang === 'ko') {
      console.log(`"${processedQuery}" 검색 결과 없음, 영어로 재시도`);
      
      // 한글->영어 매핑 (주요 도시)
      const koreanToEnglish: Record<string, string> = {
        '서울': 'Seoul',
        '부산': 'Busan',
        '인천': 'Incheon',
        '대구': 'Daegu',
        '광주': 'Gwangju',
        '대전': 'Daejeon',
        '울산': 'Ulsan',
        '세종': 'Sejong',
        '제주': 'Jeju',
        '경기': 'Gyeonggi',
        '강원': 'Gangwon',
        '충북': 'Chungbuk',
        '충남': 'Chungnam',
        '전북': 'Jeonbuk',
        '전남': 'Jeonnam',
        '경북': 'Gyeongbuk',
        '경남': 'Gyeongnam',
      };
      
      // 한글 도시명이면 영어로 변환하여 재시도
      if (koreanToEnglish[processedQuery]) {
        const englishQuery = koreanToEnglish[processedQuery];
        console.log(`한글 도시명 "${processedQuery}"를 영어 "${englishQuery}"로 변환하여 재시도`);
        
        const englishUrl = openweatherApi.getUrl(endpoint, {
          q: englishQuery,
          limit: limit.toString(),
          lang: 'en', // 영어로 검색
        });
        
        const englishResponse = await fetch(englishUrl);
        
        if (englishResponse.ok) {
          const englishData = await englishResponse.json();
          if (Array.isArray(englishData) && englishData.length > 0) {
            console.log(`영어 검색 "${englishQuery}" 결과:`, englishData);
            return englishData;
          }
        }
      }
    }
    
    return data;
  },
  
  /**
   * 위도/경도 기반 지역 정보 조회 (역지오코딩)
   */
  reverseGeocode: async (lat: number, lon: number, limit = 1) => {
    const endpoint = `${GEO_BASE_URL}/reverse`;
    const url = openweatherApi.getUrl(endpoint, {
      lat: lat.toString(),
      lon: lon.toString(),
      limit: limit.toString(),
    });
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Reverse geocoding API error: ${response.status}`);
    }
    
    return response.json();
  },
};
