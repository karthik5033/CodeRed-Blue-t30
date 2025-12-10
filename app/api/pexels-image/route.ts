import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'nature';
    const width = searchParams.get('width') || '800';
    const height = searchParams.get('height') || '600';

    const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

    if (!PEXELS_API_KEY) {
        // Fallback to placeholder if no API key
        return NextResponse.redirect(`https://via.placeholder.com/${width}x${height}/6366f1/ffffff?text=${encodeURIComponent(query)}`);
    }

    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
            {
                headers: {
                    Authorization: PEXELS_API_KEY,
                },
            }
        );

        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
            const photo = data.photos[0];
            // Get the appropriate size or use original
            const imageUrl = photo.src.large2x || photo.src.large || photo.src.original;
            return NextResponse.redirect(imageUrl);
        } else {
            // No photos found, use placeholder
            return NextResponse.redirect(`https://via.placeholder.com/${width}x${height}/6366f1/ffffff?text=${encodeURIComponent(query)}`);
        }
    } catch (error) {
        console.error('Pexels API error:', error);
        // Fallback to placeholder on error
        return NextResponse.redirect(`https://via.placeholder.com/${width}x${height}/6366f1/ffffff?text=${encodeURIComponent(query)}`);
    }
}
