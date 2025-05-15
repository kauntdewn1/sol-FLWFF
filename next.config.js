/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    forceSwcTransforms: true,
  },
  serverExternalPackages: ['@web3auth/modal', '@web3auth/base'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      }
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
    prependData: `@import "scss/_solana-variables.scss";`,
  },
  // Configurações de segurança
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },
  // Configurações de otimização
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Configurações de cache
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Configurações de compressão
  compress: true,
  // Configurações de redirecionamento
  async redirects() {
    return [
      {
        source: '/news',
        destination: '/pt-BR/news',
        permanent: true,
      },
    ]
  },
  // Configurações de API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : '/api/:path*',
      },
    ]
  },
  // Configurações de webpack
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    // Aumenta o timeout para 60 segundos
    config.watchOptions = {
      ...config.watchOptions,
      aggregateTimeout: 60000,
    };
    return config;
  },
}

module.exports = nextConfig
