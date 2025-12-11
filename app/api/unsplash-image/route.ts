import { NextRequest, NextResponse } from 'next/server';
import { createApi } from 'unsplash-js';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || searchParams.get('q');
        const width = searchParams.get('width') || '800';
        const height = searchParams.get('height') || '600';

        if (!query) {
            return NextResponse.json(
                { error: 'Query parameter is required' },
                { status: 400 }
            );
        }

        const accessKey = process.env.UNSPLASH_ACCESS_KEY;

        // Debug logging
        console.log('UNSPLASH_ACCESS_KEY value:', accessKey ? `Found (${accessKey.substring(0, 10)}...)` : 'NOT FOUND');
        console.log('All env vars starting with UNSPLASH:', Object.keys(process.env).filter(k => k.startsWith('UNSPLASH')));

        if (!accessKey) {
            console.log('UNSPLASH_ACCESS_KEY not configured, using Picsum fallback');
            // Fallback to Picsum if Unsplash not configured
            const picsumUrl = `https://picsum.photos/seed/${query}/${width}/${height}`;
            return NextResponse.redirect(picsumUrl);
        }

        console.log(`Searching Unsplash for: "${query}"`);

        const unsplash = createApi({
            accessKey: accessKey,
        });

        // Enhanced search with better parameters for relevance
        const result = await unsplash.search.getPhotos({
            query,
            perPage: 5, // Get top 5 results to choose the best one
            orientation: parseInt(width) > parseInt(height) ? 'landscape' : 'portrait',
            orderBy: 'relevant', // Order by relevance, not latest
        });

        console.log(`Unsplash results count: ${result.response?.results?.length || 0}`);

        if (result.errors) {
            console.error('Unsplash API error:', result.errors);
            const picsumUrl = `https://picsum.photos/seed/${query}/${width}/${height}`;
            return NextResponse.redirect(picsumUrl);
        }

        if (!result.response || !result.response.results || result.response.results.length === 0) {
            // No results, fallback to Picsum
            console.log(`No Unsplash results for "${query}", using Picsum fallback`);
            const picsumUrl = `https://picsum.photos/seed/${query}/${width}/${height}`;
            return NextResponse.redirect(picsumUrl);
        }

        // Pick the first result (already sorted by relevance from Unsplash)
        const photo = result.response.results[0];

        console.log(`Selected photo: ${photo.id}, alt: "${photo.alt_description || photo.description || query}"`);

        // Get the best matching size URL
        let imageUrl = photo.urls.regular;

        // Use custom dimensions if available
        if (photo.urls.raw) {
            imageUrl = `${photo.urls.raw}&w=${width}&h=${height}&fit=crop&auto=format&q=80`;
        }

        console.log(`Redirecting to: ${imageUrl.substring(0, 100)}...`);

        // Redirect to the actual image URL
        return NextResponse.redirect(imageUrl);
    } catch (error) {
        console.error('Unsplash API Error:', error);

        // Fallback to Picsum on any error
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || searchParams.get('q') || 'random';
        const width = searchParams.get('width') || '800';
        const height = searchParams.get('height') || '600';

        const picsumUrl = `https://picsum.photos/seed/${query}/${width}/${height}`;
        return NextResponse.redirect(picsumUrl);
    }
}
