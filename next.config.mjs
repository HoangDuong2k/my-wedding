/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // All images are served from /public, so the image optimizer accepts no remote hosts
  images: {
    qualities: [75, 85, 90, 100],
  },
};

export default nextConfig;
