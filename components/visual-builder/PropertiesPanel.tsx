'use client';

import { useState } from 'react';
import { VisualElement, ElementStyles, ElementProperties } from '@/lib/visual-builder-types';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface PropertiesPanelProps {
    element?: VisualElement;
    onUpdateElement: (id: string, updates: Partial<VisualElement>) => void;
}

export function PropertiesPanel({ element, onUpdateElement }: PropertiesPanelProps) {
    const [activeTab, setActiveTab] = useState<'properties' | 'styles'>('properties');
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['size', 'typography', 'background', 'spacing', 'border', 'effects']));

    const toggleSection = (section: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(section)) {
            newExpanded.delete(section);
        } else {
            newExpanded.add(section);
        }
        setExpandedSections(newExpanded);
    };

    if (!element) {
        return (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm p-8 text-center bg-slate-50">
                <div>
                    <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center">
                        <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                    </div>
                    <p className="font-medium text-slate-700">No Element Selected</p>
                    <p className="text-xs text-slate-500 mt-1">Select an element to edit its properties</p>
                </div>
            </div>
        );
    }

    const updateProperty = (key: string, value: any) => {
        onUpdateElement(element.id, {
            properties: { ...element.properties, [key]: value },
        });
    };

    const updateStyle = (key: string, value: any) => {
        onUpdateElement(element.id, {
            styles: { ...element.styles, [key]: value },
        });
    };

    const updateSize = (dimension: 'width' | 'height', value: string) => {
        onUpdateElement(element.id, {
            size: { ...element.size, [dimension]: value },
        });
    };

    const renderPropertyFields = () => {
        const fields: React.ReactElement[] = [];

        // Common properties for text elements
        if (element.properties.text !== undefined) {
            fields.push(
                <div key="text" className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                    <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                        Text Content
                    </label>
                    <textarea
                        value={element.properties.text}
                        onChange={e => updateProperty('text', e.target.value)}
                        onKeyDown={e => e.stopPropagation()}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={3}
                    />
                </div>
            );
        }

        // Button label
        if (element.properties.label !== undefined) {
            fields.push(
                <div key="label" className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                    <label className="text-xs font-medium text-slate-700">Label</label>
                    <input
                        type="text"
                        value={element.properties.label}
                        onChange={e => updateProperty('label', e.target.value)}
                        onKeyDown={e => e.stopPropagation()}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            );
        }

        // Image/Video source
        if (element.properties.src !== undefined) {
            fields.push(
                <div key="src" className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                    <label className="text-xs font-medium text-slate-700">Source URL</label>
                    <input
                        type="text"
                        value={element.properties.src}
                        onChange={e => updateProperty('src', e.target.value)}
                        onKeyDown={e => e.stopPropagation()}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="/api/pexels-image?q=nature"
                    />
                </div>
            );
        }

        // Alt text
        if (element.properties.alt !== undefined) {
            fields.push(
                <div key="alt" className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                    <label className="text-xs font-medium text-slate-700">Alt Text</label>
                    <input
                        type="text"
                        value={element.properties.alt}
                        onChange={e => updateProperty('alt', e.target.value)}
                        onKeyDown={e => e.stopPropagation()}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            );
        }

        // Link href
        if (element.properties.href !== undefined) {
            fields.push(
                <div key="href" className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                    <label className="text-xs font-medium text-slate-700">Link URL</label>
                    <input
                        type="text"
                        value={element.properties.href}
                        onChange={e => updateProperty('href', e.target.value)}
                        onKeyDown={e => e.stopPropagation()}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="https://example.com"
                    />
                </div>
            );
        }

        // Placeholder
        if (element.properties.placeholder !== undefined) {
            fields.push(
                <div key="placeholder" className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                    <label className="text-xs font-medium text-slate-700">Placeholder</label>
                    <input
                        type="text"
                        value={element.properties.placeholder}
                        onChange={e => updateProperty('placeholder', e.target.value)}
                        onKeyDown={e => e.stopPropagation()}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            );
        }

        // Navigation Items (navbar, menu, breadcrumb, tabs)
        if (element.properties.items !== undefined && Array.isArray(element.properties.items)) {
            const items = element.properties.items as any[];

            const updateItem = (index: number, field: string, value: string) => {
                const newItems = [...items];
                newItems[index] = { ...newItems[index], [field]: value };
                updateProperty('items', newItems);
            };

            const deleteItem = (index: number) => {
                const newItems = items.filter((_, i) => i !== index);
                updateProperty('items', newItems);
            };

            const addItem = () => {
                const newItems = [...items, { label: 'New Item', href: '#' }];
                updateProperty('items', newItems);
            };

            fields.push(
                <div key="items" className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                    <label className="text-xs font-medium text-slate-700">Navigation Items</label>
                    <div className="space-y-2">
                        {items.map((item: any, index: number) => (
                            <div key={index} className="p-3 bg-slate-50 rounded-lg space-y-2 border border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-slate-600">Item {index + 1}</span>
                                    <button
                                        onClick={() => deleteItem(index)}
                                        className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-600">Label</label>
                                    <input
                                        type="text"
                                        value={item.label || ''}
                                        onChange={e => updateItem(index, 'label', e.target.value)}
                                        className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-600">Link</label>
                                    <input
                                        type="text"
                                        value={item.href || ''}
                                        onChange={e => updateItem(index, 'href', e.target.value)}
                                        className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder="#"
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addItem}
                            className="w-full px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Item
                        </button>
                    </div>
                </div>
            );
        }

        return fields;
    };

    const CollapsibleSection = ({ title, section, children }: { title: string; section: string; children: React.ReactNode }) => {
        const isExpanded = expandedSections.has(section);
        return (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        toggleSection(section);
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
                >
                    <span className="text-xs font-semibold text-slate-700 uppercase">{title}</span>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </button>
                {isExpanded && (
                    <div className="p-4 space-y-3 bg-white">
                        {children}
                    </div>
                )}
            </div>
        );
    };

    const renderStyleFields = () => {
        return (
            <div className="space-y-3">
                {/* Size */}
                <CollapsibleSection title="Size" section="size">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-slate-600">Width</label>
                            <input
                                type="text"
                                value={element.size.width}
                                onChange={e => updateSize('width', e.target.value)}
                                onKeyDown={e => e.stopPropagation()}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="auto"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-600">Height</label>
                            <input
                                type="text"
                                value={element.size.height}
                                onChange={e => updateSize('height', e.target.value)}
                                onKeyDown={e => e.stopPropagation()}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="auto"
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Typography */}
                <CollapsibleSection title="Typography" section="typography">
                    <div>
                        <label className="text-xs text-slate-600">Font Size</label>
                        <input
                            type="text"
                            value={element.styles.fontSize || ''}
                            onChange={e => updateStyle('fontSize', e.target.value)}
                            onKeyDown={e => e.stopPropagation()}
                            
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="16px"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-600">Font Weight</label>
                        <select
                            value={element.styles.fontWeight || ''}
                            onChange={e => updateStyle('fontWeight', e.target.value)}
                            onKeyDown={e => e.stopPropagation()}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="">Default</option>
                            <option value="300">Light</option>
                            <option value="400">Normal</option>
                            <option value="500">Medium</option>
                            <option value="600">Semibold</option>
                            <option value="700">Bold</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-600 mb-1 block">Text Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={element.styles.color || '#000000'}
                                onChange={e => updateStyle('color', e.target.value)}
                                className="w-12 h-10 border border-slate-200 rounded-lg cursor-pointer"
                            />
                            <input
                                type="text"
                                value={element.styles.color || '#000000'}
                                onChange={e => updateStyle('color', e.target.value)}
                                onKeyDown={e => e.stopPropagation()}
                                
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="#000000"
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Background */}
                <CollapsibleSection title="Background" section="background">
                    <div>
                        <label className="text-xs text-slate-600 mb-1 block">Background Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={element.styles.backgroundColor || '#ffffff'}
                                onChange={e => updateStyle('backgroundColor', e.target.value)}
                                className="w-12 h-10 border border-slate-200 rounded-lg cursor-pointer"
                            />
                            <input
                                type="text"
                                value={element.styles.backgroundColor || '#ffffff'}
                                onChange={e => updateStyle('backgroundColor', e.target.value)}
                                onKeyDown={e => e.stopPropagation()}
                                
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="#ffffff"
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Spacing */}
                <CollapsibleSection title="Spacing" section="spacing">
                    <div>
                        <label className="text-xs text-slate-600">Padding</label>
                        <input
                            type="text"
                            value={element.styles.padding || ''}
                            onChange={e => updateStyle('padding', e.target.value)}
                            onKeyDown={e => e.stopPropagation()}
                            
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="20px"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-600">Margin</label>
                        <input
                            type="text"
                            value={element.styles.margin || ''}
                            onChange={e => updateStyle('margin', e.target.value)}
                            onKeyDown={e => e.stopPropagation()}
                            
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="0"
                        />
                    </div>
                </CollapsibleSection>

                {/* Border */}
                <CollapsibleSection title="Border" section="border">
                    <div>
                        <label className="text-xs text-slate-600">Border Radius</label>
                        <input
                            type="text"
                            value={element.styles.borderRadius || ''}
                            onChange={e => updateStyle('borderRadius', e.target.value)}
                            onKeyDown={e => e.stopPropagation()}
                            
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="0px"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-600">Border</label>
                        <input
                            type="text"
                            value={element.styles.border || ''}
                            onChange={e => updateStyle('border', e.target.value)}
                            onKeyDown={e => e.stopPropagation()}
                            
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="1px solid #000"
                        />
                    </div>
                </CollapsibleSection>

                {/* Effects */}
                <CollapsibleSection title="Effects" section="effects">
                    <div>
                        <label className="text-xs text-slate-600">Box Shadow</label>
                        <input
                            type="text"
                            value={element.styles.boxShadow || ''}
                            onChange={e => updateStyle('boxShadow', e.target.value)}
                            onKeyDown={e => e.stopPropagation()}
                            
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="0 2px 4px rgba(0,0,0,0.1)"
                        />
                    </div>
                </CollapsibleSection>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-violet-50">
                <div className="text-sm font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    {element.type.toUpperCase()}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                    ID: {element.id.slice(0, 12)}...
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50">
                <button
                    onClick={() => setActiveTab('properties')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'properties'
                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    Properties
                </button>
                <button
                    onClick={() => setActiveTab('styles')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'styles'
                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    Styles
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" style={{ scrollBehavior: 'auto', overflowAnchor: 'none' }}>
                {activeTab === 'properties' && (
                    <>
                        {renderPropertyFields()}
                        {renderPropertyFields().length === 0 && (
                            <div className="text-sm text-slate-500 text-center py-12 bg-white rounded-lg border border-slate-200">
                                <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="font-medium text-slate-700">No Editable Properties</p>
                                <p className="text-xs text-slate-500 mt-1">This element has no configurable properties</p>
                            </div>
                        )}
                    </>
                )}
                {activeTab === 'styles' && renderStyleFields()}
            </div>
        </div>
    );
}
