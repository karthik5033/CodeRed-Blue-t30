import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateCustomizationPrompt, generateModificationPrompt } from '@/lib/prompts';
import { extractCodeFromResponse } from '@/lib/code-parser';

export async function POST(request: NextRequest) {
    try {
        const { code, modification, customizations } = await request.json();

        if (!code || typeof code !== 'string') {
            return NextResponse.json(
                { error: 'Code is required' },
                { status: 400 }
            );
        }

        // Check if API key is configured at runtime
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY not configured' },
                { status: 500 }
            );
        }

        // Initialize Gemini client at runtime
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

        // Generate prompt based on type of modification
        let prompt: string;
        if (customizations) {
            prompt = generateCustomizationPrompt(code, customizations);
        } else if (modification) {
            prompt = generateModificationPrompt(code, modification);
        } else {
            return NextResponse.json(
                { error: 'Either modification or customizations is required' },
                { status: 400 }
            );
        }

        // Generate modified code
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Extract code from response
        const { code: modifiedCode, language } = extractCodeFromResponse(response);

        return NextResponse.json({
            code: modifiedCode,
            language,
            original: code,
        });
    } catch (error) {
        console.error('Modification API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Modification failed' },
            { status: 500 }
        );
    }
}
