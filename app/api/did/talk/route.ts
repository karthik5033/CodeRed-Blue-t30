import { NextResponse } from 'next/server';

const DID_API_URL = 'https://api.d-id.com';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.DID_API_KEY || process.env['D-ID_KEY'] || '';
        const authHeader = apiKey.startsWith('Basic ') ? apiKey : `Basic ${Buffer.from(apiKey).toString('base64')}`;
        const { streamId, sessionId, text } = await req.json();

        if (!streamId || !sessionId || !text) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const response = await fetch(`${DID_API_URL}/talks/streams/${streamId}`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                script: {
                    type: 'text',
                    subtitles: 'false',
                    provider: { type: 'microsoft', voice_id: 'en-US-JennyNeural' },
                    ssml: 'false',
                    input: text
                },
                session_id: sessionId
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('D-ID Talk Error:', error);
            return NextResponse.json({ error: 'Failed to send talk request', details: error }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Talk Exception:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
