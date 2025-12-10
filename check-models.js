const https = require('https');
const fs = require('fs');
const path = require('path');

// 1. Read .env.local manually to get key
const envPath = path.join(__dirname, '.env.local');
let apiKey = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/) || envContent.match(/NEW_GEMINI_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
        // Remove quotes if present
        if (apiKey.startsWith('"') && apiKey.endsWith('"')) apiKey = apiKey.slice(1, -1);
    }
} catch (e) {
    console.error("Could not read .env.local", e.message);
}

if (!apiKey) {
    console.error("No API KEY found in .env.local");
    process.exit(1);
}

console.log(`Checking models for API Key ending in ...${apiKey.slice(-4)}`);

// 2. Call the ListModels API Endpoint directly
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", json.error);
            } else if (json.models) {
                console.log("--- AVAILABLE MODELS ---");
                json.models.forEach(m => {
                    if (m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${m.name.replace('models/', '')}`);
                    }
                });
            } else {
                console.log("Unexpected response:", json);
            }
        } catch (e) {
            console.error("Failed to parse response:", data);
        }
    });
}).on('error', (e) => {
    console.error("Request failed:", e.message);
});
