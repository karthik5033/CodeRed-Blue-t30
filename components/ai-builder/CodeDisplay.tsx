'use client';

import { useState } from 'react';
import { Palette, Type, Layout, Download, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeDisplayProps {
    code: string;
    language?: string;
}

export default function CodeDisplay({ code, language = 'tsx' }: CodeDisplayProps) {
    const [isVisible, setIsVisible] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        // You can add a toast notification here
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `generated-page.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!code) return null;

    return (
        <div className="border-t border-neutral-200 dark:border-neutral-800">
            {/* Toggle Button */}
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="w-full p-3 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    <span className="font-medium">View Code</span>
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {isVisible ? 'Hide' : 'Show'}
                </span>
            </button>

            {/* Code Display */}
            {isVisible && (
                <div className="border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between p-3 bg-neutral-900">
                        <span className="text-sm text-neutral-400">
                            {language.toUpperCase()} Code
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopy}
                                className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                            >
                                Copy
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownload}
                                className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-auto">
                        <SyntaxHighlighter
                            language={language}
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                borderRadius: 0,
                                fontSize: '13px',
                            }}
                            showLineNumbers
                        >
                            {code}
                        </SyntaxHighlighter>
                    </div>
                </div>
            )}
        </div>
    );
}
