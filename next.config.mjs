/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://localhost:${process.env.PORT || 3000}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `http://localhost:${process.env.PORT || 3000}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;

