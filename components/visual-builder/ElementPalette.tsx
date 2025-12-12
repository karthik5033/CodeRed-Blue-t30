'use client';

import { useState } from 'react';
import { VisualElement, ElementCategory } from '@/lib/visual-builder-types';
import { ELEMENT_TEMPLATES, getElementsByCategory } from '@/lib/visual-builder/element-templates';
import { Home, Layout, Navigation, FileText, Image, Mouse, Settings } from 'lucide-react';

interface ElementPaletteProps {
    onAddElement: (element: VisualElement) => void;
}

const categories: { id: ElementCategory; name: string; icon: React.ReactNode }[] = [
    { id: 'basic', name: 'Basic', icon: <FileText className="w-4 h-4" /> },
    { id: 'layout', name: 'Layout', icon: <Layout className="w-4 h-4" /> },
    { id: 'navigation', name: 'Navigation', icon: <Navigation className="w-4 h-4" /> },
    { id: 'forms', name: 'Forms', icon: <FileText className="w-4 h-4" /> },
    { id: 'content', name: 'Content', icon: <FileText className="w-4 h-4" /> },
    { id: 'media', name: 'Media', icon: <Image className="w-4 h-4" /> },
    { id: 'interactive', name: 'Interactive', icon: <Mouse className="w-4 h-4" /> },
    { id: 'advanced', name: 'Advanced', icon: <Settings className="w-4 h-4" /> },
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

        // Calculate center position (canvas is 1024x768)
        // Subtract half the element's default width/height to truly center it
        const elementWidth = parseInt(String(template.defaultSize.width)) || 200;
        const elementHeight = parseInt(String(template.defaultSize.height)) || 100;
        const centerX = (1024 - elementWidth) / 2;
        const centerY = (768 - elementHeight) / 2;

        const newElement: VisualElement = {
            id: `el-${Date.now()}`,
            type: template.type,
            category: template.category,
            position: { x: centerX, y: centerY },
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
        <div className="h-full flex bg-white">
            {/* Vertical Category Sidebar */}
            <div className="w-16 bg-slate-50 border-r border-slate-200 flex flex-col items-center py-4 gap-2">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${activeCategory === cat.id
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                            }`}
                        title={cat.name}
                    >
                        {cat.icon}
                    </button>
                ))}
            </div>

            {/* Elements Content */}
            <div className="flex-1 flex flex-col">
                {/* Search */}
                <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder={`Search ${categories.find(c => c.id === activeCategory)?.name.toLowerCase()}...`}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50"
                        />
                    </div>
                </div>

                {/* Category Title */}
                <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        {categories.find(c => c.id === activeCategory)?.icon}
                        <h3 className="text-sm font-semibold text-slate-900">
                            {categories.find(c => c.id === activeCategory)?.name}
                        </h3>
                        <span className="ml-auto text-xs text-slate-500">
                            {filteredElements.length} {filteredElements.length === 1 ? 'element' : 'elements'}
                        </span>
                    </div>
                </div>

                {/* Elements Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 gap-3">
                        {filteredElements.map(template => (
                            <button
                                key={template.type}
                                draggable
                                onDragStart={e => handleDragStart(e, template.type)}
                                onClick={() => handleClick(template.type)}
                                className="group flex flex-col items-center gap-2 p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-lg transition-all cursor-move relative overflow-hidden"
                                title={template.description}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-violet-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-3xl relative z-10">{template.icon}</span>
                                <span className="text-xs font-medium text-slate-700 text-center relative z-10 leading-tight">
                                    {template.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    {filteredElements.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-slate-500 text-sm font-medium">No elements found</p>
                            <p className="text-slate-400 text-xs mt-1">Try a different search term</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
