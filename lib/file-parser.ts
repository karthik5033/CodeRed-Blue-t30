/**
 * Utility for parsing AI-generated multi-file responses
 */

import { FileData, PageDetection } from '@/types/ai-builder';

/**
 * Detects page types from user prompt
 */
export function detectPages(prompt: string): PageDetection {
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

/**
 * Extracts multiple code blocks from AI response
 */
export function extractFilesFromResponse(response: string): FileData[] {
    const files: FileData[] = [];

    // Match code blocks with optional file names
    // Patterns: ```html:filename.html or ```html or ```css:style.css
    const codeBlockRegex = /```(\w+)(?::([^\n]+))?\n([\s\S]*?)```/g;

    let match;
    const foundBlocks: Array<{ type: string; name?: string; content: string }> = [];

    while ((match = codeBlockRegex.exec(response)) !== null) {
        const [, language, filename, content] = match;
        foundBlocks.push({
            type: language.toLowerCase(),
            name: filename?.trim(),
            content: content.trim(),
        });
    }

    // If no code blocks found, try to extract raw HTML
    if (foundBlocks.length === 0) {
        const htmlMatch = response.match(/<[^>]+>/);
        if (htmlMatch) {
            foundBlocks.push({
                type: 'html',
                content: response.trim(),
            });
        }
    }

    // Organize blocks into files
    const htmlBlocks = foundBlocks.filter(b => b.type === 'html');
    const cssBlocks = foundBlocks.filter(b => b.type === 'css');
    const jsBlocks = foundBlocks.filter(b => b.type === 'javascript' || b.type === 'js');

    // Process HTML files
    htmlBlocks.forEach((block, index) => {
        const name = block.name || (htmlBlocks.length > 1 ? `page${index + 1}.html` : 'index.html');
        files.push({
            name,
            content: block.content,
            type: 'html',
            size: block.content.length,
        });
    });

    // Process CSS files
    if (cssBlocks.length > 0) {
        const combinedCSS = cssBlocks.map(b => b.content).join('\n\n');
        files.push({
            name: 'style.css',
            content: combinedCSS,
            type: 'css',
            size: combinedCSS.length,
        });
    }

    // Process JS files
    if (jsBlocks.length > 0) {
        const combinedJS = jsBlocks.map(b => b.content).join('\n\n');
        files.push({
            name: 'script.js',
            content: combinedJS,
            type: 'javascript',
            size: combinedJS.length,
        });
    }

    // If only one HTML file and no explicit files, create default structure
    if (files.length === 1 && files[0].type === 'html') {
        // Extract inline styles and scripts
        const html = files[0].content;

        // Extract <style> tags
        const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
        const styles: string[] = [];
        let styleMatch;
        while ((styleMatch = styleRegex.exec(html)) !== null) {
            styles.push(styleMatch[1].trim());
        }

        // Extract <script> tags (excluding CDN scripts)
        const scriptRegex = /<script(?![^>]*src=["']https?:\/\/)[^>]*>([\s\S]*?)<\/script>/gi;
        const scripts: string[] = [];
        let scriptMatch;
        while ((scriptMatch = scriptRegex.exec(html)) !== null) {
            if (scriptMatch[1].trim()) {
                scripts.push(scriptMatch[1].trim());
            }
        }

        // Remove inline styles and scripts from HTML
        let cleanHTML = html
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<script(?![^>]*src=["']https?:\/\/)[^>]*>[\s\S]*?<\/script>/gi, '');

        // Add links to external files if we extracted content
        if (styles.length > 0) {
            cleanHTML = cleanHTML.replace(
                '</head>',
                '  <link rel="stylesheet" href="style.css">\n</head>'
            );

            files.push({
                name: 'style.css',
                content: styles.join('\n\n'),
                type: 'css',
                size: styles.join('\n\n').length,
            });
        }

        if (scripts.length > 0) {
            cleanHTML = cleanHTML.replace(
                '</body>',
                '  <script src="script.js"></script>\n</body>'
            );

            files.push({
                name: 'script.js',
                content: scripts.join('\n\n'),
                type: 'javascript',
                size: scripts.join('\n\n').length,
            });
        }

        // Update the HTML file
        files[0].content = cleanHTML;
        files[0].size = cleanHTML.length;
    }

    return files;
}

/**
 * Validates that HTML files properly reference CSS and JS files
 */
export function validateFileLinks(files: FileData[]): FileData[] {
    const htmlFiles = files.filter(f => f.type === 'html');
    const hasCSSFile = files.some(f => f.type === 'css');
    const hasJSFile = files.some(f => f.type === 'javascript');

    return files.map(file => {
        if (file.type !== 'html') return file;

        let content = file.content;

        // Ensure HTML has proper structure
        if (!content.includes('<html')) {
            content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="img-src * data: blob: 'unsafe-inline';">
  <title>Generated Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
${hasCSSFile ? '  <link rel="stylesheet" href="style.css">\n' : ''}</head>
<body>
${content}
${hasJSFile ? '  <script src="script.js"></script>\n' : ''}</body>
</html>`;
        } else {
            // Add CSS link if missing
            if (hasCSSFile && !content.includes('style.css')) {
                content = content.replace(
                    '</head>',
                    '  <link rel="stylesheet" href="style.css">\n</head>'
                );
            }

            // Add JS script if missing
            if (hasJSFile && !content.includes('script.js')) {
                content = content.replace(
                    '</body>',
                    '  <script src="script.js"></script>\n</body>'
                );
            }

            // Add CSP for images if missing
            if (!content.includes('Content-Security-Policy')) {
                content = content.replace(
                    '<head>',
                    '<head>\n  <meta http-equiv="Content-Security-Policy" content="img-src * data: blob: \'unsafe-inline\';">'
                );
            }
        }

        return {
            ...file,
            content,
            size: content.length,
        };
    });
}

/**
 * Main function to parse AI response into structured files
 */
export function parseAIResponse(response: string): FileData[] {
    const files = extractFilesFromResponse(response);
    return validateFileLinks(files);
}
