/**
 * Enhanced file parser for full-stack applications
 */

import { FileData, PageDetection, ProjectStructure, DatabaseSchema } from '@/types/ai-builder';
import { createProjectStructure, detectProjectType } from './project-organizer';

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
 * Map language to file type
 */
function mapLanguageToType(language: string): FileData['type'] {
    const langMap: Record<string, FileData['type']> = {
        html: 'html',
        css: 'css',
        javascript: 'javascript',
        js: 'javascript',
        typescript: 'typescript',
        ts: 'typescript',
        jsx: 'jsx',
        tsx: 'tsx',
        json: 'json',
        env: 'env',
        markdown: 'markdown',
        md: 'markdown',
        prisma: 'text',
        txt: 'text',
    };
    return langMap[language.toLowerCase()] || 'text';
}

/**
 * Determine file category from path
 */
function determineCategory(path: string, type: FileData['type']): FileData['category'] {
    const lowerPath = path.toLowerCase();

    if (lowerPath.includes('backend/') || lowerPath.includes('server/') || lowerPath.includes('api/')) {
        return 'backend';
    }

    if (lowerPath.includes('models/') || lowerPath.includes('schema') || lowerPath.includes('prisma/')) {
        return 'database';
    }

    if (type === 'json' || type === 'env' || lowerPath.includes('config') || lowerPath.includes('.env')) {
        return 'config';
    }

    if (type === 'markdown' || lowerPath.includes('readme')) {
        return 'docs';
    }

    return 'frontend';
}

/**
 * Extract files from AI response with full-stack support
 */
export function extractFilesFromResponse(response: string): FileData[] {
    const files: FileData[] = [];

    // Match code blocks with file paths: ```language:path/to/file.ext
    const codeBlockRegex = /```(\w+)(?::([^\n]+))?\n([\s\S]*?)```/g;

    let match;
    while ((match = codeBlockRegex.exec(response)) !== null) {
        const [, language, filepath, content] = match;

        const type = mapLanguageToType(language);
        const path = filepath?.trim() || generateDefaultPath(language, files.length);
        const name = path.split('/').pop() || 'file';
        const category = determineCategory(path, type);

        files.push({
            name,
            content: content.trim(),
            type,
            category,
            path,
            size: content.trim().length,
        });
    }

    // If no code blocks found, try to extract raw HTML
    if (files.length === 0) {
        const htmlMatch = response.match(/<[^>]+>/);
        if (htmlMatch) {
            files.push({
                name: 'index.html',
                content: response.trim(),
                type: 'html',
                category: 'frontend',
                path: 'index.html',
                size: response.trim().length,
            });
        }
    }

    return files;
}

/**
 * Generate default path for files without explicit paths
 */
function generateDefaultPath(language: string, index: number): string {
    const defaults: Record<string, string> = {
        html: 'index.html',
        css: 'style.css',
        javascript: 'script.js',
        js: 'script.js',
        typescript: 'index.ts',
        tsx: 'App.tsx',
        jsx: 'App.jsx',
        json: 'package.json',
    };

    return defaults[language.toLowerCase()] || `file${index}.txt`;
}

/**
 * Extract database schema from files
 */
export function extractDatabaseSchema(files: FileData[]): DatabaseSchema | undefined {
    // Check for /api/database usage in JavaScript files
    const jsFiles = files.filter(f =>
        (f.type === 'javascript' || f.path.includes('.js')) &&
        f.content.includes('/api/database')
    );

    console.log('[Database Detection] JS files with /api/database:', jsFiles.length);

    if (jsFiles.length > 0) {
        // Extract table names from JavaScript code
        const tableNames: string[] = [];
        jsFiles.forEach(file => {
            console.log('[Database Detection] Checking file:', file.path);
            // Look for table: 'tablename' or table: "tablename"
            const tableMatches = file.content.match(/table:\s*['"](\w+)['"]/g);
            console.log('[Database Detection] Table matches:', tableMatches);
            if (tableMatches) {
                tableMatches.forEach(match => {
                    const tableName = match.match(/['"](\ w+)['"]/)?.[1];
                    if (tableName && !tableNames.includes(tableName)) {
                        tableNames.push(tableName);
                    }
                });
            }
        });

        console.log('[Database Detection] Found tables:', tableNames);

        if (tableNames.length > 0) {
            return {
                name: 'database',
                type: 'mongodb', // Using JSON storage, but show as MongoDB for UI
                collections: tableNames.map(name => ({
                    name,
                    schema: {},
                    indexes: [],
                })),
            };
        }
    }

    // Check for MongoDB/Mongoose
    const mongooseFiles = files.filter(f =>
        f.content.includes('mongoose') ||
        f.path.includes('models/') && f.content.includes('Schema')
    );

    if (mongooseFiles.length > 0) {
        return {
            name: 'database',
            type: 'mongodb',
            collections: mongooseFiles.map(f => ({
                name: f.name.replace(/\.(js|ts)$/, ''),
                schema: {},
                indexes: [],
            })),
        };
    }

    // Check for Prisma
    const prismaFile = files.find(f => f.path.includes('schema.prisma'));
    if (prismaFile) {
        return {
            name: 'database',
            type: 'postgresql',
            tables: [],
        };
    }

    console.log('[Database Detection] No database detected');
    return undefined;
}

/**
 * Validate and enhance HTML files
 */
function validateHTMLFiles(files: FileData[]): FileData[] {
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
export function parseAIResponse(response: string): {
    files: FileData[];
    structure: ProjectStructure;
    database?: DatabaseSchema;
} {
    let files = extractFilesFromResponse(response);

    // Validate HTML files only if they exist
    if (files.some(f => f.type === 'html')) {
        files = validateHTMLFiles(files);
    }

    const structure = createProjectStructure(files);
    const database = extractDatabaseSchema(files);

    return {
        files,
        structure,
        database,
    };
}
