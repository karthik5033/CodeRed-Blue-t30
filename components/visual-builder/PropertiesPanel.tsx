'use client';

import { useState } from 'react';
import { VisualElement, ElementStyles, ElementProperties } from '@/lib/visual-builder-types';

interface PropertiesPanelProps {
    element?: VisualElement;
    onUpdateElement: (id: string, updates: Partial<VisualElement>) => void;
}

export function PropertiesPanel({ element, onUpdateElement }: PropertiesPanelProps) {
    const [activeTab, setActiveTab] = useState<'properties' | 'styles'>('properties');

    if (!element) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm p-8 text-center">
                <div>
                    <div className="text-4xl mb-2">👈</div>
                    <p>Select an element to edit its properties</p>
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
                <div key="text" className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">Text</label>
                    <textarea
                        value={element.properties.text}
                        onChange={e => updateProperty('text', e.target.value)}
                        onKeyDown={e => e.stopPropagation()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                        rows={3}
                    />
                </div>
            );
        }

        // Button label
        if (element.properties.label !== undefined) {
            fields.push(
                <div key="label" className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">Label</label>
                    <input
                        type="text"
                        value={element.properties.label}
                        onChange={e => updateProperty('label', e.target.value)}
                        onKeyDown={e => e.stopPropagation()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                </div>
            );
        }

        // Image/Video source
        if (element.properties.src !== undefined) {
            fields.push(
                <div key="src" className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">Source URL</label>
                    <input
                        type="text"
                        value={element.properties.src}
                        onChange={e => updateProperty('src', e.target.value)}
                        onKeyDown={e => e.stopPropagation()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="/api/pexels-image?q=nature"
                    />
                </div>
            );
        }

        // Alt text
        if (element.properties.alt !== undefined) {
            fields.push(
                <div key="alt" className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">Alt Text</label>
                    <input
                        type="text"
                        value={element.properties.alt}
                        onChange={e => updateProperty('alt', e.target.value)}
                        onKeyDown={e => e.stopPropagation()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                </div>
            );
        }

        // Link href
        if (element.properties.href !== undefined) {
            fields.push(
                <div key="href" className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">Link URL</label>
                    <input
                        type="text"
                        value={element.properties.href}
                        onChange={e => updateProperty('href', e.target.value)}
                        onKeyDown={e => e.stopPropagation()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="https://example.com"
                    />
                </div>
            );
        }

        // Placeholder
        if (element.properties.placeholder !== undefined) {
            fields.push(
                <div key="placeholder" className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">Placeholder</label>
                    <input
                        type="text"
                        value={element.properties.placeholder}
                        onChange={e => updateProperty('placeholder', e.target.value)}
                        onKeyDown={e => e.stopPropagation()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
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
                <div key="items" className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">Navigation Items</label>
                    <div className="space-y-2">
                        {items.map((item: any, index: number) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-gray-600">Item {index + 1}</span>
                                    <button
                                        onClick={() => deleteItem(index)}
                                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                                    >
                                        ✕ Delete
                                    </button>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Label</label>
                                    <input
                                        type="text"
                                        value={item.label || ''}
                                        onChange={e => updateItem(index, 'label', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Link</label>
                                    <input
                                        type="text"
                                        value={item.href || ''}
                                        onChange={e => updateItem(index, 'href', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        placeholder="#"
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addItem}
                            className="w-full px-3 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                        >
                            + Add Item
                        </button>
                    </div>
                </div>
            );
        }

        return fields;
    };

    const renderStyleFields = () => {
        return (
            <>
                {/* Size */}
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase">Size</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-gray-600">Width</label>
                            <input
                                type="text"
                                value={element.size.width}
                                onChange={e => updateSize('width', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="auto"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">Height</label>
                            <input
                                type="text"
                                value={element.size.height}
                                onChange={e => updateSize('height', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="auto"
                            />
                        </div>
                    </div>
                </div>

                {/* Typography */}
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase">Typography</h4>
                    <div className="space-y-2">
                        <div>
                            <label className="text-xs text-gray-600">Font Size</label>
                            <input
                                type="text"
                                value={element.styles.fontSize || ''}
                                onChange={e => updateStyle('fontSize', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="16px"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">Font Weight</label>
                            <select
                                value={element.styles.fontWeight || ''}
                                onChange={e => updateStyle('fontWeight', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
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
                            <label className="text-xs text-gray-600">Text Color</label>
                            <input
                                type="color"
                                value={element.styles.color || '#000000'}
                                onChange={e => updateStyle('color', e.target.value)}
                                className="w-full h-10 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Background */}
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase">Background</h4>
                    <div>
                        <label className="text-xs text-gray-600">Background Color</label>
                        <input
                            type="color"
                            value={element.styles.backgroundColor || '#ffffff'}
                            onChange={e => updateStyle('backgroundColor', e.target.value)}
                            className="w-full h-10 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>

                {/* Spacing */}
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase">Spacing</h4>
                    <div className="space-y-2">
                        <div>
                            <label className="text-xs text-gray-600">Padding</label>
                            <input
                                type="text"
                                value={element.styles.padding || ''}
                                onChange={e => updateStyle('padding', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="20px"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">Margin</label>
                            <input
                                type="text"
                                value={element.styles.margin || ''}
                                onChange={e => updateStyle('margin', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Border */}
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase">Border</h4>
                    <div className="space-y-2">
                        <div>
                            <label className="text-xs text-gray-600">Border Radius</label>
                            <input
                                type="text"
                                value={element.styles.borderRadius || ''}
                                onChange={e => updateStyle('borderRadius', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="0px"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">Border</label>
                            <input
                                type="text"
                                value={element.styles.border || ''}
                                onChange={e => updateStyle('border', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="1px solid #000"
                            />
                        </div>
                    </div>
                </div>

                {/* Effects */}
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase">Effects</h4>
                    <div>
                        <label className="text-xs text-gray-600">Box Shadow</label>
                        <input
                            type="text"
                            value={element.styles.boxShadow || ''}
                            onChange={e => updateStyle('boxShadow', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="0 2px 4px rgba(0,0,0,0.1)"
                        />
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="text-sm font-semibold text-gray-900 mb-1">
                    {element.type.toUpperCase()}
                </div>
                <div className="text-xs text-gray-500">
                    ID: {element.id}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('properties')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'properties'
                        ? 'text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Properties
                </button>
                <button
                    onClick={() => setActiveTab('styles')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'styles'
                        ? 'text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Styles
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {activeTab === 'properties' && (
                    <>
                        {renderPropertyFields()}
                        {renderPropertyFields().length === 0 && (
                            <div className="text-sm text-gray-500 text-center py-8">
                                No editable properties
                            </div>
                        )}
                    </>
                )}
                {activeTab === 'styles' && renderStyleFields()}
            </div>
        </div>
    );
}
