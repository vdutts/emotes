const { withAxiom } = require("next-axiom")

/** @type {import('next').NextConfig} */
const nextConfig = withAxiom({
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["aaah0mnbncqtinas.public.blob.vercel-storage.com"],
    unoptimized: true,
  },
  rewrites: async () => [
    {
      source: "/privacy",
      destination: `${process.env.NEXT_PUBLIC_API_URL || "https://api.yourdomain.com"}/assets/privacy`,
      basePath: false,
    },
    {
      source: "/terms",
      destination: `${process.env.NEXT_PUBLIC_API_URL || "https://api.yourdomain.com"}/assets/terms`,
      basePath: false,
    },
  ],
})

module.exports = nextConfig
