'use client';

import { useState } from 'react';
import { VisualElement, ElementCategory } from '@/lib/visual-builder-types';
import { ELEMENT_TEMPLATES, getElementsByCategory } from '@/lib/visual-builder/element-templates';

interface ElementPaletteProps {
    onAddElement: (element: VisualElement) => void;
}

const categories: { id: ElementCategory; name: string; icon: string }[] = [
    { id: 'basic', name: 'Basic', icon: '📝' },
    { id: 'layout', name: 'Layout', icon: '📦' },
    { id: 'navigation', name: 'Navigation', icon: '🧭' },
    { id: 'forms', name: 'Forms', icon: '📋' },
    { id: 'content', name: 'Content', icon: '🃏' },
    { id: 'media', name: 'Media', icon: '🖼️' },
    { id: 'interactive', name: 'Interactive', icon: '🪟' },
    { id: 'advanced', name: 'Advanced', icon: '📈' },
];

export function ElementPalette({ onAddElement }: ElementPaletteProps) {
    const [activeCategory, setActiveCategory] = useState<ElementCategory>('basic');
    const [searchQuery, setSearchQuery] = useState('');

    const handleDragStart = (e: React.DragEvent, templateType: string) => {
        e.dataTransfer.setData('elementType', templateType);
    };

    const handleClick = (templateType: string) => {
        const template = ELEMENT_TEMPLATES.find(t => t.type === templateType);
        if (!template) return;

        const newElement: VisualElement = {
            id: `el-${Date.now()}`,
            type: template.type,
            category: template.category,
            position: { x: 100, y: 100 },
            size: template.defaultSize,
            properties: { ...template.defaultProperties },
            styles: { ...template.defaultStyles },
        };

        onAddElement(newElement);
    };

    const filteredElements = getElementsByCategory(activeCategory).filter(
        template =>
            searchQuery === '' ||
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
                <input
                    type="text"
                    placeholder="Search elements..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors ${activeCategory === cat.id
                                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                    >
                        <span className="mr-1">{cat.icon}</span>
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Elements Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-2">
                    {filteredElements.map(template => (
                        <button
                            key={template.type}
                            draggable
                            onDragStart={e => handleDragStart(e, template.type)}
                            onClick={() => handleClick(template.type)}
                            className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all cursor-move"
                            title={template.description}
                        >
                            <span className="text-2xl">{template.icon}</span>
                            <span className="text-xs font-medium text-gray-700 text-center">
                                {template.name}
                            </span>
                        </button>
                    ))}
                </div>

                {filteredElements.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No elements found
                    </div>
                )}
            </div>
        </div>
    );
}
