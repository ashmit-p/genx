import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        pathname: '/f/**', // match all uploaded files
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/f/**',
      },{
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
