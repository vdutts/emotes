export const PROD_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://emotesy.vercel.app"
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : process.env.NGROK_URL || PROD_URL)
export const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || "#"

export const SITEMAP_PAGE_SIZE = 50_000

export const EMOJI_SIZE = 768
export const DEFAULT_OG_IMAGE = ""
export const FEATURED_OG_IMAGES: string[] = []
