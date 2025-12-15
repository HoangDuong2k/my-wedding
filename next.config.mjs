/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "**", // Cho phép mọi domain
    //   },
    //   {
    //     protocol: "http",
    //     hostname: "**",
    //   },
    // ],
    // domains: ["nguyenthachuy.io.vn"],
  },
};

export default nextConfig;
