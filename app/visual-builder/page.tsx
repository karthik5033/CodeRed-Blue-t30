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
import { PanelResizeHandle, Panel, PanelGroup } from 'react-resizable-panels';

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
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Top Bar */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">AvatarFlow</h1>
                        <span className="text-xs text-slate-500">Build apps visually.</span>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="ml-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200"
                        title="Go to Home"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </button>
                    <div className="text-xs text-slate-500 font-medium ml-2 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {currentPage?.name || 'Untitled'}
                        {currentPage?.type === 'landing' && currentPage.sections && (
                            <span className="ml-1 text-indigo-600">• {currentPage.sections[activeSectionIndex]?.name}</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Save Status */}
                    <div className="text-sm text-slate-600">
                        {isSaving ? (
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                                Saving...
                            </span>
                        ) : lastSaved ? (
                            <span className="text-emerald-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Saved {lastSaved.toLocaleTimeString()}
                            </span>
                        ) : null}
                    </div>
                    <button
                        onClick={saveProject}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Save
                    </button>
                    <button
                        onClick={() => setShowTemplateSelector(true)}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Load Template
                    </button>
                    <button
                        onClick={() => setShowPreview(true)}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview
                    </button>
                    <button
                        onClick={() => setShowCodeGenerator(true)}
                        className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
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
                <PanelGroup direction="horizontal">
                    {/* Left Panel - Element Palette - Resizable */}
                    <Panel defaultSize={20} minSize={15} maxSize={35} className="bg-white">
                        <ElementPalette onAddElement={handleAddElement} />
                    </Panel>

                    <PanelResizeHandle className="w-1 bg-slate-200 hover:bg-indigo-500 transition-colors cursor-col-resize relative group">
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </PanelResizeHandle>

                    {/* Center - Visual Canvas */}
                    <Panel minSize={40}>
                        <div className="h-full flex overflow-hidden">
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
                            <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
                                <PropertiesPanel
                                    element={selectedElement}
                                    onUpdateElement={handleUpdateElement}
                                />
                            </div>
                        </div>
                    </Panel>
                </PanelGroup>
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
            )
            }
        </div >
    );
}
