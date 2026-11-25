/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // The six short area addresses were duplicate copies of the chauffeur-… pages (separate records
  // that went stale). Send visitors and search engines to the real page.
  async redirects() {
    return ["solihull", "coventry", "leamington-spa", "warwick", "worcester", "cheltenham"].map((name) => ({
      source: `/service-areas/${name}`,
      destination: `/service-areas/chauffeur-${name}`,
      permanent: true,
    }));
  },
  // No /api or /uploads rewrites: server.ts (Express) answers those before Next.js sees the request.
  // A rewrite here would bake the build machine's port into the build and break /api/revalidate.
};

export default nextConfig;

