'use client';

import { useState, useEffect, useRef } from 'react';
import { Monitor, Smartphone, Tablet, Maximize2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewPanelProps {
    code: string;
    isLoading: boolean;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'fullscreen';

export default function PreviewPanel({ code, isLoading }: PreviewPanelProps) {
    const [viewport, setViewport] = useState<ViewportSize>('desktop');
    const [key, setKey] = useState(0);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const refresh = () => setKey(prev => prev + 1);

    useEffect(() => {
        if (code && iframeRef.current) {
            const iframe = iframeRef.current;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

            if (iframeDoc) {
                // Create a complete HTML document with the generated HTML
                const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 0; }
    * { box-sizing: border-box; }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;

                iframeDoc.open();
                iframeDoc.write(html);
                iframeDoc.close();
            }
        }
    }, [code, key]);

    const viewportSizes = {
        mobile: 'w-[375px]',
        tablet: 'w-[768px]',
        desktop: 'w-full',
        fullscreen: 'w-full h-full',
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-neutral-950">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewport === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewport('mobile')}
                    >
                        <Smartphone className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={viewport === 'tablet' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewport('tablet')}
                    >
                        <Tablet className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={viewport === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewport('desktop')}
                    >
                        <Monitor className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={viewport === 'fullscreen' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewport('fullscreen')}
                    >
                        <Maximize2 className="w-4 h-4" />
                    </Button>
                </div>

                <Button variant="outline" size="sm" onClick={refresh}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-auto bg-neutral-100 dark:bg-neutral-900 p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Generating your page...
                            </p>
                        </div>
                    </div>
                ) : !code ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center max-w-md">
                            <Monitor className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Preview Yet</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Enter a prompt and click "Generate Page" to see your AI-generated page here.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div
                            className={`${viewportSizes[viewport]} ${viewport === 'fullscreen' ? '' : 'max-w-full'
                                } bg-white dark:bg-neutral-950 shadow-2xl transition-all duration-300`}
                        >
                            <iframe
                                ref={iframeRef}
                                key={key}
                                className="w-full h-full min-h-[600px]"
                                sandbox="allow-scripts allow-same-origin"
                                title="Preview"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
