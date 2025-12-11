/**
 * Convert visual design to AI prompt for code generation
 */

import { Page, VisualElement } from '../visual-builder-types';

export function convertVisualDesignToPrompt(page: Page): string {
    const elementsDescription = page.elements.map(describeElement).join('\n\n');

    return `You are a senior full-stack web developer. Generate clean, production-ready HTML, CSS, and JavaScript code based on this visual page design.

## Page Information
- Page Name: ${page.name}
- Total Elements: ${page.elements.length}

## Design Elements
${elementsDescription}

## Requirements

1. **HTML Structure:**
   - Use semantic HTML5
   - Include proper DOCTYPE, meta tags, and title
   - Link to Tailwind CSS CDN
   - Create a clean, well-structured layout
   - Use the exact positioning and styling specified

2. **CSS (style.css):**
   - Modern, clean CSS
   - Use CSS Grid/Flexbox for layouts
   - Include responsive design
   - Add smooth transitions and hover effects
   - Make it visually premium and beautiful

3. **JavaScript (script.js):**
   - Add interactivity for interactive elements (modals, dropdowns, etc.)
   - Include smooth animations
   - Add form validation if forms are present
   - Use modern ES6+ syntax

## Output Format

Provide EXACTLY three code blocks:

\`\`\`html
<!-- Complete HTML with inline Tailwind CSS -->
\`\`\`

\`\`\`css
/* Additional custom CSS styles */
\`\`\`

\`\`\`javascript
// JavaScript for interactivity
\`\`\`

IMPORTANT: 
- Respect the exact positioning (x, y coordinates) of elements
- Apply all specified styles exactly as described
- Use the /api/pexels-image proxy for ALL images
- Make the design premium and professional
- Ensure all interactive elements work properly
`;
}

function describeElement(element: VisualElement): string {
    let description = `### ${element.type.toUpperCase()} Element (ID: ${element.id})

**Position:** x=${element.position.x}px, y=${element.position.y}px
**Size:** width=${element.size.width}, height=${element.size.height}
`;

    // Add properties
    if (Object.keys(element.properties).length > 0) {
        description += `\n**Properties:**\n`;
        for (const [key, value] of Object.entries(element.properties)) {
            if (typeof value === 'object') {
                description += `- ${key}: ${JSON.stringify(value)}\n`;
            } else {
                description += `- ${key}: ${value}\n`;
            }
        }
    }

    // Add styles
    if (Object.keys(element.styles).length > 0) {
        description += `\n**Styles:**\n`;
        for (const [key, value] of Object.entries(element.styles)) {
            if (value) {
                description += `- ${key}: ${value}\n`;
            }
        }
    }

    // Add specific instructions based on type
    switch (element.type) {
        case 'navbar':
            description += `\n**Special Instructions:** Create a sticky navigation bar with the specified items.\n`;
            break;
        case 'button':
            description += `\n**Special Instructions:** Add hover effects and cursor pointer.\n`;
            break;
        case 'image':
            description += `\n**Special Instructions:** Ensure image is responsive and uses the proxy URL.\n`;
            break;
        case 'modal':
            description += `\n**Special Instructions:** Implement open/close functionality with JavaScript.\n`;
            break;
        case 'dropdown':
            description += `\n**Special Instructions:** Add click-to-toggle dropdown functionality.\n`;
            break;
        case 'carousel':
            description += `\n**Special Instructions:** Implement auto-sliding carousel with navigation.\n`;
            break;
    }

    return description;
}
