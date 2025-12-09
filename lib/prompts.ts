/**
 * Prompt engineering templates for Next.js component generation
 */

/**
 * Detects page types from user prompt
 */
function detectPages(prompt: string): { pages: string[]; hasMultiplePages: boolean } {
    const lowerPrompt = prompt.toLowerCase();

    const pageKeywords = {
        landing: ['landing', 'home', 'homepage', 'main page'],
        login: ['login', 'sign in', 'signin'],
        signup: ['signup', 'sign up', 'register', 'registration'],
        dashboard: ['dashboard', 'admin panel', 'control panel'],
        profile: ['profile', 'user profile', 'account'],
        contact: ['contact', 'contact us', 'get in touch'],
        about: ['about', 'about us'],
        pricing: ['pricing', 'plans', 'subscription'],
    };

    const detectedPages: string[] = [];

    for (const [pageName, keywords] of Object.entries(pageKeywords)) {
        if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
            detectedPages.push(pageName);
        }
    }

    // If no specific pages detected, default to single page
    if (detectedPages.length === 0) {
        detectedPages.push('index');
    }

    return {
        pages: detectedPages,
        hasMultiplePages: detectedPages.length > 1,
    };
}

export const SYSTEM_PROMPT = `You are an expert web developer. Generate clean, modern, production-ready code with proper file structure.

RULES:
1. Generate SEPARATE files for HTML, CSS, and JavaScript
2. Use Tailwind CSS (loaded via CDN) for styling
3. For images, use our internal Unsplash API endpoint ONLY when images add value:
   - Format: /api/unsplash-image?query=[search-terms]&width=[width]&height=[height]
   - USE IMAGES FOR: Hero sections, product showcases, galleries, portfolios, team pages
   - DON'T USE IMAGES FOR: Login pages, signup forms, contact forms, simple dashboards
   - IMPORTANT: Match search terms to the page content/business type
   - Examples:
     * Shoe store hero: /api/unsplash-image?query=shoes&width=1200&height=600
     * Tech product: /api/unsplash-image?query=technology&width=800&height=600
     * Restaurant food: /api/unsplash-image?query=food&width=800&height=600
     * Fashion clothing: /api/unsplash-image?query=fashion&width=800&height=600
     * Fitness gym: /api/unsplash-image?query=fitness&width=800&height=600
     * Team/people: /api/unsplash-image?query=business-team&width=400&height=400
   - Use descriptive, specific search terms for best results
   - Fallback: For placeholders use https://via.placeholder.com/800x600/6366f1/ffffff?text=Image
4. Make components responsive and accessible
5. Use modern design patterns (gradients, shadows, animations)
6. Return code in separate code blocks with file names
7. Ensure proper linking between files
8. NEVER use relative image paths like ./image.jpg or /images/photo.jpg
9. ONLY use the /api/unsplash-image endpoint when images are necessary
10. MATCH image search queries to the specific content/business type

OUTPUT FORMAT:
\`\`\`html:filename.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="img-src * data: blob: 'unsafe-inline';">
  <title>Page Title</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <!-- Your HTML content here -->
  <!-- Example for a shoe store: -->
  <!-- <img src="/api/unsplash-image?query=shoes&width=1200&height=600" alt="Shoes"> -->
  <!-- Example for tech company: -->
  <!-- <img src="/api/unsplash-image?query=technology&width=800&height=600" alt="Technology"> -->
</body>
</html>
\`\`\`

\`\`\`css:style.css
/* Your custom CSS here */
\`\`\`

\`\`\`javascript:script.js
// Your JavaScript here
\`\`\``;


export function generatePagePrompt(userRequest: string) {
    const pageDetection = detectPages(userRequest);

    let pageInstructions = '';
    if (pageDetection.hasMultiplePages) {
        pageInstructions = `
Generate ${pageDetection.pages.length} separate HTML pages: ${pageDetection.pages.map(p => `${p}.html`).join(', ')}
Each page should have its own HTML file, but they should share common CSS and JS files.
`;
    } else {
        pageInstructions = `
Generate a single page called index.html.
`;
    }

    return `${SYSTEM_PROMPT}

USER REQUEST: ${userRequest}

${pageInstructions}

Generate complete files that fulfill this request. Include:
- Semantic HTML5 elements
- Tailwind CSS classes for styling (loaded via CDN)
- Custom CSS in style.css for additional styling
- JavaScript in script.js for interactivity
- Responsive design (mobile, tablet, desktop)
- Modern, beautiful UI with smooth animations
- CRITICAL: Use /api/unsplash-image endpoint for CONTEXTUALLY RELEVANT images:
  * Format: /api/unsplash-image?query=[search-term]&width=[w]&height=[h]
  * Match query to content (shoes, technology, food, fashion, fitness, etc.)
  * Examples: query=shoes&width=1200&height=600
  * ALWAYS use specific, relevant search terms for the business type
- Proper meta tags including CSP for images

Return each file in a separate code block with the filename specified.`;
}


export function generateModificationPrompt(existingCode: string, modification: string) {
    return `${SYSTEM_PROMPT}

EXISTING CODE:
\`\`\`html
${existingCode}
\`\`\`

MODIFICATION REQUEST: ${modification}

Modify the code according to the request. Return the complete updated code in the same multi-file format (HTML, CSS, JS in separate code blocks with filenames).`;
}

export function generateCustomizationPrompt(existingCode: string, customizations: any) {
    const changes = [];

    if (customizations.icon) {
        changes.push(`Update icons/emojis to match theme: ${customizations.icon}`);
    }
    if (customizations.color) {
        changes.push(`Update color scheme to: ${customizations.color} (use Tailwind color classes like bg-${customizations.color}-500, text-${customizations.color}-600, etc.)`);
    }
    if (customizations.buttonStyle) {
        changes.push(`Change button style to: ${customizations.buttonStyle}`);
    }

    return generateModificationPrompt(
        existingCode,
        `Apply these customizations:\n${changes.join('\n')}`
    );
}
