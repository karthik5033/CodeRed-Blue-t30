"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEW_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export const generateChatResponse = async (history: { role: "user" | "model"; parts: string }[], message: string) => {
    if (!apiKey) {
        return "Error: GEMINI_API_KEY is not set in .env.local";
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            // System instruction to guide the AI to generate JSON for flows
            systemInstruction: `
            You are AvatarFlow AI, an assistant for a node-based editor.
            - Answer coding questions normally.
            - SPECIAL ABILITY: If the user asks to create, switch, or generate a flowchart/workflow, you MUST return a strict JSON object wrapped in \`\`\`json\`\`\` code block.
            - The JSON structure must be: { "nodes": [{ "id": "...", "type": "default", "position": { "x": 0, "y": 0 }, "data": { "label": "...", "color": "#..." } }], "edges": [{ "id": "...", "source": "...", "target": "..." }] }.
            - Keep node labels concise. Use vibrant colors (hex codes) for nodes if appropriate.
            - Spread nodes out visually so they don't overlap (increase x/y coordinates).
            `
        });

        // Convert history to Gemini format (ensure role is 'user' or 'model')
        const chat = model.startChat({
            history: history.map(h => ({
                role: h.role === 'ai' ? 'model' : h.role, // Handle 'ai' -> 'model' mapping just in case
                parts: [{ text: h.parts }]
            })),
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error("Gemini Chat Error:", error);
        if (!apiKey) return "Authentication fail: API Key missing.";
        return `AI Error: ${error.message}`;
    }
};

export const generateAppBoilerplate = async (flowData: any) => {
    if (!apiKey) {
        return "// Error: GEMINI_API_KEY is not set.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
    You are an expert React/Next.js developer.
    Analyze this workflow JSON and generate a single file Next.js component (using Tailwind CSS) that implements this logic.
    
    Flow Data: ${JSON.stringify(flowData, null, 2)}
    
    Context:
    - Nodes represent UI steps or logic.
    - Edges represent navigation or data flow.
    - Use standard 'lucide-react' icons where appropriate.
    - Make it look professional and modern.
    - Return ONLY the code, no markdown backticks.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Robust cleanup: removing backticks and language identifiers
        text = text.replace(/```(typescript|tsx|jsx|javascript|react)?/gi, "").replace(/```/g, "").trim();

        return text;
    } catch (error: any) {
        console.error("Gemini Generation Error:", error);
        return "// Error generating code. Please check server logs.";
    }
};
