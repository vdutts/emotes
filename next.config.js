/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aaah0mnbncqtinas.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
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
}

module.exports = nextConfig
