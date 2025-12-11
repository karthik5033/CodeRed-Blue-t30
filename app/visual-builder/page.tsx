'use client';

import { useState, useEffect, useCallback } from 'react';
import { ElementPalette } from '@/components/visual-builder/ElementPalette';
import { VisualCanvas } from '@/components/visual-builder/VisualCanvas';
import { PropertiesPanel } from '@/components/visual-builder/PropertiesPanel';
import { PageManager } from '@/components/visual-builder/PageManager';
import { CodeGenerator } from '@/components/visual-builder/CodeGenerator';
import { TemplateSelector } from '@/components/visual-builder/TemplateSelector';
import { PreviewModal } from '@/components/visual-builder/PreviewModal';
import { Page, VisualElement, Project } from '@/lib/visual-builder-types';
import { visualBuilderAPI } from '@/lib/visual-builder/visual-builder-api';

export default function VisualBuilderPage() {
    const [project, setProject] = useState<Project>({
        id: 'project-1',
        name: 'My Project',
        pages: [
            {
                id: 'page-1',
                name: 'Home',
                elements: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ],
        currentPageId: 'page-1',
    });

    const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
    const [showCodeGenerator, setShowCodeGenerator] = useState(false);
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Load or create project on mount
    useEffect(() => {
        const loadProject = async () => {
            try {
                const result = await visualBuilderAPI.getProject('1');
                if (result.success && result.data) {
                    setProject(result.data);
                } else {
                    // Create new project if doesn't exist
                    const createResult = await visualBuilderAPI.createProject('My Project');
                    if (createResult.success && createResult.data) {
                        // Reload to get full project with pages
                        const reloadResult = await visualBuilderAPI.getProject(createResult.data.id);
                        if (reloadResult.success && reloadResult.data) {
                            setProject(reloadResult.data);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to load project:', error);
            }
        };
        loadProject();
    }, []);

    // Keyboard shortcuts (Delete/Backspace to delete selected elements)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only delete if Delete or Backspace is pressed AND not focused on an input/textarea
            const activeEl = document.activeElement;
            const isInputFocused =
                activeEl?.tagName === 'INPUT' ||
                activeEl?.tagName === 'TEXTAREA' ||
                activeEl?.getAttribute('contenteditable') === 'true' ||
                activeEl?.closest('input, textarea') !== null;

            console.log('Key pressed:', e.key, 'Input focused:', isInputFocused, 'Active element:', activeEl?.tagName);

            if (!isInputFocused && (e.key === 'Delete' || e.key === 'Backspace')) {
                e.preventDefault();
                if (selectedElementIds.length > 0) {
                    // Delete inline to avoid dependency issues
                    setProject(prev => ({
                        ...prev,
                        pages: prev.pages.map(p => {
                            if (p.id !== prev.currentPageId) return p;
                            if (p.type === 'landing' && p.sections) {
                                const newSections = [...p.sections];
                                newSections[activeSectionIndex] = {
                                    ...newSections[activeSectionIndex],
                                    elements: newSections[activeSectionIndex].elements.filter(
                                        el => !selectedElementIds.includes(el.id)
                                    ),
                                };
                                return { ...p, sections: newSections, updatedAt: new Date() };
                            }
                            return {
                                ...p,
                                elements: (p.elements || []).filter(el => !selectedElementIds.includes(el.id)),
                                updatedAt: new Date(),
                            };
                        }),
                    }));
                    setSelectedElementIds([]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElementIds, activeSectionIndex]);

    // Auto-save function
    const saveProject = useCallback(async () => {
        setIsSaving(true);
        try {
            // Update current page elements
            const currentPage = project.pages.find(p => p.id === project.currentPageId);
            if (currentPage) {
                await visualBuilderAPI.updatePage(currentPage.id, {
                    elements: currentPage.elements,
                });
            }
            setLastSaved(new Date());
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setIsSaving(false);
        }
    }, [project]);

    // Get current page
    const currentPage = project.pages.find(p => p.id === project.currentPageId);

    // Get current elements (from section or page)
    const getCurrentElements = (): VisualElement[] => {
        if (!currentPage) return [];
        if (currentPage.type === 'landing' && currentPage.sections) {
            return currentPage.sections[activeSectionIndex]?.elements || [];
        }
        return currentPage.elements || [];
    };

    // Update current page
    const updateCurrentPage = (updater: (page: Page) => Page) => {
        setProject(prev => ({
            ...prev,
            pages: prev.pages.map(p =>
                p.id === prev.currentPageId ? updater(p) : p
            ),
        }));
    };

    // Add element to canvas
    const handleAddElement = (element: VisualElement) => {
        updateCurrentPage(page => {
            if (page.type === 'landing' && page.sections) {
                const newSections = [...page.sections];
                newSections[activeSectionIndex] = {
                    ...newSections[activeSectionIndex],
                    elements: [...newSections[activeSectionIndex].elements, element],
                };
                return { ...page, sections: newSections, updatedAt: new Date() };
            }
            return {
                ...page,
                elements: [...(page.elements || []), element],
                updatedAt: new Date(),
            };
        });
    };

    // Update element
    const handleUpdateElement = (elementId: string, updates: Partial<VisualElement>) => {
        updateCurrentPage(page => {
            if (page.type === 'landing' && page.sections) {
                const newSections = [...page.sections];
                newSections[activeSectionIndex] = {
                    ...newSections[activeSectionIndex],
                    elements: newSections[activeSectionIndex].elements.map(el =>
                        el.id === elementId ? { ...el, ...updates } : el
                    ),
                };
                return { ...page, sections: newSections, updatedAt: new Date() };
            }
            return {
                ...page,
                elements: (page.elements || []).map(el =>
                    el.id === elementId ? { ...el, ...updates } : el
                ),
                updatedAt: new Date(),
            };
        });
    };

    // Delete element
    const handleDeleteElement = (elementId: string) => {
        updateCurrentPage(page => {
            if (page.type === 'landing' && page.sections) {
                const newSections = [...page.sections];
                newSections[activeSectionIndex] = {
                    ...newSections[activeSectionIndex],
                    elements: newSections[activeSectionIndex].elements.filter(el => el.id !== elementId),
                };
                return { ...page, sections: newSections, updatedAt: new Date() };
            }
            return {
                ...page,
                elements: (page.elements || []).filter(el => el.id !== elementId),
                updatedAt: new Date(),
            };
        });
        setSelectedElementIds(prev => prev.filter(id => id !== elementId));
    };

    // Create new page
    const handleCreatePage = (name: string) => {
        const newPage: Page = {
            id: `page-${Date.now()}`,
            name,
            elements: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setProject(prev => ({
            ...prev,
            pages: [...prev.pages, newPage],
            currentPageId: newPage.id,
        }));
    };

    // Switch page
    const handleSwitchPage = (pageId: string) => {
        setProject(prev => ({ ...prev, currentPageId: pageId }));
        setSelectedElementIds([]);
    };

    // Rename page
    const handleRenamePage = (pageId: string, newName: string) => {
        setProject(prev => ({
            ...prev,
            pages: prev.pages.map(p =>
                p.id === pageId ? { ...p, name: newName, updatedAt: new Date() } : p
            ),
        }));
    };

    // Delete page
    const handleDeletePage = (pageId: string) => {
        if (project.pages.length === 1) {
            alert('Cannot delete the last page');
            return;
        }

        const pageIndex = project.pages.findIndex(p => p.id === pageId);
        const newCurrentPageId =
            pageId === project.currentPageId
                ? project.pages[pageIndex === 0 ? 1 : pageIndex - 1].id
                : project.currentPageId;

        setProject(prev => ({
            ...prev,
            pages: prev.pages.filter(p => p.id !== pageId),
            currentPageId: newCurrentPageId,
        }));
    };

    // Load template
    const handleLoadTemplate = (templatePages: Page[]) => {
        setProject(prev => ({
            ...prev,
            pages: templatePages,
            currentPageId: templatePages[0]?.id || 'page-1',
        }));
        setSelectedElementIds([]);
    };

    const selectedElement =
        selectedElementIds.length === 1
            ? getCurrentElements().find(el => el.id === selectedElementIds[0])
            : undefined;

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Top Bar */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-gray-900">Visual App Builder</h1>
                    <div className="text-sm text-gray-500">
                        {currentPage?.name || 'Untitled'}
                        {currentPage?.type === 'landing' && currentPage.sections && (
                            <span className="ml-2 text-purple-600">({currentPage.sections[activeSectionIndex]?.name} Section)</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Save Status */}
                    <div className="text-sm text-gray-600">
                        {isSaving ? (
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
                                Saving...
                            </span>
                        ) : lastSaved ? (
                            <span className="text-green-600">✓ Saved {lastSaved.toLocaleTimeString()}</span>
                        ) : null}
                    </div>
                    <button
                        onClick={saveProject}
                        disabled={isSaving}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        💾 Save
                    </button>
                    <button
                        onClick={() => setShowTemplateSelector(true)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        📋 Load Template
                    </button>
                    <button
                        onClick={() => setShowPreview(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        👁️ Preview
                    </button>
                    <button
                        onClick={() => setShowCodeGenerator(true)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                        Generate Code
                    </button>
                </div>
            </div>

            {/* Page Tabs */}
            <PageManager
                pages={project.pages}
                currentPageId={project.currentPageId}
                onCreatePage={handleCreatePage}
                onSwitchPage={handleSwitchPage}
                onRenamePage={handleRenamePage}
                onDeletePage={handleDeletePage}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Element Palette */}
                <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
                    <ElementPalette onAddElement={handleAddElement} />
                </div>

                {/* Center - Visual Canvas */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Section Selector for Landing Pages */}
                    {currentPage?.type === 'landing' && currentPage.sections && (
                        <div className="bg-purple-50 border-b border-purple-200 px-6 py-3">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-purple-900">Edit Section:</span>
                                <div className="flex gap-2">
                                    {currentPage.sections.map((section, idx) => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSectionIndex(idx)}
                                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeSectionIndex === idx
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-white text-purple-700 hover:bg-purple-100'
                                                }`}
                                        >
                                            {section.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <VisualCanvas
                        elements={getCurrentElements()}
                        selectedElementIds={selectedElementIds}
                        onSelectElements={setSelectedElementIds}
                        onUpdateElement={handleUpdateElement}
                        onDeleteElement={handleDeleteElement}
                    />
                </div>

                {/* Right Panel - Properties */}
                <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
                    <PropertiesPanel
                        element={selectedElement}
                        onUpdateElement={handleUpdateElement}
                    />
                </div>
            </div>

            {/* Code Generator Modal */}
            {showCodeGenerator && (
                <CodeGenerator
                    project={project}
                    onClose={() => setShowCodeGenerator(false)}
                />
            )}

            {/* Template Selector Modal */}
            {showTemplateSelector && (
                <TemplateSelector
                    onLoadTemplate={handleLoadTemplate}
                    onClose={() => setShowTemplateSelector(false)}
                />
            )}

            {/* Preview Modal */}
            {showPreview && (
                <PreviewModal
                    pages={project.pages}
                    currentPageId={project.currentPageId}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
}
