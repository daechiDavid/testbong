/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Firebase App Hosting 빌드 시 ESLint 통과 처리
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
