const config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337',
  defaultLocale: 'pt-BR',
  locales: ['pt-BR', 'en'],
  postsPerPage: 9,
  revalidateTime: 60, // 1 minute
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID,
  siteMetadata: {
    title: 'Solana Community',
    description: 'Comunidade oficial da Solana no Brasil',
    author: '@solana',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    image: '/images/og-image.jpg',
    twitterUsername: '@solana',
  },
  theme: {
    colors: {
      primary: '#9945FF',
      secondary: '#14F195',
      background: '#000000',
      foreground: '#FFFFFF',
      'background-secondary': '#1A1A1A',
      'foreground-secondary': '#A0A0A0',
      border: '#333333',
    },
  },
};

export default config; 