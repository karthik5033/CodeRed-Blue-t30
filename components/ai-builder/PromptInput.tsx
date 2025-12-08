'use client';

import { useState } from 'react';
import { Send, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { optimizePrompt, estimateTokens, getOptimizationStats } from '@/lib/prompt-optimizer';

interface PromptInputProps {
    onSubmit: (prompt: string) => void;
    isLoading: boolean;
}

export default function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
    const [prompt, setPrompt] = useState('');
    const [showOptimization, setShowOptimization] = useState(false);

    const handleSubmit = () => {
        if (prompt.trim() && !isLoading) {
            onSubmit(prompt);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
        }
    };

    const optimizedPrompt = optimizePrompt(prompt);
    const stats = prompt ? getOptimizationStats(prompt, optimizedPrompt) : null;

    const examplePrompts = [
        'Create a modern landing page for a SaaS product with hero, features, and pricing sections',
        'Build a dashboard with sidebar navigation, stats cards, and a data table',
        'Design a contact page with a form, map, and company information',
        'Make a portfolio page showcasing projects with images and descriptions',
    ];

    return (
        <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    AI Page Builder
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    Describe the page you want to create
                </p>
            </div>

            {/* Prompt Input */}
            <div className="flex-1 p-4 flex flex-col gap-4">
                <div className="flex-1 flex flex-col">
                    <label className="text-sm font-medium mb-2">Your Prompt</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., Create a modern landing page for a coffee shop with hero section, menu, and contact form..."
                        className="flex-1 p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={isLoading}
                    />

                    {/* Token Stats */}
                    {stats && (
                        <div className="mt-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-4">
                                <span className="text-neutral-600 dark:text-neutral-400">
                                    Tokens: ~{stats.originalTokens}
                                </span>
                                {stats.tokensSaved > 0 && (
                                    <button
                                        onClick={() => setShowOptimization(!showOptimization)}
                                        className="text-green-600 dark:text-green-400 hover:underline"
                                    >
                                        ↓ Save {stats.tokensSaved} tokens ({stats.percentageSaved}%)
                                    </button>
                                )}
                            </div>
                            <span className="text-neutral-500">Ctrl+Enter to send</span>
                        </div>
                    )}

                    {/* Optimization Preview */}
                    {showOptimization && optimizedPrompt !== prompt && (
                        <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                                Optimized version:
                            </div>
                            <div className="text-sm text-green-900 dark:text-green-300">
                                {optimizedPrompt}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        onClick={handleSubmit}
                        disabled={!prompt.trim() || isLoading}
                        className="flex-1 h-11"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Generate Page
                            </>
                        )}
                    </Button>

                    {prompt && (
                        <Button
                            onClick={() => setPrompt('')}
                            variant="outline"
                            size="icon"
                            className="h-11 w-11"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Example Prompts */}
                <div className="mt-4">
                    <label className="text-sm font-medium mb-2 block">Examples</label>
                    <div className="space-y-2">
                        {examplePrompts.map((example, index) => (
                            <button
                                key={index}
                                onClick={() => setPrompt(example)}
                                disabled={isLoading}
                                className="w-full text-left p-2 text-sm rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors disabled:opacity-50"
                            >
                                {example}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
