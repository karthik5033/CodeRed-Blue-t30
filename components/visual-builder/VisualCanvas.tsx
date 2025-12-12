'use client';

import { useRef, useState, useEffect } from 'react';
import { VisualElement } from '@/lib/visual-builder-types';
import { getElementTemplate } from '@/lib/visual-builder/element-templates';
import { CanvasElement } from './CanvasElement';

interface VisualCanvasProps {
    elements: VisualElement[];
    selectedElementIds: string[];
    onSelectElements: (ids: string[]) => void;
    onUpdateElement: (id: string, updates: Partial<VisualElement>) => void;
    onDeleteElement: (id: string) => void;
}

export function VisualCanvas({
    elements,
    selectedElementIds,
    onSelectElements,
    onUpdateElement,
    onDeleteElement,
}: VisualCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragElement, setDragElement] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const elementType = e.dataTransfer.getData('elementType');

        if (elementType && canvasRef.current) {
            const template = getElementTemplate(elementType);
            if (!template) return;

            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left - 50;
            const y = e.clientY - rect.top - 25;

            const newElement: VisualElement = {
                id: `el-${Date.now()}`,
                type: template.type,
                category: template.category,
                position: { x, y },
                size: template.defaultSize,
                properties: { ...template.defaultProperties },
                styles: { ...template.defaultStyles },
            };

            // This will be handled by parent component
            console.log('Drop new element:', newElement);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === canvasRef.current) {
            onSelectElements([]);
        }
    };

    const handleElementMouseDown = (elementId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!selectedElementIds.includes(elementId)) {
            if (e.ctrlKey || e.metaKey) {
                onSelectElements([...selectedElementIds, elementId]);
            } else {
                onSelectElements([elementId]);
            }
        }

        const element = elements.find(el => el.id === elementId);
        if (!element || !canvasRef.current) return;

        // Calculate offset relative to canvas
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        setIsDragging(true);
        setDragElement(elementId);
        setDragOffset({
            x: mouseX - element.position.x,
            y: mouseY - element.position.y,
        });
    };

    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        if (isDragging && dragElement && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left - dragOffset.x;
            const y = e.clientY - rect.top - dragOffset.y;

            onUpdateElement(dragElement, {
                position: { x, y },
            });
        }
    };

    const handleCanvasMouseUp = () => {
        setIsDragging(false);
        setDragElement(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        // Don't delete elements if user is typing in an input/textarea/select
        const target = e.target as HTMLElement;
        const isTyping = target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable;

        if (isTyping) {
            return; // Let the input handle the key event
        }

        if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementIds.length > 0) {
            e.preventDefault(); // Prevent browser back navigation on Backspace
            selectedElementIds.forEach(id => onDeleteElement(id));
        }
    };

    // Add keyboard listener
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown as any);
        return () => window.removeEventListener('keydown', handleKeyDown as any);
    }, [selectedElementIds]);

    return (
        <div className="h-full flex flex-col items-center py-8">
            {/* Canvas Container */}
            <div className="bg-white rounded-lg shadow-lg" style={{ width: '1024px', minHeight: '768px' }}>
                <div
                    ref={canvasRef}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={handleCanvasClick}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    className="relative bg-white"
                    style={{
                        width: '1024px',
                        minHeight: '768px',
                        cursor: isDragging ? 'move' : 'default',
                    }}
                >
                    {/* Grid Background */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `
                linear-gradient(to right, #f3f4f6 1px, transparent 1px),
                linear-gradient(to bottom, #f3f4f6 1px, transparent 1px)
              `,
                            backgroundSize: '20px 20px',
                        }}
                    />

                    {/* Elements */}
                    {elements.map(element => (
                        <CanvasElement
                            key={element.id}
                            element={element}
                            isSelected={selectedElementIds.includes(element.id)}
                            onMouseDown={(e: React.MouseEvent) => handleElementMouseDown(element.id, e)}
                            onUpdate={(updates: Partial<VisualElement>) => onUpdateElement(element.id, updates)}
                        />
                    ))}

                    {/* Empty State */}
                    {elements.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center">
                                    <svg className="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                                    Start Building Your App
                                </h3>
                                <p className="text-slate-500">
                                    Drag elements from the left panel or click to add
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Canvas Tools */}
            <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    <span>Zoom: 100%</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
                    </svg>
                    <span>1024 × 768</span>
                </div>
                <span className="text-slate-300">•</span>
                <span>{elements.length} {elements.length === 1 ? 'element' : 'elements'}</span>
            </div>
        </div>
    );
}
