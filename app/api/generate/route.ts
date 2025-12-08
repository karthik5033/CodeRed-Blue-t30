import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generatePagePrompt } from '@/lib/prompts';
import { optimizePrompt } from '@/lib/prompt-optimizer';
import { extractCodeFromResponse } from '@/lib/code-parser';

export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json();

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Check if API key is configured at runtime
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('GEMINI_API_KEY not found in environment variables');
            return NextResponse.json(
                { error: 'GEMINI_API_KEY not configured. Please add it to .env.local and restart the server' },
                { status: 500 }
            );
        }

        // Initialize Gemini client at runtime with the API key
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
            },
        });

        // Optimize prompt to reduce token usage
        const optimizedPrompt = optimizePrompt(prompt);

        // Generate the full prompt with system instructions
        const fullPrompt = generatePagePrompt(optimizedPrompt);

        // Create a streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Generate content with streaming
                    const result = await model.generateContentStream(fullPrompt);

                    let fullResponse = '';

                    // Stream the response
                    for await (const chunk of result.stream) {
                        const text = chunk.text();
                        fullResponse += text;

                        // Send chunk to client
                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify({ chunk: text })}\n\n`)
                        );
                    }

                    // Extract and validate code
                    const { code, language } = extractCodeFromResponse(fullResponse);

                    // Send final code
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({
                                done: true,
                                code,
                                language,
                                fullResponse
                            })}\n\n`
                        )
                    );

                    controller.close();
                } catch (error) {
                    console.error('Streaming error:', error);
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({
                                error: error instanceof Error ? error.message : 'Generation failed'
                            })}\n\n`
                        )
                    );
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
