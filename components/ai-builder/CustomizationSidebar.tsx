'use client';

import { useState } from 'react';
import { Palette, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomizationSidebarProps {
    onCustomize: (customizations: CustomizationOptions) => void;
    isLoading: boolean;
    hasCode: boolean;
}

export interface CustomizationOptions {
    icon?: string;
    color?: string;
    buttonStyle?: string;
}

const colorSchemes = [
    { name: 'Purple', value: 'purple', colors: 'from-purple-500 to-pink-500' },
    { name: 'Blue', value: 'blue', colors: 'from-blue-500 to-cyan-500' },
    { name: 'Green', value: 'green', colors: 'from-green-500 to-emerald-500' },
    { name: 'Orange', value: 'orange', colors: 'from-orange-500 to-red-500' },
    { name: 'Teal', value: 'teal', colors: 'from-teal-500 to-blue-500' },
];

const buttonStyles = [
    { name: 'Rounded', value: 'rounded-full' },
    { name: 'Sharp', value: 'rounded-none' },
    { name: 'Soft', value: 'rounded-lg' },
    { name: 'Pill', value: 'rounded-full px-8' },
];

export default function CustomizationSidebar({
    onCustomize,
    isLoading,
    hasCode,
}: CustomizationSidebarProps) {
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedButton, setSelectedButton] = useState<string>('');

    const handleApply = () => {
        const customizations: CustomizationOptions = {};

        if (selectedColor) {
            customizations.color = selectedColor;
        }
        if (selectedButton) {
            customizations.buttonStyle = selectedButton;
        }

        if (Object.keys(customizations).length > 0) {
            console.log('Applying customizations:', customizations);
            onCustomize(customizations);

            // Reset selections after applying
            setSelectedColor('');
            setSelectedButton('');
        }
    };

    const hasChanges = selectedColor || selectedButton;

    return (
        <div className="w-80 h-full bg-neutral-50 dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Palette className="w-5 h-5 text-blue-500" />
                    Customize
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    Personalize your generated page
                </p>
            </div>

            {/* Customization Options */}
            <div className="flex-1 overflow-auto p-4 space-y-6">
                {!hasCode ? (
                    <div className="text-center text-neutral-500 dark:text-neutral-400 mt-8">
                        <Wand2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">
                            Generate a page first to customize it
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Color Scheme */}
                        <div>
                            <label className="text-sm font-medium mb-3 block">
                                Color Scheme
                            </label>
                            <div className="space-y-2">
                                {colorSchemes.map((scheme) => (
                                    <button
                                        key={scheme.value}
                                        onClick={() => setSelectedColor(scheme.value)}
                                        disabled={isLoading}
                                        className={`w-full p-3 rounded-lg border-2 transition-all ${selectedColor === scheme.value
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-lg bg-gradient-to-r ${scheme.colors}`}
                                            />
                                            <span className="font-medium">{scheme.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Button Style */}
                        <div>
                            <label className="text-sm font-medium mb-3 block">
                                Button Style
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {buttonStyles.map((style) => (
                                    <button
                                        key={style.value}
                                        onClick={() => setSelectedButton(style.value)}
                                        disabled={isLoading}
                                        className={`p-3 rounded-lg border-2 transition-all ${selectedButton === style.value
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                                            }`}
                                    >
                                        <div
                                            className={`w-full h-8 bg-neutral-900 dark:bg-neutral-100 ${style.value} flex items-center justify-center text-xs text-white dark:text-black font-medium`}
                                        >
                                            {style.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Apply Button */}
            {hasCode && (
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                    <Button
                        onClick={handleApply}
                        disabled={!hasChanges || isLoading}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Applying...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4 mr-2" />
                                Apply Changes
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
