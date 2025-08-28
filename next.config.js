/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.idntimes.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-image.hipwee.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.jakpost.net',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'asset.kompas.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn1.gstatic.com',
        port: '',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;