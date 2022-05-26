/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_PATH + '/:path*' // Proxy to Backend
      }
    ]
  }
}

module.exports = nextConfig
