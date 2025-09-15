/**
 * 성능 측정 및 최적화 유틸리티
 */
import { useEffect } from 'react';

// Web Vitals 측정을 위한 타입 정의
export interface WebVitalsMetric {
  name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB';
  value: number;
  delta: number;
  id: string;
  navigationType: 'navigate' | 'reload' | 'back_forward' | 'prerender';
}

/**
 * Core Web Vitals 측정 및 로깅
 */
export function measureWebVitals(metric: WebVitalsMetric) {
  // 개발 환경에서만 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 ${metric.name}: ${metric.value}ms`);
  }

  // 성능 임계값 체크
  const thresholds = {
    FCP: 1800, // First Contentful Paint
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay
    CLS: 0.1,  // Cumulative Layout Shift
    TTFB: 600, // Time to First Byte
  };

  const threshold = thresholds[metric.name];
  const isGood = metric.value <= threshold;

  if (!isGood) {
    console.warn(`⚠️ ${metric.name} exceeded threshold: ${metric.value} > ${threshold}`);
  }

  // 프로덕션에서는 분석 서비스로 전송
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics 4 또는 다른 분석 서비스로 전송
    // gtag('event', 'web_vitals', {
    //   event_category: 'Web Vitals',
    //   event_label: metric.name,
    //   value: Math.round(metric.value),
    //   non_interaction: true,
    // });
  }
}

/**
 * 컴포넌트 렌더링 성능 측정
 */
export class ComponentPerformanceTracker {
  private static renderTimes = new Map<string, number>();

  static startRender(componentName: string) {
    this.renderTimes.set(componentName, performance.now());
  }

  static endRender(componentName: string) {
    const startTime = this.renderTimes.get(componentName);
    if (startTime) {
      const renderTime = performance.now() - startTime;
      this.renderTimes.delete(componentName);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }

      // 느린 렌더링 감지 (16ms는 60fps 기준)
      if (renderTime > 16) {
        console.warn(`🐌 Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
      }

      return renderTime;
    }
    return 0;
  }
}

/**
 * API 응답 시간 측정
 */
export class ApiPerformanceTracker {
  private static requestTimes = new Map<string, number>();

  static startRequest(endpoint: string, requestId?: string) {
    const key = requestId ? `${endpoint}-${requestId}` : endpoint;
    this.requestTimes.set(key, performance.now());
  }

  static endRequest(endpoint: string, success: boolean, requestId?: string) {
    const key = requestId ? `${endpoint}-${requestId}` : endpoint;
    const startTime = this.requestTimes.get(key);
    
    if (startTime) {
      const responseTime = performance.now() - startTime;
      this.requestTimes.delete(key);

      if (process.env.NODE_ENV === 'development') {
        const status = success ? '✅' : '❌';
        console.log(`${status} API ${endpoint}: ${responseTime.toFixed(2)}ms`);
      }

      // 느린 API 응답 감지
      if (responseTime > 3000) {
        console.warn(`🐌 Slow API response: ${endpoint} took ${responseTime.toFixed(2)}ms`);
      }

      return responseTime;
    }
    return 0;
  }
}

/**
 * 메모리 사용량 모니터링
 */
export function checkMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    const used = memory.usedJSHeapSize / 1024 / 1024;
    const total = memory.totalJSHeapSize / 1024 / 1024;
    const limit = memory.jsHeapSizeLimit / 1024 / 1024;

    if (process.env.NODE_ENV === 'development') {
      console.log(`🧠 Memory: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB (limit: ${limit.toFixed(2)}MB)`);
    }

    // 메모리 사용량이 80%를 초과하면 경고
    if (used / limit > 0.8) {
      console.warn(`⚠️ High memory usage: ${((used / limit) * 100).toFixed(1)}%`);
    }

    return { used, total, limit };
  }
  
  return null;
}

/**
 * 성능 프로파일링을 위한 데코레이터 함수
 */
export function withPerformanceTracking<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    const startTime = performance.now();
    const result = fn(...args);
    const endTime = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${name}: ${(endTime - startTime).toFixed(2)}ms`);
    }
    
    return result;
  }) as T;
}

/**
 * React 컴포넌트용 성능 측정 훅
 */
export function usePerformanceTracking(componentName: string) {
  useEffect(() => {
    ComponentPerformanceTracker.startRender(componentName);
    return () => {
      ComponentPerformanceTracker.endRender(componentName);
    };
  });
}
