import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.clerk.com",'res.cloudinary.com'], // Allow external images from img.clerk.com
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
