/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Turbopack is not supported on this platform; use Webpack for dev
  devIndicators: false,
}

export default nextConfig
