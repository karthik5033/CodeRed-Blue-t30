import { NextResponse } from 'next/server';

const DID_API_URL = 'https://api.d-id.com';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.DID_API_KEY || process.env['D-ID_KEY'] || '';
        const authHeader = apiKey.startsWith('Basic ') ? apiKey : `Basic ${Buffer.from(apiKey).toString('base64')}`;
        const { streamId, sessionId, answer, sessionClientAnswer } = await req.json();

        if (!streamId || !sessionId || !answer || !sessionClientAnswer) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const response = await fetch(`${DID_API_URL}/talks/streams/${streamId}/sdp`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: sessionId,
                answer: answer,
                session_client_answer: sessionClientAnswer
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('D-ID Start Stream Error:', error);
            return NextResponse.json({ error: 'Failed to start stream', details: error }, { status: response.status });
        }

        // Usually returns 200 OK with no body or minimal status
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Start Stream Exception:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
