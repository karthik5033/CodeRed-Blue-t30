'use client';

import { useState, useEffect, useRef } from 'react';

interface LivePreviewProps {
    files: { path: string; content: string; type: string }[];
    onClose: () => void;
}

export function LivePreview({ files, onClose }: LivePreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [currentPath, setCurrentPath] = useState('/');
    const [error, setError] = useState<string | null>(null);

    // Find page files
    const pageFiles = files.filter(f => f.path.startsWith('app/') && f.path.endsWith('/page.tsx'));
    const routes = pageFiles.map(f => {
        const match = f.path.match(/app\/(.*)\/page\.tsx/);
        return match ? `/${match[1]}` : '/';
    }).filter(r => r !== '/');
    routes.unshift('/'); // Home always first

    useEffect(() => {
        if (!iframeRef.current) return;

        try {
            // Create HTML document with all pages as routes
            const htmlContent = generateLivePreviewHTML(files, currentPath);

            const iframe = iframeRef.current;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

            if (iframeDoc) {
                iframeDoc.open();
                iframeDoc.write(htmlContent);
                iframeDoc.close();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to render preview');
        }
    }, [files, currentPath]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-4">
                    <h2 className="text-white font-semibold text-lg">🎉 Live Preview</h2>
                    <div className="flex gap-2">
                        {routes.map((route) => (
                            <button
                                key={route}
                                onClick={() => setCurrentPath(route)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPath === route
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                {route === '/' ? 'Home' : route.replace('/', '')}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-300 text-2xl font-light px-4"
                    title="Close Live Preview"
                >
                    ×
                </button>
            </div>

            {/* URL Bar */}
            <div className="bg-gray-800 px-6 py-2 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">URL:</span>
                    <div className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg font-mono text-sm">
                        {typeof window !== 'undefined'
                            ? `http://${window.location.hostname}:${window.location.port}${currentPath}`
                            : `http://localhost:3000${currentPath}`}
                    </div>
                </div>
            </div>

            {/* Preview iframe */}
            <div className="flex-1 bg-white relative">
                {error ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                        <div className="text-center">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h3 className="text-xl font-semibold text-red-900 mb-2">Preview Error</h3>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                ) : (
                    <iframe
                        ref={iframeRef}
                        className="w-full h-full border-0"
                        title="Live Preview"
                        sandbox="allow-scripts allow-same-origin"
                    />
                )}
            </div>

            {/* Footer */}
            <div className="bg-gray-900 px-6 py-3 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <div>
                        <span className="text-green-400">●</span> Live Preview Running
                    </div>
                    <div>
                        {files.length} files generated • {routes.length} routes
                    </div>
                </div>
            </div>
        </div>
    );
}

// Generate HTML for live preview
function generateLivePreviewHTML(files: { path: string; content: string }[], currentPath: string): string {
    // Find the page file for current path
    const pageFile = currentPath === '/'
        ? files.find(f => f.path === 'app/page.tsx')
        : files.find(f => f.path === `app${currentPath}/page.tsx`);

    if (!pageFile) {
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Not Found</title>
</head>
<body style="margin: 0; padding: 40px; font-family: system-ui; text-align: center;">
    <h1>404 - Page Not Found</h1>
    <p>The page ${currentPath} does not exist.</p>
</body>
</html>`;
    }

    // Remove imports and 'use client' to avoid conflicts in iframe
    let cleanedContent = pageFile.content
        .replace(/import\s+.*from\s+['"].*['"];?\s*/g, '') // Remove imports
        .replace(/['"]use client['"];?\s*/g, '');  // Remove 'use client'

    // Extract JSX from the page component
    const componentMatch = cleanedContent.match(/return\s*\(([\s\S]*)\);/);
    const jsxContent = componentMatch ? componentMatch[1] : '<div><h1>Error rendering page</h1></div>';

    console.log('[LivePreview] Page file:', pageFile.path);
    console.log('[LivePreview] JSX extracted:', jsxContent.substring(0, 200));

    // Convert JSX-like syntax to HTML (simplified)
    let htmlContent = jsxContent
        // Convert className to class (all variants)
        .replace(/className=/g, 'class=')
        .replace(/className\s*=\s*"/g, 'class="')
        .replace(/className\s*=\s*{/g, 'class="{')
        // Handle template literals
        .replace(/{`([^`]*)`}/g, '$1')
        // Remove event handlers (onChange, onClick, onSubmit, etc.) - they won't work in static HTML anyway
        .replace(/\s+on\w+\s*=\s*{[^}]*}/g, '')
        // Remove conditionals like {error && ...}
        .replace(/{\s*\w+\s*&&\s*<[^}]*}/g, '')
        // Remove {loading ? 'text' : 'text'} ternaries - replace with default
        .replace(/{loading\s*\?\s*'([^']*?)'\s*:\s*'([^']*?)'}/g, '$2')
        .replace(/{loading\s*\?\s*"([^"]*?)"\s*:\s*"([^"]*?)"}/g, '$2')
        // Remove value={variable} binding attributes
        .replace(/\s+value\s*=\s*{[^}]*}/g, '')
        // Remove disabled={variable} attributes
        .replace(/\s+disabled\s*=\s*{[^}]*}/g, '')
        // Remove required attribute binding
        .replace(/\s+required\s*=\s*{[^}]*}/g, ' required')
        // Handle style objects - convert to inline styles
        .replace(/style=\{\{([^}]*)\}\}/g, (match, styles) => {
            const cssStyles = styles
                .replace(/(\w+):\s*'([^']*)'/g, '$1: $2')
                .replace(/(\w+):\s*"([^"]*)"/g, '$1: $2')
                .replace(/,/g, ';')
                .replace(/;\s*$/, ''); // Remove trailing semicolon

            // Convert camelCase to kebab-case
            const kebabCaseStyles = cssStyles.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

            return `style="${kebabCaseStyles}"`;
        });

    console.log('[LivePreview] HTML converted:', htmlContent.substring(0, 300));

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;
}
