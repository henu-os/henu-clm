/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_STANDALONE === 'false' ? undefined : 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@henu/shared'],
};

export default nextConfig;
