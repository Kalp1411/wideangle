/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.1.113',
        port: '3001',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;