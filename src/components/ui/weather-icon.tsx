"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  /**
   * OpenWeatherMap 아이콘 코드
   */
  iconCode: string;
  /**
   * 아이콘 크기
   */
  size?: "small" | "medium" | "large";
  /**
   * 대체 텍스트
   */
  alt?: string;
  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * 최적화된 날씨 아이콘 컴포넌트
 * - Next.js Image 컴포넌트 사용으로 자동 최적화
 * - 적절한 크기별 설정
 * - 접근성을 위한 alt 텍스트 지원
 */
export const WeatherIcon = ({
  iconCode,
  size = "small",
  alt,
  className,
}: WeatherIconProps) => {
  const sizeConfig = {
    small: { width: 50, height: 50, quality: 75 },
    medium: { width: 75, height: 75, quality: 80 },
    large: { width: 100, height: 100, quality: 85 },
  };

  const config = sizeConfig[size];
  const sizeStr = size === "large" ? "@4x" : size === "medium" ? "@2x" : "";
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}${sizeStr}.png`;

  return (
    <Image
      src={iconUrl}
      alt={alt || "날씨 아이콘"}
      width={config.width}
      height={config.height}
      quality={config.quality}
      priority={size === "large"} // 메인 아이콘은 우선 로딩
      className={cn("object-contain", className)}
      sizes={`${config.width}px`}
      // 외부 이미지 도메인에 대한 최적화 설정
      unoptimized={false}
    />
  );
};


