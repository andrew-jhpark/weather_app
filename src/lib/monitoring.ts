/**
 * 애플리케이션 모니터링 및 로깅 시스템
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, error } = entry;
    let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (context) {
      logMessage += ` | Context: ${JSON.stringify(context)}`;
    }
    
    if (error) {
      logMessage += ` | Error: ${error.message}`;
      if (error.stack) {
        logMessage += ` | Stack: ${error.stack}`;
      }
    }
    
    return logMessage;
  }
  
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    };
  }
  
  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    
    // 프로덕션에서는 warn과 error만 로깅
    return level === 'warn' || level === 'error';
  }
  
  debug(message: string, context?: Record<string, any>) {
    if (!this.shouldLog('debug')) return;
    
    const entry = this.createLogEntry('debug', message, context);
    console.debug(this.formatLog(entry));
  }
  
  info(message: string, context?: Record<string, any>) {
    if (!this.shouldLog('info')) return;
    
    const entry = this.createLogEntry('info', message, context);
    console.info(this.formatLog(entry));
  }
  
  warn(message: string, context?: Record<string, any>) {
    if (!this.shouldLog('warn')) return;
    
    const entry = this.createLogEntry('warn', message, context);
    console.warn(this.formatLog(entry));
  }
  
  error(message: string, error?: Error, context?: Record<string, any>) {
    if (!this.shouldLog('error')) return;
    
    const entry = this.createLogEntry('error', message, context, error);
    console.error(this.formatLog(entry));
    
    // 프로덕션에서는 외부 모니터링 서비스로 전송
    if (!this.isDevelopment) {
      this.sendToMonitoringService(entry);
    }
  }
  
  private sendToMonitoringService(entry: LogEntry) {
    // 실제 서비스에서는 Sentry, LogRocket, DataDog 등의 서비스로 전송
    // 여기서는 기본적인 구조만 제공
    try {
      // 예시: fetch를 통한 로그 전송
      // fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // });
    } catch (error) {
      console.error('Failed to send log to monitoring service:', error);
    }
  }
}

export const logger = new Logger();

/**
 * API 호출 성능 측정
 */
export class PerformanceMonitor {
  private static measurements: Map<string, number> = new Map();
  
  static startMeasurement(key: string) {
    this.measurements.set(key, performance.now());
  }
  
  static endMeasurement(key: string): number {
    const startTime = this.measurements.get(key);
    if (!startTime) {
      logger.warn(`Performance measurement not found for key: ${key}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.measurements.delete(key);
    
    logger.debug(`Performance: ${key} took ${duration.toFixed(2)}ms`);
    return duration;
  }
  
  static measureAsync<T>(key: string, asyncFn: () => Promise<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      this.startMeasurement(key);
      try {
        const result = await asyncFn();
        this.endMeasurement(key);
        resolve(result);
      } catch (error) {
        this.endMeasurement(key);
        reject(error);
      }
    });
  }
}

/**
 * 에러 경계 컴포넌트용 에러 리포터
 */
export function reportError(error: Error, errorInfo?: any) {
  logger.error('React Error Boundary caught an error', error, {
    errorInfo,
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
  });
}

/**
 * 사용자 행동 추적 (GDPR 준수)
 */
export function trackUserAction(action: string, context?: Record<string, any>) {
  // 개발 환경에서만 로깅
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`User Action: ${action}`, context);
  }
  
  // 프로덕션에서는 사용자 동의 후에만 추적
  // if (hasUserConsent() && isProduction()) {
  //   // 외부 분석 서비스로 전송
  // }
}

/**
 * API 응답 시간 및 에러율 모니터링
 */
export function monitorApiCall(endpoint: string, duration: number, success: boolean) {
  const context = {
    endpoint,
    duration: `${duration.toFixed(2)}ms`,
    success,
  };
  
  if (success) {
    logger.info(`API call successful: ${endpoint}`, context);
  } else {
    logger.warn(`API call failed: ${endpoint}`, context);
  }
  
  // 성능 임계값 체크
  if (duration > 5000) {
    logger.warn(`Slow API response: ${endpoint}`, context);
  }
}
