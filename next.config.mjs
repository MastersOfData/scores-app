import withPWA from "next-pwa"
import runtimeCaching from "next-pwa/cache.js"

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
}

const isProduction = process.env.NODE_ENV === 'production'

const pwaConfig = withPWA({
  dest: "public",
  runtimeCaching,
  disable: !isProduction
})(nextConfig)

export default pwaConfig
