import { describe, it, expect } from 'vitest';
import {
  formatTemperature,
  formatWindSpeed,
  formatHumidity,
  formatPrecipitationProbability,
  formatDate,
  formatTime,
  getUviLevel,
  getWeatherIconUrl,
} from '../format';

describe('format utilities', () => {
  describe('formatTemperature', () => {
    it('should format temperature in Celsius', () => {
      expect(formatTemperature(25.5, 'metric')).toBe('26°C');
      expect(formatTemperature(0, 'metric')).toBe('0°C');
      expect(formatTemperature(-10.3, 'metric')).toBe('-10°C');
    });

    it('should format temperature in Fahrenheit', () => {
      expect(formatTemperature(77, 'imperial')).toBe('77°F');
      expect(formatTemperature(32, 'imperial')).toBe('32°F');
    });
  });

  describe('formatWindSpeed', () => {
    it('should format wind speed in m/s', () => {
      expect(formatWindSpeed(5.5, 'metric')).toBe('5.5 m/s');
      expect(formatWindSpeed(0, 'metric')).toBe('0.0 m/s');
    });

    it('should format wind speed in mph (imperial input)', () => {
      expect(formatWindSpeed(10, 'imperial')).toBe('4.5 m/s');
    });

    it('should convert metric to mph', () => {
      expect(formatWindSpeed(10, 'metric', 'mph')).toBe('22.4 mph');
    });
  });

  describe('formatHumidity', () => {
    it('should format humidity percentage', () => {
      expect(formatHumidity(65)).toBe('65%');
      expect(formatHumidity(100)).toBe('100%');
      expect(formatHumidity(0)).toBe('0%');
    });
  });

  describe('formatPrecipitationProbability', () => {
    it('should format precipitation probability', () => {
      expect(formatPrecipitationProbability(0.75)).toBe('75%');
      expect(formatPrecipitationProbability(0)).toBe('0%');
      expect(formatPrecipitationProbability(1)).toBe('100%');
    });
  });

  describe('formatDate', () => {
    const timestamp = 1694313600; // 2023-09-10 00:00:00 UTC

    it('should format date in short format', () => {
      const result = formatDate(timestamp, 'short', 'ko-KR');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format date in long format', () => {
      const result = formatDate(timestamp, 'long', 'ko-KR');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format weekday', () => {
      const result = formatDate(timestamp, 'weekday', 'ko-KR');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('formatTime', () => {
    const timestamp = 1694313600; // 2023-09-10 00:00:00 UTC

    it('should format time', () => {
      const result = formatTime(timestamp);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getUviLevel', () => {
    it('should return correct UVI level for low values', () => {
      const result = getUviLevel(1);
      expect(result.levelKey).toBe('uvi.low');
      expect(result.color).toBe('bg-green-500');
    });

    it('should return correct UVI level for moderate values', () => {
      const result = getUviLevel(4);
      expect(result.levelKey).toBe('uvi.moderate');
      expect(result.color).toBe('bg-yellow-500');
    });

    it('should return correct UVI level for high values', () => {
      const result = getUviLevel(7);
      expect(result.levelKey).toBe('uvi.high');
      expect(result.color).toBe('bg-orange-500');
    });

    it('should return correct UVI level for very high values', () => {
      const result = getUviLevel(9);
      expect(result.levelKey).toBe('uvi.veryHigh');
      expect(result.color).toBe('bg-red-500');
    });

    it('should return correct UVI level for extreme values', () => {
      const result = getUviLevel(12);
      expect(result.levelKey).toBe('uvi.extreme');
      expect(result.color).toBe('bg-purple-600');
    });
  });

  describe('getWeatherIconUrl', () => {
    it('should generate correct URL for small icons', () => {
      const result = getWeatherIconUrl('01d', 'small');
      expect(result).toBe('https://openweathermap.org/img/wn/01d.png');
    });

    it('should generate correct URL for large icons', () => {
      const result = getWeatherIconUrl('01d', 'large');
      expect(result).toBe('https://openweathermap.org/img/wn/01d@4x.png');
    });

    it('should default to small size', () => {
      const result = getWeatherIconUrl('01d');
      expect(result).toBe('https://openweathermap.org/img/wn/01d.png');
    });
  });
});
