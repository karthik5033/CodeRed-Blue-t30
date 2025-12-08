'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PromptInput from '@/components/ai-builder/PromptInput';
import PreviewPanel from '@/components/ai-builder/PreviewPanel';
import CustomizationSidebar, { CustomizationOptions } from '@/components/ai-builder/CustomizationSidebar';
import CodeDisplay from '@/components/ai-builder/CodeDisplay';

export default function AIBuilderPage() {
    const [generatedCode, setGeneratedCode] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (prompt: string) => {
        setIsGenerating(true);
        setError(null);
        setGeneratedCode(''); // Clear previous code

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Generation failed');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No response body');
            }

            let fullCode = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = JSON.parse(line.slice(6));

                        if (data.error) {
                            throw new Error(data.error);
                        }

                        if (data.done) {
                            fullCode = data.code;
                            setGeneratedCode(data.code);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Generation error:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate page');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCustomize = async (customizations: CustomizationOptions | { modification: string }) => {
        if (!generatedCode) return;

        setIsCustomizing(true);
        setError(null);

        try {
            const response = await fetch('/api/modify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: generatedCode,
                    ...(('modification' in customizations)
                        ? { modification: customizations.modification }
                        : { customizations }),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Customization failed');
            }

            const data = await response.json();
            setGeneratedCode(data.code);
        } catch (err) {
            console.error('Customization error:', err);
            setError(err instanceof Error ? err.message : 'Failed to customize page');
        } finally {
            setIsCustomizing(false);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Error Banner */}
            {error && (
                <div className="bg-red-500 text-white px-4 py-2 text-sm">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Prompt Input */}
                <div className="w-96">
                    <PromptInput onSubmit={handleGenerate} isLoading={isGenerating} />
                </div>

                {/* Center: Preview and Code */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Edit Prompt - Only show when code exists */}
                    {generatedCode && (
                        <div className="border-b border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50 dark:bg-neutral-900">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Edit with AI: e.g., 'Make it darker' or 'Add a contact form'"
                                    className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                            handleCustomize({ modification: e.currentTarget.value });
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                    disabled={isCustomizing}
                                />
                                <Button
                                    size="sm"
                                    disabled={isCustomizing}
                                    onClick={(e) => {
                                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                        if (input?.value.trim()) {
                                            handleCustomize({ modification: input.value });
                                            input.value = '';
                                        }
                                    }}
                                >
                                    {isCustomizing ? 'Editing...' : 'Edit'}
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-hidden">
                        <PreviewPanel code={generatedCode} isLoading={isGenerating} />
                    </div>
                    <CodeDisplay code={generatedCode} language="html" />
                </div>

                {/* Right: Customization */}
                <CustomizationSidebar
                    onCustomize={handleCustomize}
                    isLoading={isCustomizing}
                    hasCode={!!generatedCode}
                />
            </div>
        </div>
    );
}
