# Free Deployment Guide

## Quick Deploy (No Credit Card Required)

### 1. Deploy to Vercel
```bash
npx vercel
```

### 2. Set ONLY These Required Variables in Vercel:

```bash
# Database (Choose ONE free option):
DATABASE_URL=postgresql://... # From Neon.tech or Vercel Postgres

# AI Generation (Free credits):
REPLICATE_API_TOKEN=r8_... # From replicate.com

# Security:
WEBHOOK_SECRET=any_random_32_character_string

# White Label (Optional):
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
NEXT_PUBLIC_SITE_NAME=My Emoji App
```

### 3. Free Service Setup:

#### Database - Neon (Recommended, 100% Free)
1. Go to https://neon.tech
2. Sign up (no credit card)
3. Create database
4. Copy connection string to `DATABASE_URL`

#### AI - Replicate (Free Credits)
1. Go to https://replicate.com
2. Sign up (no credit card for initial credits)
3. Get API token from account settings
4. Copy to `REPLICATE_API_TOKEN`

#### Optional - Disable Paid Features:
- Vercel Blob: Comment out image storage (use Cloudinary free tier)
- Vercel KV: Comment out rate limiting temporarily
- Axiom: Comment out analytics

### 4. Deploy:
```bash
vercel --prod
```

## What You Can Skip Initially:
- ❌ Vercel Blob (image storage) - use Cloudinary free
- ❌ Vercel KV (rate limiting) - disable temporarily
- ❌ Axiom (analytics) - disable temporarily
- ✅ Database - REQUIRED (use Neon free)
- ✅ Replicate - REQUIRED (has free credits)
