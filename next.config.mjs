import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // styled-components SSR 지원 (서버에서 스타일 추출 → FOUC 방지)
  compiler: {
    styledComponents: true,
  },

  // 정적 사이트로 내보내기 — GitHub Pages / Vercel 정적 호스팅에 그대로 배포.
  // 기존 puppeteer prerender 스크립트를 대체한다.
  output: 'export',
  trailingSlash: true,

  images: {
    // output:'export' 에서는 이미지 최적화 서버가 없으므로 비활성화
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // 상위 디렉터리의 lockfile을 워크스페이스 루트로 오인하지 않도록 고정
  outputFileTracingRoot: __dirname,

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    return config;
  },
};

export default nextConfig;
