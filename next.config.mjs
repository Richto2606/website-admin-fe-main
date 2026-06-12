/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // 💡 UBAH SEMUA KE URL PRODUKSI ANDA
    NEXT_PUBLIC_API_BASE_URL: "https://api.asramaputrakukar.my.id/api/v1",
    NEXT_PUBLIC_BASE_URL: "https://api.asramaputrakukar.my.id",
    NEXT_PUBLIC_API_KEY: "881182541952993820593968",
    NEXT_PUBLIC_NODE_ENV: "production" // Ubah ke production
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      // 💡 HAPUS/UBAH HOSTNAME 127.0.0.1 MENJADI DOMAIN API ANDA
      { protocol: 'https', hostname: 'api.asramaputrakukar.my.id' }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;