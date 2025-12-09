# Pexels API Setup Instructions (FREE & INSTANT!)

## Why Pexels?
- ✅ **Instant approval** - no waiting!
- ✅ **Completely free** - no credit card needed
- ✅ **High-quality images** - similar to Unsplash
- ✅ **Contextual search** - get relevant images for your content

## Step 1: Get Your FREE Pexels API Key

1. Visit: **https://www.pexels.com/api/**
2. Click "Get Started" or "Sign Up"
3. Create a free account (takes 1 minute)
4. Your API key will be shown **immediately** - no waiting!

## Step 2: Add Your API Key

Open `.env.local` and add:

```bash
# Pexels API Configuration (FREE & INSTANT!)
PEXELS_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual Pexels API key.

## Step 3: Restart the Development Server

```bash
# Stop current server (Ctrl+C)
npm run dev -- -p 4000
```

## Step 4: Test It!

Generate a page with:
- "Create a landing page for a shoe store"
- "Create a tech company homepage"
- "Create a restaurant website"

Images will now be **contextually relevant** to your content!

## How It Works

The AI uses `/api/unsplash-image?query=shoes&width=1200&height=600` which now:
1. Searches **Pexels** for relevant images
2. Returns high-quality, contextual photos
3. Falls back to Picsum if Pexels isn't configured

## API Limits (Free Tier)

- **200 requests per hour**
- **20,000 requests per month**
- More than enough for development!

## Get Your Key Now

👉 **https://www.pexels.com/api/** 👈

Takes less than 2 minutes, no approval needed!
