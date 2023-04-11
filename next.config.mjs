import withPWA from "next-pwa"
import runtimeCaching from "next-pwa/cache.js"

/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    appDir: true
  },
}

const isProduction = process.env.NODE_ENV === 'production'

const nextConfig = withPWA({
  dest: "public",
  runtimeCaching,
  disable: !isProduction
})(config)

export default nextConfig
