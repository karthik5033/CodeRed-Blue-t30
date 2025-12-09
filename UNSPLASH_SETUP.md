# Unsplash API Setup Instructions

## Step 1: Add Your API Keys

Open the file `.env.local` in your project root and add these lines:

```bash
# Unsplash API Configuration
UNSPLASH_ACCESS_KEY=your_access_key_here
UNSPLASH_SECRET_KEY=your_secret_key_here
```

Replace `your_access_key_here` and `your_secret_key_here` with your actual Unsplash API keys.

## Step 2: Restart the Development Server

After adding the keys, restart your dev server:

1. Stop the current server (Ctrl+C in the terminal)
2. Run: `npm run dev -- -p 4000`

## Step 3: Test It!

Generate a new page with a prompt like:
- "Create a landing page for a shoe store"
- "Create a tech company homepage"
- "Create a restaurant website"

The images will now be contextually relevant to your content!

## How It Works

The AI now uses `/api/unsplash-image?query=shoes&width=1200&height=600` which:
1. Searches Unsplash for relevant images based on the query
2. Returns the first matching image
3. Falls back to Picsum if Unsplash isn't configured or fails

## Where to Get Unsplash API Keys

Visit: https://unsplash.com/developers
1. Create a developer account (free)
2. Create a new application
3. Copy your Access Key and Secret Key
