import { NextResponse } from 'next/server';

const DID_API_URL = 'https://api.d-id.com';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.DID_API_KEY || process.env['D-ID_KEY'];

        if (!apiKey) {
            return NextResponse.json({ error: 'Missing DID_API_KEY' }, { status: 500 });
        }

        const authHeader = apiKey.startsWith('Basic ') ? apiKey : `Basic ${Buffer.from(apiKey).toString('base64')}`;

        // 1. Create a new stream
        // We use a stock avatar for now. In a real app, this could be dynamic.
        // source_url: Default image provided by D-ID or a user uploaded one.
        // For this demo, let's use a standard D-ID presenter or allow passing one.

        const body = await req.json().catch(() => ({}));
        const sourceUrl = body.sourceUrl || "https://clips-presenters.d-id.com/amy/image.png";

        const response = await fetch(`${DID_API_URL}/talks/streams`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source_url: sourceUrl,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('D-ID Create Stream Error:', error);
            return NextResponse.json({ error: 'Failed to create stream', details: error }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Create Stream Exception:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
