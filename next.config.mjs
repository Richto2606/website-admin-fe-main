/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_BASE_URL_API: "http://127.0.0.1:8000/api/v1",
    NEXT_BASE_URL: "http://127.0.0.1:8000",
    NEXT_API_KEY: "881182541952993820593968",
    NEXT_NODE_ENV: "development"
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'http', hostname: '127.0.0.1', port: '8000' }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
