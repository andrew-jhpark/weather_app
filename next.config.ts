import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 프로덕션 최적화
  poweredByHeader: false,
  compress: true,
  
  // ESLint 설정 (프로덕션 빌드 시)
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  
  // TypeScript 설정
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  // 이미지 최적화 설정
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
        pathname: "/img/wn/**",
      },
    ],
    formats: ['image/webp', 'image/avif'], // 최신 이미지 포맷 사용
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24시간 캐시
  },
  
  // 실험적 기능
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // 번들 분석기 설정 (개발 시에만)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: Record<string, unknown>) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer')();
      (config.plugins as unknown[]).push(new BundleAnalyzerPlugin());
      return config;
    },
  }),
  
  // 캐싱 및 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=300, stale-while-revalidate=86400', // API 응답 5분 캐시
          },
        ],
      },
    ];
  },
};

export default nextConfig;
