/**
 * Prompt engineering templates for Next.js component generation
 */

export const SYSTEM_PROMPT = `You are an expert web developer. Generate clean, modern, production-ready code.

RULES:
1. Generate STATIC HTML with Tailwind CSS (not React/JSX)
2. Use Tailwind CSS for all styling
3. Use SVG icons or emoji (no icon libraries needed)
4. Make components responsive and accessible
5. Use modern design patterns (gradients, shadows, animations)
6. Return ONLY the HTML code, no explanations
7. Code should work directly in a browser
8. DO NOT use any JavaScript frameworks or libraries
9. Use inline Tailwind classes for styling

OUTPUT FORMAT:
\`\`\`html
<!-- Your complete HTML here -->
\`\`\``;

export function generatePagePrompt(userRequest) {
    return `${SYSTEM_PROMPT}

USER REQUEST: ${userRequest}

Generate a complete HTML page that fulfills this request. Include:
- Semantic HTML5 elements
- Tailwind CSS classes for styling (will be loaded via CDN)
- Responsive design
- Modern, beautiful UI
- Use emojis or SVG for icons (no icon libraries)

Return only the HTML code (just the body content, no <html>, <head>, or <body> tags).`;
}

export function generateModificationPrompt(existingCode, modification) {
    return `${SYSTEM_PROMPT}

EXISTING CODE:
\`\`\`html
${existingCode}
\`\`\`

MODIFICATION REQUEST: ${modification}

Modify the HTML according to the request. Return the complete updated HTML code.`;
}

export function generateCustomizationPrompt(existingCode, customizations) {
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
