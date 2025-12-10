import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const apiKey = process.env.NEW_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("NO API KEY FOUND IN .env.local");
    process.exit(1);
}

console.log("Using API Key (last 4 chars):", apiKey.slice(-4));

const genAI = new GoogleGenerativeAI(apiKey);

async function list() {
    try {
        // Attempt to run a basic prompt on gemini-pro to test access
        console.log("Testing gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("Success! Response:", result.response.text());
    } catch (e) {
        console.error("gemini-pro failed:", e.message);
    }

    try {
        console.log("Testing gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("Success! Response:", result.response.text());
    } catch (e) {
        console.error("gemini-1.5-flash failed:", e.message);
    }
}

list();
