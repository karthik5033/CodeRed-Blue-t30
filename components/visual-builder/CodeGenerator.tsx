'use client';

import { useState } from 'react';
import { Project, Page, VisualElement } from '@/lib/visual-builder-types';
import { LivePreview } from './LivePreview';
import JSZip from 'jszip';

interface CodeGeneratorProps {
    project: Project;
    onClose: () => void;
}

interface FileStructure {
    path: string;
    content: string;
    type: 'frontend' | 'backend' | 'config';
}

export function CodeGenerator({ project, onClose }: CodeGeneratorProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedFiles, setGeneratedFiles] = useState<FileStructure[] | null>(null);
    const [activeFileIndex, setActiveFileIndex] = useState(0);
    const [showLivePreview, setShowLivePreview] = useState(false);
    const [showPreview, setShowPreview] = useState(true); // Show inline preview by default

    const hasAuthPages = project.pages.some(p => ['login', 'signup'].includes(p.name.toLowerCase()));
    const hasForms = project.pages.some(p => p.elements.some(e => ['input', 'textarea'].includes(e.type)));

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/visual-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project }),
            });

            const data = await response.json();
            if (data.files) {
                setGeneratedFiles(data.files);
                // Save to localStorage for preview
                localStorage.setItem(`generated_${project.id}`, JSON.stringify(data.files));
            } else {
                alert('Failed to generate code: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Code generation error:', error);
            alert('Failed to generate code');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadAll = async () => {
        if (!generatedFiles) return;

        // Create a new JSZip instance
        const zip = new JSZip();

        // Add all files to the zip
        generatedFiles.forEach(file => {
            zip.file(file.path, file.content);
        });

        // Generate the zip file
        const zipBlob = await zip.generateAsync({ type: 'blob' });

        // Download the zip file
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-generated.zip`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleCopy = () => {
        if (!generatedFiles || !generatedFiles[activeFileIndex]) return;
        navigator.clipboard.writeText(generatedFiles[activeFileIndex].content);
        alert('Copied to clipboard!');
    };

    const activeFile = generatedFiles?.[activeFileIndex];
    const activePage = project.pages[0]; // For preview, show first page

    // Render visual element function (copied from PreviewModal)
    const renderElement = (element: VisualElement) => {
        // Build style object, respecting position from element.styles
        const style: React.CSSProperties = {
            ...element.styles as React.CSSProperties,
            // Only use absolute positioning if position is 'absolute' in styles
            ...(element.styles.position === 'absolute' && {
                position: 'absolute',
                left: element.position.x,
                top: element.position.y,
            }),
            // Use dimensions from size, converting to string if needed
            width: typeof element.size.width === 'number' ? `${element.size.width}px` : element.size.width,
            height: typeof element.size.height === 'number' ? `${element.size.height}px` : element.size.height,
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Logo</div>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                {(element.properties.items || []).map((item: any, i: number) => (
                                    <a key={i} href={item.href || '#'} style={{ textDecoration: 'none' }}>{item.label || 'Link'}</a>
                                ))}
                            </div>
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
            default:
                return <div key={element.id} style={style}>{element.type}</div>;
        }
    };

    // Group files by type
    const groupedFiles = generatedFiles
        ? {
            frontend: generatedFiles.filter(f => f.type === 'frontend'),
            backend: generatedFiles.filter(f => f.type === 'backend'),
            config: generatedFiles.filter(f => f.type === 'config'),
        }
        : { frontend: [], backend: [], config: [] };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Generate Full-Stack Code</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Project: {project.name} • {project.pages.length} pages
                            {hasAuthPages && ' • Auth detected'}
                            {hasForms && ' • Forms detected'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex">
                    {!generatedFiles ? (
                        /* Before Generation */
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                            <div className="text-6xl mb-4">🚀</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Ready to Generate Full-Stack App
                            </h3>
                            <p className="text-gray-500 mb-6 max-w-2xl">
                                AI will generate a complete Next.js application with:
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-8 text-left max-w-2xl">
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="font-semibold text-purple-900 mb-2">📄 Frontend Pages</div>
                                    <ul className="text-sm text-purple-700 space-y-1">
                                        {project.pages.map(p => (
                                            <li key={p.id}>• app/{p.id}/page.tsx</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="font-semibold text-blue-900 mb-2">⚙️ Backend APIs</div>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        {hasAuthPages && <li>• Auth routes (login/signup)</li>}
                                        {hasForms && <li>• Form submission handlers</li>}
                                        <li>• Database schema (TODO)</li>
                                    </ul>
                                </div>
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-lg"
                            >
                                {isGenerating ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">⏳</span>
                                        Generating...
                                    </span>
                                ) : (
                                    '✨ Generate Complete App'
                                )}
                            </button>
                        </div>
                    ) : (
                        /* After Generation */
                        <>
                            {/* File Tree Sidebar */}
                            <div className="w-64 border-r border-gray-200 overflow-y-auto bg-gray-50">
                                <div className="p-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                                        File Structure
                                    </h3>

                                    {/* Frontend Files */}
                                    {groupedFiles.frontend.length > 0 && (
                                        <div className="mb-4">
                                            <div className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <span>📄</span> Frontend
                                            </div>
                                            {groupedFiles.frontend.map((file, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setActiveFileIndex(generatedFiles.indexOf(file))}
                                                    className={`w-full text-left px-3 py-2 rounded text-sm mb-1 transition-colors ${activeFileIndex === generatedFiles.indexOf(file)
                                                        ? 'bg-purple-100 text-purple-900 font-medium'
                                                        : 'hover:bg-gray-200 text-gray-700'
                                                        }`}
                                                >
                                                    {file.path}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Backend Files */}
                                    {groupedFiles.backend.length > 0 && (
                                        <div className="mb-4">
                                            <div className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <span>⚙️</span> Backend
                                            </div>
                                            {groupedFiles.backend.map((file, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setActiveFileIndex(generatedFiles.indexOf(file))}
                                                    className={`w-full text-left px-3 py-2 rounded text-sm mb-1 transition-colors ${activeFileIndex === generatedFiles.indexOf(file)
                                                        ? 'bg-blue-100 text-blue-900 font-medium'
                                                        : 'hover:bg-gray-200 text-gray-700'
                                                        }`}
                                                >
                                                    {file.path}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Config Files */}
                                    {groupedFiles.config.length > 0 && (
                                        <div className="mb-4">
                                            <div className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <span>⚡</span> Config
                                            </div>
                                            {groupedFiles.config.map((file, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setActiveFileIndex(generatedFiles.indexOf(file))}
                                                    className={`w-full text-left px-3 py-2 rounded text-sm mb-1 transition-colors ${activeFileIndex === generatedFiles.indexOf(file)
                                                        ? 'bg-green-100 text-green-900 font-medium'
                                                        : 'hover:bg-gray-200 text-gray-700'
                                                        }`}
                                                >
                                                    {file.path}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Main Content Area - Code and/or Preview */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Toolbar */}
                                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
                                    <div className="text-sm font-mono text-gray-700 truncate">{activeFile?.path}</div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowPreview(!showPreview)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showPreview
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            {showPreview ? '📱 Hide Preview' : '📱 Show Preview'}
                                        </button>
                                        <button
                                            onClick={() => window.open(`/preview?projectId=${project.id}`, '_blank')}
                                            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700"
                                        >
                                            🚀 Preview App
                                        </button>
                                        <button
                                            onClick={() => setShowLivePreview(true)}
                                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                                        >
                                            👁️ Live Preview
                                        </button>
                                        <button
                                            onClick={handleCopy}
                                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200"
                                        >
                                            📋 Copy
                                        </button>
                                        <button
                                            onClick={handleDownloadAll}
                                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                                        >
                                            💾 Download All ({generatedFiles.length} files)
                                        </button>
                                    </div>
                                </div>

                                {/* Full-Screen Preview (if enabled) */}
                                {showPreview && (
                                    <div className="absolute inset-0 bg-white z-10 flex flex-col">
                                        {/* Preview Header */}
                                        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
                                            <h3 className="text-lg font-semibold text-gray-900">Visual Preview</h3>
                                            <button
                                                onClick={() => setShowPreview(false)}
                                                className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                                            >
                                                ×
                                            </button>
                                        </div>

                                        {/* Preview Content */}
                                        <div className="flex-1 overflow-auto bg-gray-100 p-8">
                                            <div className="bg-white rounded-lg shadow-lg mx-auto" style={{ maxWidth: '1200px', transform: 'scale(0.8)', transformOrigin: 'top center' }}>
                                                {/* Render landing page sections */}
                                                {activePage?.type === 'landing' && activePage.sections ? (
                                                    <div>
                                                        {activePage.sections.map((section, idx) => (
                                                            <div
                                                                key={section.id}
                                                                className="relative border-b border-gray-200 last:border-0"
                                                                style={{
                                                                    minHeight: '400px',
                                                                    padding: '40px 20px',
                                                                }}
                                                            >
                                                                {/* Section label */}
                                                                <div className="absolute top-2 right-2 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium z-10">
                                                                    {section.name}
                                                                </div>

                                                                {/* Render elements without absolute positioning */}
                                                                <div className="space-y-4">
                                                                    {section.elements.map(element => {
                                                                        // Create a copy of element without absolute positioning
                                                                        const width = typeof element.size.width === 'number'
                                                                            ? (element.size.width > 800 ? '100%' : `${element.size.width}px`)
                                                                            : (Number(element.size.width) > 800 ? '100%' : element.size.width);

                                                                        const staticElement = {
                                                                            ...element,
                                                                            position: { x: 0, y: 0 },
                                                                            size: {
                                                                                width,
                                                                                height: 'auto'
                                                                            },
                                                                            styles: {
                                                                                ...element.styles,
                                                                                position: 'static',
                                                                                width,
                                                                                height: 'auto'
                                                                            }
                                                                        };
                                                                        return renderElement(staticElement);
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    /* Regular page */
                                                    <div className="relative p-8">
                                                        <div className="space-y-4">
                                                            {activePage?.elements?.map(element => {
                                                                const width = typeof element.size.width === 'number'
                                                                    ? (element.size.width > 800 ? '100%' : `${element.size.width}px`)
                                                                    : (Number(element.size.width) > 800 ? '100%' : element.size.width);

                                                                const staticElement = {
                                                                    ...element,
                                                                    position: { x: 0, y: 0 },
                                                                    size: {
                                                                        width,
                                                                        height: 'auto'
                                                                    },
                                                                    styles: {
                                                                        ...element.styles,
                                                                        position: 'static',
                                                                        width,
                                                                        height: 'auto'
                                                                    }
                                                                };
                                                                return renderElement(staticElement);
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Code Panel */}
                                <div className="flex-1 bg-gray-50 overflow-auto">
                                    <pre className="p-6 text-sm">
                                        <code className="text-gray-800 font-mono">{activeFile?.content}</code>
                                    </pre>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Live Preview Modal */}
            {showLivePreview && generatedFiles && (
                <LivePreview
                    files={generatedFiles}
                    onClose={() => setShowLivePreview(false)}
                />
            )}
        </div>
    );
}
