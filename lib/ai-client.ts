import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI client
const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey && typeof window === 'undefined') {
    console.warn('GEMINI_API_KEY is not set in environment variables');
}

export const genAI = new GoogleGenerativeAI(apiKey);

// Use Gemini Flash 2.0 for fast, free code generation
export const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
    },
});

export type AIResponse = {
    code: string;
    language: string;
    description?: string;
};
