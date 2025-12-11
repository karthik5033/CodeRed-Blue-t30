'use client';

import { useState } from 'react';
import { MULTI_PAGE_TEMPLATES, MultiPageTemplate } from '@/lib/visual-builder/example-templates';
import { Page } from '@/lib/visual-builder-types';

interface TemplateSelectorProps {
    onLoadTemplate: (pages: Page[]) => void;
    onClose: () => void;
}

export function TemplateSelector({ onLoadTemplate, onClose }: TemplateSelectorProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = ['all', ...Array.from(new Set(MULTI_PAGE_TEMPLATES.map(t => t.category)))];

    const filteredTemplates = selectedCategory === 'all'
        ? MULTI_PAGE_TEMPLATES
        : MULTI_PAGE_TEMPLATES.filter(t => t.category === selectedCategory);

    const handleSelectTemplate = (template: MultiPageTemplate) => {
        onLoadTemplate(template.pages);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Load Template</h2>
                            <p className="text-sm text-gray-600 mt-1">Choose a pre-built template to get started quickly</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                        >
                            ×
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 mt-4">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Template Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 gap-6">
                        {filteredTemplates.map(template => (
                            <button
                                key={template.id}
                                onClick={() => handleSelectTemplate(template)}
                                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-purple-500 hover:shadow-lg transition-all text-left group"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Thumbnail */}
                                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-3xl">
                                        {template.thumbnail}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">
                                            {template.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {template.description}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full font-medium">
                                                {template.category}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {template.pages.length} {template.pages.length === 1 ? 'page' : 'pages'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-2">🔍</div>
                            <p className="text-gray-500">No templates found in this category</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-500 text-center">
                        💡 Tip: Select a template to load it onto the canvas. You can customize it after loading.
                    </p>
                </div>
            </div>
        </div>
    );
}
