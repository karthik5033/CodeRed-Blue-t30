'use client';

import { useState } from 'react';
import { Code2, Download, Copy, Check, FileCode, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FileData } from '@/types/ai-builder';
import JSZip from 'jszip';

interface CodeDisplayProps {
    files: FileData[];
    onCodeChange?: (fileIndex: number, newContent: string) => void;
}

export default function CodeDisplay({ files, onCodeChange }: CodeDisplayProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [activeFileIndex, setActiveFileIndex] = useState(0);
    const [copiedFile, setCopiedFile] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');

    if (!files || files.length === 0) return null;

    const activeFile = files[activeFileIndex];

    const handleCopy = async (file: FileData) => {
        await navigator.clipboard.writeText(file.content);
        setCopiedFile(file.name);
        setTimeout(() => setCopiedFile(null), 2000);
    };

    const handleDownload = (file: FileData) => {
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadAll = async () => {
        const zip = new JSZip();

        files.forEach(file => {
            zip.file(file.name, file.content);
        });

        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-project.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getLanguageFromType = (type: string) => {
        switch (type) {
            case 'html': return 'html';
            case 'css': return 'css';
            case 'javascript': return 'javascript';
            default: return 'text';
        }
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'html': return <FileCode className="w-4 h-4" />;
            case 'css': return <FileCode className="w-4 h-4" />;
            case 'javascript': return <FileJson className="w-4 h-4" />;
            default: return <FileCode className="w-4 h-4" />;
        }
    };

    return (
        <div className="border-t border-neutral-200 dark:border-neutral-800">
            {/* Toggle Button */}
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="w-full p-3 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    <span className="font-medium">View Code</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        ({files.length} {files.length === 1 ? 'file' : 'files'})
                    </span>
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {isVisible ? 'Hide' : 'Show'}
                </span>
            </button>

            {/* Code Display */}
            {isVisible && (
                <div className="border-t border-neutral-200 dark:border-neutral-800">
                    {/* File Tabs */}
                    {files.length > 1 && (
                        <div className="flex items-center gap-1 p-2 bg-neutral-900 border-b border-neutral-800 overflow-x-auto">
                            {files.map((file, index) => (
                                <button
                                    key={file.name}
                                    onClick={() => setActiveFileIndex(index)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeFileIndex === index
                                        ? 'bg-neutral-800 text-white'
                                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                                        }`}
                                >
                                    {getFileIcon(file.type)}
                                    {file.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className="flex items-center justify-between p-3 bg-neutral-900">
                        <div className="flex items-center gap-2">
                            {getFileIcon(activeFile.type)}
                            <span className="text-sm text-neutral-400 font-mono">
                                {activeFile.name}
                            </span>
                            {activeFile.size && (
                                <span className="text-xs text-neutral-500">
                                    ({(activeFile.size / 1024).toFixed(1)} KB)
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {onCodeChange && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (isEditing) {
                                            // Save changes
                                            onCodeChange(activeFileIndex, editedContent);
                                            setIsEditing(false);
                                        } else {
                                            // Enter edit mode
                                            setEditedContent(activeFile.content);
                                            setIsEditing(true);
                                        }
                                    }}
                                    className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 text-white transition-all"
                                >
                                    {isEditing ? 'Save' : 'Edit'}
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopy(activeFile)}
                                className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 text-white transition-all"
                            >
                                {copiedFile === activeFile.name ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2 text-green-400" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(activeFile)}
                                className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 text-white transition-all"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                            {files.length > 1 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownloadAll}
                                    className="bg-purple-600 border-purple-500 hover:bg-purple-700 hover:border-purple-600 text-white transition-all"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download All (ZIP)
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Code Content */}
                    <div className="max-h-[400px] overflow-auto">
                        {isEditing ? (
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full h-[400px] p-4 bg-[#1e1e1e] text-white font-mono text-sm resize-none focus:outline-none"
                                spellCheck={false}
                            />
                        ) : (
                            <SyntaxHighlighter
                                language={getLanguageFromType(activeFile.type)}
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    borderRadius: 0,
                                    fontSize: '13px',
                                }}
                                showLineNumbers
                            >
                                {activeFile.content}
                            </SyntaxHighlighter>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
