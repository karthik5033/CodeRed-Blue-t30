import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'pexels';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query');
        const width = searchParams.get('width') || '800';
        const height = searchParams.get('height') || '600';

        if (!query) {
            return NextResponse.json(
                { error: 'Query parameter is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.PEXELS_API_KEY;

        // Debug logging
        console.log('PEXELS_API_KEY value:', apiKey ? `Found (${apiKey.substring(0, 10)}...)` : 'NOT FOUND');
        console.log('All env vars starting with PEXELS:', Object.keys(process.env).filter(k => k.startsWith('PEXELS')));

        if (!apiKey) {
            console.log('PEXELS_API_KEY not configured, using Picsum fallback');
            // Fallback to Picsum if Pexels not configured
            const picsumUrl = `https://picsum.photos/seed/${query}/${width}/${height}`;
            return NextResponse.redirect(picsumUrl);
        }

        const client = createClient(apiKey);

        const result = await client.photos.search({
            query,
            per_page: 1,
            orientation: parseInt(width) > parseInt(height) ? 'landscape' : 'portrait',
        });

        if ('error' in result) {
            console.error('Pexels API error:', result.error);
            return NextResponse.json(
                { error: 'Failed to fetch image from Pexels' },
                { status: 500 }
            );
        }

        if (!result.photos || result.photos.length === 0) {
            // No results, fallback to Picsum
            console.log(`No Pexels results for "${query}", using Picsum fallback`);
            const picsumUrl = `https://picsum.photos/seed/${query}/${width}/${height}`;
            return NextResponse.redirect(picsumUrl);
        }

        const photo = result.photos[0];

        // Get the best matching size or use original
        let imageUrl = photo.src.original;

        // Try to find a close match to requested dimensions
        if (photo.src.large2x) imageUrl = photo.src.large2x;
        else if (photo.src.large) imageUrl = photo.src.large;
        else if (photo.src.medium) imageUrl = photo.src.medium;

        // Add dimensions to URL if supported
        imageUrl = `${imageUrl}?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop`;

        // Redirect to the actual image URL
        return NextResponse.redirect(imageUrl);
    } catch (error) {
        console.error('Pexels API Error:', error);

        // Fallback to Picsum on any error
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || 'random';
        const width = searchParams.get('width') || '800';
        const height = searchParams.get('height') || '600';

        const picsumUrl = `https://picsum.photos/seed/${query}/${width}/${height}`;
        return NextResponse.redirect(picsumUrl);
    }
}
