'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PromptInput from '@/components/ai-builder/PromptInput';
import PreviewPanel from '@/components/ai-builder/PreviewPanel';
import CustomizationSidebar, { CustomizationOptions } from '@/components/ai-builder/CustomizationSidebar';
import PropertyInspector from '@/components/ai-builder/PropertyInspector';
import CodeDisplay from '@/components/ai-builder/CodeDisplay';
import { FileData } from '@/types/ai-builder';
import { SelectedElement, PropertyChange, EditorMode } from '@/types/visual-editor';
import { CodeSynchronizer } from '@/lib/code-synchronizer';

export default function AIBuilderPage() {
    const [generatedFiles, setGeneratedFiles] = useState<FileData[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [editorMode, setEditorMode] = useState<EditorMode>('code');
    const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);

    const handleGenerate = async (prompt: string) => {
        setIsGenerating(true);
        setError(null);
        setGeneratedFiles([]); // Clear previous files

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

                        if (data.done && data.files) {
                            setGeneratedFiles(data.files);
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
        if (generatedFiles.length === 0) return;

        setIsCustomizing(true);
        setError(null);

        try {
            const response = await fetch('/api/modify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    files: generatedFiles,
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
            setGeneratedFiles(data.files);
        } catch (err) {
            console.error('Customization error:', err);
            setError(err instanceof Error ? err.message : 'Failed to customize page');
        } finally {
            setIsCustomizing(false);
        }
    };

    const handleElementSelect = (element: SelectedElement | null) => {
        setSelectedElement(element);
        if (element) {
            setEditorMode('visual');
        }
    };

    const handlePropertyChange = (change: PropertyChange) => {
        // Get iframe document from PreviewPanel
        const iframeDoc = document.querySelector('iframe')?.contentDocument;

        if (!iframeDoc) {
            console.error('Iframe document not found');
            return;
        }

        // Apply changes directly to iframe DOM (instant visual update)
        let element = iframeDoc.querySelector(change.elementPath);

        if (!element) {
            console.error('Element not found with selector:', change.elementPath);
            return;
        }

        // Handle text content separately
        if (change.property === 'textContent') {
            element.textContent = change.value;

            // Update selected element state
            if (selectedElement && selectedElement.path === change.elementPath) {
                setSelectedElement({
                    ...selectedElement,
                    textContent: change.value,
                });
            }
        } else if (change.property === 'src' || change.property === 'alt') {
            // Handle image attributes
            element.setAttribute(change.property, change.value);

            // Update selected element state
            if (selectedElement && selectedElement.path === change.elementPath) {
                setSelectedElement({
                    ...selectedElement,
                    computedStyles: {
                        ...selectedElement.computedStyles,
                        [change.property]: change.value,
                    },
                });
            }
        } else {
            // Handle style properties
            const htmlElement = element as HTMLElement;
            const cssProperty = change.property.replace(/([A-Z])/g, '-$1').toLowerCase();
            htmlElement.style.setProperty(cssProperty, change.value);

            // Update selected element state
            if (selectedElement && selectedElement.path === change.elementPath) {
                setSelectedElement({
                    ...selectedElement,
                    computedStyles: {
                        ...selectedElement.computedStyles,
                        [change.property]: change.value,
                    },
                });
            }
        }

        // Extract the updated HTML and update generatedFiles state
        // This triggers the PreviewPanel's useEffect to reload the iframe with the changes
        const extractedHTML = CodeSynchronizer.extractHTMLFromIframe(iframeDoc);

        const htmlFiles = generatedFiles.filter(f => f.type === 'html');
        const otherFiles = generatedFiles.filter(f => f.type !== 'html');

        const updatedHtmlFiles = htmlFiles.map(file => ({
            ...file,
            content: extractedHTML
        }));

        setGeneratedFiles([...updatedHtmlFiles, ...otherFiles]);
    };

    const handleApplyChanges = () => {
        // Get iframe document
        const iframeDoc = document.querySelector('iframe')?.contentDocument;
        if (!iframeDoc) {
            console.error('Cannot apply changes: iframe document not found');
            return;
        }

        // Extract updated HTML from iframe
        const htmlFiles = generatedFiles.filter(f => f.type === 'html');
        const otherFiles = generatedFiles.filter(f => f.type !== 'html');

        // Extract the current state of the iframe (with all inline changes)
        const extractedHTML = CodeSynchronizer.extractHTMLFromIframe(iframeDoc);

        const updatedHtmlFiles = htmlFiles.map(file => ({
            ...file,
            content: extractedHTML
        }));

        // Update the files state - this will trigger re-render of both preview and code
        setGeneratedFiles([...updatedHtmlFiles, ...otherFiles]);
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Error Banner */}
            {error && (
                <div className="bg-red-500 text-white px-4 py-2 text-sm">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Mode Toggle - Show when files exist */}
            {generatedFiles.length > 0 && !isFullscreen && (
                <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-2 flex items-center gap-2">
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">Mode:</span>
                    <Button
                        variant={editorMode === 'visual' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setEditorMode('visual')}
                    >
                        Visual
                    </Button>
                    <Button
                        variant={editorMode === 'code' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            setEditorMode('code');
                            setSelectedElement(null);
                        }}
                    >
                        Code
                    </Button>
                </div>
            )}

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Prompt Input - Hide in fullscreen */}
                {!isFullscreen && (
                    <div className="w-96">
                        <PromptInput onSubmit={handleGenerate} isLoading={isGenerating} />
                    </div>
                )}

                {/* Center: Preview and Code */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Edit Prompt - Only show when files exist and not in fullscreen */}
                    {generatedFiles.length > 0 && !isFullscreen && (
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
                        <PreviewPanel
                            files={generatedFiles}
                            isLoading={isGenerating}
                            isFullscreen={isFullscreen}
                            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                            isSelectionMode={editorMode === 'visual'}
                            onElementSelect={handleElementSelect}
                        />
                    </div>
                    {!isFullscreen && (
                        <CodeDisplay
                            files={generatedFiles}
                            onCodeChange={(fileIndex, newContent) => {
                                const updatedFiles = [...generatedFiles];
                                updatedFiles[fileIndex] = {
                                    ...updatedFiles[fileIndex],
                                    content: newContent,
                                };
                                setGeneratedFiles(updatedFiles);
                            }}
                        />
                    )}
                </div>

                {/* Right: Property Inspector (Visual) or Customization (Code) - Hide in fullscreen */}
                {!isFullscreen && (
                    editorMode === 'visual' ? (
                        <PropertyInspector
                            selectedElement={selectedElement}
                            onPropertyChange={handlePropertyChange}
                            onApplyChanges={handleApplyChanges}
                            onClose={() => setSelectedElement(null)}
                        />
                    ) : (
                        <CustomizationSidebar
                            onCustomize={handleCustomize}
                            isLoading={isCustomizing}
                            hasCode={generatedFiles.length > 0}
                        />
                    )
                )}
            </div>
        </div>
    );
}
