import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'sistema.innovaimobiliaria.com.br',
      },
      {
        protocol: 'https',
        hostname: 'sandbox.properfy.com.br',
      },
    ],
  },
};

export default nextConfig;
