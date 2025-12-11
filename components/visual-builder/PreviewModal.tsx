'use client';

import { useState } from 'react';
import { Page, VisualElement } from '@/lib/visual-builder-types';

interface PreviewModalProps {
    pages: Page[];
    currentPageId: string;
    onClose: () => void;
}

export function PreviewModal({ pages, currentPageId, onClose }: PreviewModalProps) {
    const [activePageId, setActivePageId] = useState(currentPageId);

    const activePage = pages.find(p => p.id === activePageId) || pages[0];

    const renderElement = (element: VisualElement) => {
        const style: React.CSSProperties = {
            ...element.styles as React.CSSProperties,
            position: 'absolute',
            left: element.position.x,
            top: element.position.y,
            width: element.size.width,
            height: element.size.height,
        };

        switch (element.type) {
            case 'heading': {
                const HeadingTag = `h${element.properties.level || 1}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                return <HeadingTag key={element.id} style={style}>{element.properties.text}</HeadingTag>;
            }
            case 'paragraph':
            case 'text':
                return <div key={element.id} style={style}>{element.properties.text}</div>;
            case 'button':
                return <button key={element.id} style={style}>{element.properties.label}</button>;
            case 'link':
                return <a key={element.id} style={style} href={element.properties.href}>{element.properties.text}</a>;
            case 'image':
                return <img key={element.id} style={style} src={element.properties.src} alt={element.properties.alt} />;
            case 'input':
                return <input key={element.id} style={style} type="text" placeholder={element.properties.placeholder} />;
            case 'textarea':
                return <textarea key={element.id} style={style} placeholder={element.properties.placeholder}></textarea>;
            case 'card':
                return (
                    <div key={element.id} style={style}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>{element.properties.title}</h3>
                        <p>{element.properties.text}</p>
                    </div>
                );
            case 'navbar':
                return (
                    <nav key={element.id} style={style}>
                        <div style={{ fontWeight: 'bold' }}>Logo</div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            {element.properties.items?.map((item: any, i: number) => (
                                <a key={i} href={item.href} style={{ textDecoration: 'none' }}>{item.label}</a>
                            ))}
                        </div>
                    </nav>
                );
            case 'checkbox':
                return (
                    <label key={element.id} style={style}>
                        <input type="checkbox" style={{ marginRight: '8px' }} />
                        {element.properties.label}
                    </label>
                );
            case 'avatar':
                return <div key={element.id} style={{ ...style, borderRadius: '50%', backgroundColor: '#e5e7eb' }}></div>;
            case 'progress':
                const value = parseFloat(String(element.properties.value) || '50');
                const max = parseFloat(String(element.properties.max) || '100');
                return (
                    <div key={element.id} style={style}>
                        <div style={{
                            width: `${(value / max) * 100}%`,
                            height: '100%',
                            backgroundColor: '#3b82f6',
                            borderRadius: 'inherit',
                        }}></div>
                    </div>
                );
            default:
                return <div key={element.id} style={style}>{element.type}</div>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col">
            {/* Header with tabs */}
            <div className="bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-4">
                    <h2 className="text-white font-semibold text-lg">Preview</h2>
                    <div className="flex gap-2">
                        {pages.map((page) => (
                            <button
                                key={page.id}
                                onClick={() => setActivePageId(page.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activePageId === page.id
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                {page.name}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-300 text-2xl font-light px-4"
                    title="Close Preview"
                >
                    ×
                </button>
            </div>

            {/* Preview content */}
            <div className="flex-1 overflow-auto bg-gray-100 flex items-start justify-center py-8">
                <div className="bg-white rounded-lg shadow-2xl" style={{ width: '1024px', minHeight: '768px' }}>
                    {/* Landing page with sections - stack vertically */}
                    {activePage?.type === 'landing' && activePage.sections ? (
                        <div className="relative">
                            {activePage.sections.map((section, idx) => (
                                <div
                                    key={section.id}
                                    id={section.id}
                                    className="relative"
                                    style={{
                                        width: '1024px',
                                        minHeight: '600px',
                                        borderBottom: idx < activePage.sections!.length - 1 ? '2px dashed #e5e7eb' : 'none',
                                        paddingBottom: '40px',
                                        marginBottom: '40px',
                                    }}
                                >
                                    {/* Section label */}
                                    <div className="absolute top-2 right-2 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium z-10">
                                        {section.name}
                                    </div>

                                    {/* Section elements */}
                                    {section.elements.map(element => renderElement(element))}

                                    {section.elements.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center text-gray-400">
                                                <p className="text-sm">No elements in {section.name} section</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Regular page - single canvas */
                        <div className="relative" style={{ width: '1024px', minHeight: '768px' }}>
                            {/* Grid background */}
                            <div
                                className="absolute inset-0 pointer-events-none opacity-30"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(to right, #f3f4f6 1px, transparent 1px),
                                        linear-gradient(to bottom, #f3f4f6 1px, transparent 1px)
                                    `,
                                    backgroundSize: '20px 20px',
                                }}
                            />

                            {/* Elements */}
                            {activePage?.elements?.map(element => renderElement(element))}

                            {/* Empty state */}
                            {(!activePage || activePage.elements?.length === 0) && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-gray-400">
                                        <div className="text-6xl mb-4">📄</div>
                                        <p>This page has no elements</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-900 px-6 py-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <div>
                        Viewing: <span className="text-white font-medium">{activePage?.name}</span>
                        {activePage?.type === 'landing' && <span className="ml-2 text-purple-400">(Landing Page with Sections)</span>}
                    </div>
                    <div>
                        {activePage?.type === 'landing' && activePage.sections
                            ? `${activePage.sections.length} sections • ${activePage.sections.reduce((sum, s) => sum + s.elements.length, 0)} total elements`
                            : `${activePage?.elements?.length || 0} elements on this page`}
                    </div>
                </div>
            </div>
        </div>
    );
}
