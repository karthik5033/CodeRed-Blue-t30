'use client';

import { useState } from 'react';
import { Page } from '@/lib/visual-builder-types';

interface PageManagerProps {
    pages: Page[];
    currentPageId: string;
    onCreatePage: (name: string) => void;
    onSwitchPage: (pageId: string) => void;
    onRenamePage: (pageId: string, newName: string) => void;
    onDeletePage: (pageId: string) => void;
}

export function PageManager({
    pages,
    currentPageId,
    onCreatePage,
    onSwitchPage,
    onRenamePage,
    onDeletePage,
}: PageManagerProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [newPageName, setNewPageName] = useState('');
    const [editingPageId, setEditingPageId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const handleCreatePage = () => {
        if (newPageName.trim()) {
            onCreatePage(newPageName.trim());
            setNewPageName('');
            setIsCreating(false);
        }
    };

    const handleRename = (pageId: string) => {
        if (editName.trim()) {
            onRenamePage(pageId, editName.trim());
            setEditingPageId(null);
            setEditName('');
        }
    };

    const startEdit = (page: Page) => {
        setEditingPageId(page.id);
        setEditName(page.name);
    };

    return (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-2">
            <div className="flex items-center gap-2 overflow-x-auto">
                {/* Page Tabs */}
                {pages.map(page => (
                    <div
                        key={page.id}
                        className={`group flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-all ${page.id === currentPageId
                                ? 'bg-white border-purple-600 text-purple-600'
                                : 'bg-transparent border-transparent text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {editingPageId === page.id ? (
                            <input
                                type="text"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                onBlur={() => handleRename(page.id)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleRename(page.id);
                                    if (e.key === 'Escape') setEditingPageId(null);
                                }}
                                className="px-2 py-1 text-sm border border-gray-300 rounded"
                                autoFocus
                            />
                        ) : (
                            <>
                                <button
                                    onClick={() => onSwitchPage(page.id)}
                                    className="text-sm font-medium"
                                >
                                    {page.name}
                                </button>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => startEdit(page)}
                                        className="p-1 hover:bg-gray-200 rounded"
                                        title="Rename"
                                    >
                                        ✏️
                                    </button>
                                    {pages.length > 1 && (
                                        <button
                                            onClick={() => onDeletePage(page.id)}
                                            className="p-1 hover:bg-red-100 rounded"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {/* New Page Button/Input */}
                {isCreating ? (
                    <div className="flex items-center gap-2 px-4 py-2">
                        <input
                            type="text"
                            value={newPageName}
                            onChange={e => setNewPageName(e.target.value)}
                            onBlur={handleCreatePage}
                            onKeyDown={e => {
                                if (e.key === 'Enter') handleCreatePage();
                                if (e.key === 'Escape') {
                                    setIsCreating(false);
                                    setNewPageName('');
                                }
                            }}
                            placeholder="Page name..."
                            className="px-2 py-1 text-sm border border-gray-300 rounded"
                            autoFocus
                        />
                    </div>
                ) : (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-t-lg transition-colors"
                    >
                        + New Page
                    </button>
                )}
            </div>
        </div>
    );
}
