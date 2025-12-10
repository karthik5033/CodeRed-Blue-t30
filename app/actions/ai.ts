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
            You are an expert Frontend AI that builds React+Tailwind apps based on FLOWCHARTS.
    You will receive a compressed format called TOON:
    Nodes: id|type|label|x|y|color|description
    Edges: source|target|label

    THE DESCRIPTION FIELD IS CRITICAL. It contains user Specifications for that step.
    - If a node says "Login" and description says "Use Google Auth button only", you MUST Implement that.
    - If a node says "Dashboard" and description says "Show a line chart of sales", you MUST Implement exactly that.

    CRITICAL RULES:ABILITY: If the user asks to create, switch, or generate a flowchart/workflow, you MUST return a strict JSON object wrapped in \`\`\`json\`\`\` code block.
            - The JSON structure must be: { "nodes": [{ "id": "...", "type": "default", "position": { "x": 0, "y": 0 }, "data": { "label": "...", "color": "#...", "description": "DETAILED SPECS HERE" } }], "edges": [{ "id": "...", "source": "...", "target": "..." }] }.
            - **MANDATORY**: Every node MUST have a 'description' field in 'data' with FINE DETAILS (e.g., "Hero section with h1 text 'Welcome' and a CTA button").
            - **Granularity**: Break flows into detailed steps. Instead of just "Login", generate "Login Form" -> "Auth API" -> "Success Toast" -> "Redirect".
            - Keep node labels concise. Use vibrant colors (hex codes) for nodes.
            - Spread nodes out visually so they don't overlap (increase x/y coordinates significantly).
            `
        });

        // Convert history to Gemini format (ensure role is 'user' or 'model')
        const chat = model.startChat({
            history: history.map(h => ({
                role: h.role === 'ai' ? 'model' : h.role, // Handle 'ai' -> 'model' mapping just in case
                parts: [{ text: h.parts }]
            })),
            generationConfig: {
                maxOutputTokens: 8192,
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
    
    WORLD-CLASS DESIGN SYSTEM (MANDATORY):
    Your goal is to win a generic "Best UI of the Year" award.
    
    1. **Aesthetics (Linear/Vercel Style)**:
       - **Typography**: Use 'font-sans' (Inter). Use tight tracking ('tracking-tight') for headings.
       - **Colors**: Use sophisticated palettes. 
         - Light Mode: 'bg-white', 'text-slate-900', border 'border-slate-200'.
         - Accents: Use 'indigo-600' or 'violet-600' for primary actions.
       - **Shadows & Borders**: Use subtle, multi-layer shadows (e.g., 'shadow-sm', 'shadow-xl'). ADD BORDERS to almost everything ('border border-slate-100').
       - **Glassmorphism**: Use 'backdrop-blur-md' and 'bg-white/70' for sticky headers/overlays.
    
    2. **Layout & Spacing**:
       - **Bento Grids**: Use CSS Grid ('grid-cols-1 md:grid-cols-3 gap-4') for dashboard cards.
       - **Whitespace**: Be generous with padding ('p-6', 'p-8'). Don't cram content.
       - **Mobile-First**: Default to 'w-full' and 'flex-col'. Expand to 'flex-row' on 'md:' breakpoints.
       
    3. **Micro-Interactions (Framer Motion)**:
       - Animate ALL page transitions (opacity, y-shift).
       - Animate buttons on hover ('whileHover={{ scale: 1.02 }}').
       - Use 'AnimatePresence' for conditional rendering (modals, tabs).
       
    4. **Components**:
       - **Cards**: rounded-xl, border, bg-white, shadow-sm, hover:shadow-md transition-all.
       - **Inputs**: rounded-lg, border-slate-200, focus:ring-2 focus:ring-indigo-500/20.
       - **Buttons**: rounded-lg, font-medium, shadow-sm. Primary: bg-slate-900 text-white hover:bg-slate-800.
       
    5. **Content Realism**:
       - Do NOT use "Lorem Ipsum". Write real copy ("Welcome back, Karthik", "Revenue: $12,450").
       - Mock REAL data structures (arrays of objects) and render them.

    6. **Strict Description Adherence**:
       - If the TOON description says "Use red button", YOU MUST DO IT. 
       - Descriptions override these styles.
    
    7. **Stock Image Strategy (MANDATORY)**:
       - NEVER use colored divs for images. Use these High-Quality Unsplash URLs:
       - **Abstract/Tech**: 
         - "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
         - "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80"
         - "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80"
       - **People/Office**:
         - "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
         - "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
       - **Avatars**:
         - "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
         - "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
       - **Products**:
         - "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" (Headphones)
         - "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80" (Camera)

    8. **Interactive "Backend" Simulation**:
       - **Loading States**: All buttons must show a spinner ('animate-spin') for 1.5s when clicked.
       - **Toasts**: You MUST implement a custom 'Toast' component and show "Success" or "Error" messages after actions.
       - **Validation**: Forms must turn red if empty.
       
    SCENARIO SPECIFICS:
    - **Portfolio**: Large Hero Image (use Abstract/Tech), Bento Grid of 4 projects (use Product images), Contact Form with Toast.
    - **SaaS**: Sidebar Layout. Dashboard must show a "Revenue Chart" (rechart or CSS bars) and a "Team Members" list using Avatar images.
    - **E-commerce**: Product Grid using Product images. "Add to Cart" must show a "Added!" toast.
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
