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
    Analyze this workflow JSON and generate a single file React component (using Tailwind CSS) that implements this logic.
    
    Flow Data: ${JSON.stringify(flowData, null, 2)}
    
    CRITICAL RULES:
    1. Return ONLY the code.
    2. Do NOT import custom components. Define everything (Buttons, Cards, Navbar) inside this file.
    3. Use 'lucide-react' for icons.
    4. Use standard HTML/Tailwind classes.
    5. The default export must be named 'App'.
    6. Wrap the code in \`\`\`tsx\`\`\`.
    
    PREMIUM UI & LOGIC INSTRUCTIONS:
    - **Visual Style**: Modern SaaS, clean, "Inter" font, rounded-xl, subtle borders, soft shadows, gradients. Use 'framer-motion' for simple entrance animations.
    - **Structure**: If the flow implies multiple screens (e.g., Home -> Dashboard), use 'react-router-dom' (HashRouter) to implement real navigation.
    - **"Backend"**: Since this is a demo, MOCK all API calls. Use 'useState' and 'useEffect' with 'setTimeout' to simulate data fetching (loading states).
    - **Responsiveness**: **MOBILE-FIRST DESIGN**. The preview is often a narrow sidebar (400px width). 
       - Use 'w-full', 'max-w-full'. 
       - Avoid large headers (e.g. use 'text-3xl' max, not 'text-6xl'). 
       - Use 'flex-col' by default for layouts, switch to 'md:flex-row' only on larger generic widths.
    - **Content**: Do not leave pages empty. Generate realistic placeholder content (charts, lists, text) relevant to the flow.
    
    SCENARIO MAPPING:
    - Flow = "Portfolio" -> Generate a Multi-Section Landing Page (Hero, Projects, Bio, Contact) with smooth scrolling.
    - Flow = "SaaS" -> Generate a Landing Page + Dashboard Login + Dashboard View.
    - Flow = "E-commerce" -> Generate a Product Grid + Cart + Checkout Flow.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Raw Output:", text);

        // Regex to extract code block
        const match = text.match(/```(?:typescript|tsx|jsx|javascript|react)?([\s\S]*?)```/i);

        if (match && match[1]) {
            return match[1].trim();
        }

        // Fallback: mostly clean raw text if no block found
        return text.replace(/```(typescript|tsx|jsx|javascript|react)?/gi, "").replace(/```/g, "").trim();

    } catch (error: any) {
        console.error("Gemini Generation Error:", error);
        return "// Error generating code. Please check server logs.";
    }
};
