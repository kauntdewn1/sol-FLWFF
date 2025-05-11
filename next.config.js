const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    ...i18n,
    localeDetection: false,
  },
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  async redirects() {
    return [
      {
        source: '/news',
        destination: '/pt-BR/news',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
