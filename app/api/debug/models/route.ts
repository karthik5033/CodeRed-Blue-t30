import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
    try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.NEW_GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'No API Key found' }, { status: 500 });
        }

        // We can't list models easily with the high-level SDK in some versions, 
        // but we can try a direct fetch to the API to be sure.
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data.models) {
            return NextResponse.json({ error: 'Failed to list models', raw: data }, { status: 400 });
        }

        const modelNames = data.models.map((m: any) => m.name);
        return NextResponse.json({
            success: true,
            available_models: modelNames,
            key_preview: apiKey.substring(0, 5) + '...'
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
