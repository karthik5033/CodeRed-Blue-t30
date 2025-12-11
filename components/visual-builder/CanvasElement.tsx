'use client';

import React, { useState } from 'react';
import { VisualElement } from '@/lib/visual-builder-types';

interface CanvasElementProps {
    element: VisualElement;
    isSelected: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onUpdate: (updates: Partial<VisualElement>) => void;
}

// Resize handle component
function ResizeHandle({ position, onResize }: { position: string; onResize: (dx: number, dy: number) => void }) {
    const [isResizing, setIsResizing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsResizing(true);
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    React.useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;
            onResize(dx, dy);
            setStartPos({ x: e.clientX, y: e.clientY });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, startPos, onResize]);

    const positions: Record<string, string> = {
        nw: '-top-1 -left-1 cursor-nw-resize',
        n: '-top-1 left-1/2 -translate-x-1/2 cursor-n-resize',
        ne: '-top-1 -right-1 cursor-ne-resize',
        w: 'top-1/2 -translate-y-1/2 -left-1 cursor-w-resize',
        e: 'top-1/2 -translate-y-1/2 -right-1 cursor-e-resize',
        sw: '-bottom-1 -left-1 cursor-sw-resize',
        s: '-bottom-1 left-1/2 -translate-x-1/2 cursor-s-resize',
        se: '-bottom-1 -right-1 cursor-se-resize',
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            className={`absolute w-3 h-3 bg-purple-500 border-2 border-white rounded-full hover:scale-125 transition-transform z-20 ${positions[position]}`}
        />
    );
}

export function CanvasElement({ element, isSelected, onMouseDown, onUpdate }: CanvasElementProps) {
    const handleResize = (position: string, dx: number, dy: number) => {
        const currentWidth = parseFloat(String(element.size.width)) || 100;
        const currentHeight = parseFloat(String(element.size.height)) || 100;
        let newWidth = currentWidth;
        let newHeight = currentHeight;
        let newX = element.position.x;
        let newY = element.position.y;

        // Minimum size
        const minSize = 20;

        switch (position) {
            case 'se': // Southeast
                newWidth = Math.max(minSize, currentWidth + dx);
                newHeight = Math.max(minSize, currentHeight + dy);
                break;
            case 'sw': // Southwest
                newWidth = Math.max(minSize, currentWidth - dx);
                newHeight = Math.max(minSize, currentHeight + dy);
                newX = newWidth !== minSize ? element.position.x + dx : element.position.x;
                break;
            case 'ne': // Northeast
                newWidth = Math.max(minSize, currentWidth + dx);
                newHeight = Math.max(minSize, currentHeight - dy);
                newY = newHeight !== minSize ? element.position.y + dy : element.position.y;
                break;
            case 'nw': // Northwest
                newWidth = Math.max(minSize, currentWidth - dx);
                newHeight = Math.max(minSize, currentHeight - dy);
                newX = newWidth !== minSize ? element.position.x + dx : element.position.x;
                newY = newHeight !== minSize ? element.position.y + dy : element.position.y;
                break;
            case 'e': // East
                newWidth = Math.max(minSize, currentWidth + dx);
                break;
            case 'w': // West
                newWidth = Math.max(minSize, currentWidth - dx);
                newX = newWidth !== minSize ? element.position.x + dx : element.position.x;
                break;
            case 's': // South
                newHeight = Math.max(minSize, currentHeight + dy);
                break;
            case 'n': // North
                newHeight = Math.max(minSize, currentHeight - dy);
                newY = newHeight !== minSize ? element.position.y + dy : element.position.y;
                break;
        }

        onUpdate({
            size: { width: `${newWidth}px`, height: `${newHeight}px` },
            position: { x: newX, y: newY },
        });
    };

    const renderElement = () => {
        const baseProps = {
            style: {
                ...element.styles,
                width: element.size.width,
                height: element.size.height,
            } as React.CSSProperties,
        };

        switch (element.type) {
            case 'text':
            case 'paragraph':
                return <div {...baseProps}>{element.properties.text}</div>;

            case 'heading': {
                const HeadingTag = `h${element.properties.level || 1}`;
                return React.createElement(
                    HeadingTag,
                    baseProps,
                    element.properties.text
                );
            }

            case 'button':
                return <button {...baseProps}>{element.properties.label}</button>;

            case 'link':
                return <a {...baseProps} href={element.properties.href}>{element.properties.text}</a>;

            case 'image':
                return <img {...baseProps} src={element.properties.src} alt={element.properties.alt} />;

            case 'video':
                return <video {...baseProps} src={element.properties.src} controls={element.properties.controls} />;

            case 'icon':
                return <span {...baseProps}>{element.properties.icon}</span>;

            case 'divider':
                return <hr {...baseProps} />;

            case 'spacer':
                return <div {...baseProps} />;

            case 'container':
            case 'section':
            case 'grid':
            case 'flex':
            case 'row':
            case 'column':
                return (
                    <div {...baseProps}>
                        <div className="text-xs text-gray-400 text-center py-4">
                            {element.type.toUpperCase()} - Drop elements here
                        </div>
                    </div>
                );

            case 'navbar':
                return (
                    <nav {...baseProps}>
                        <div className="font-bold">Logo</div>
                        <div className="flex gap-4">
                            {element.properties.items?.map((item: any, i: number) => (
                                <a key={i} href={item.href} className="hover:text-purple-600">
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </nav>
                );

            case 'footer':
                return <footer {...baseProps}>{element.properties.text}</footer>;

            case 'card':
                return (
                    <div {...baseProps}>
                        <h3 className="font-bold mb-2">{element.properties.title}</h3>
                        <p>{element.properties.text}</p>
                    </div>
                );

            case 'input':
                return <input {...baseProps} type="text" placeholder={element.properties.placeholder} />;

            case 'textarea':
                return <textarea {...baseProps} placeholder={element.properties.placeholder} rows={element.properties.rows} />;

            case 'select':
                return (
                    <select {...baseProps}>
                        {element.properties.options?.map((opt: string, i: number) => (
                            <option key={i}>{opt}</option>
                        ))}
                    </select>
                );

            case 'checkbox':
                return (
                    <label {...baseProps}>
                        <input type="checkbox" className="mr-2" />
                        {element.properties.label}
                    </label>
                );

            case 'badge':
                return <span {...baseProps}>{element.properties.text}</span>;

            case 'alert':
                return (
                    <div {...baseProps} role="alert">
                        {element.properties.text}
                    </div>
                );

            case 'progress':
                const value = parseFloat(element.properties.value as string) || 0;
                const max = parseFloat(element.properties.max as string) || 100;
                return (
                    <div {...baseProps} style={{ ...baseProps.style, overflow: 'visible' }}>
                        <div
                            style={{
                                width: `${(value / max) * 100}%`,
                                height: '100%',
                                backgroundColor: '#3b82f6',
                                borderRadius: 'inherit',
                            }}
                        />
                    </div>
                );

            default:
                return (
                    <div {...baseProps}>
                        <div className="text-xs text-gray-400 text-center">
                            {element.type}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div
            onMouseDown={onMouseDown}
            className={`absolute cursor-move ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : 'hover:ring-1 hover:ring-gray-300'
                }`}
            style={{
                left: element.position.x,
                top: element.position.y,
                userSelect: 'none',
            }}
        >
            {renderElement()}

            {/* Selection Handles */}
            {isSelected && (
                <>
                    <div className="absolute -top-6 left-0 bg-purple-500 text-white text-xs px-2 py-1 rounded z-10">
                        {element.type}
                    </div>
                    {/* Resize Handles */}
                    <ResizeHandle position="nw" onResize={(dx, dy) => handleResize('nw', dx, dy)} />
                    <ResizeHandle position="n" onResize={(dx, dy) => handleResize('n', dx, dy)} />
                    <ResizeHandle position="ne" onResize={(dx, dy) => handleResize('ne', dx, dy)} />
                    <ResizeHandle position="w" onResize={(dx, dy) => handleResize('w', dx, dy)} />
                    <ResizeHandle position="e" onResize={(dx, dy) => handleResize('e', dx, dy)} />
                    <ResizeHandle position="sw" onResize={(dx, dy) => handleResize('sw', dx, dy)} />
                    <ResizeHandle position="s" onResize={(dx, dy) => handleResize('s', dx, dy)} />
                    <ResizeHandle position="se" onResize={(dx, dy) => handleResize('se', dx, dy)} />
                </>
            )}
        </div>
    );
}
