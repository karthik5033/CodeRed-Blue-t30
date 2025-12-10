"use client";

import React from "react";

interface SuggestionMenuProps {
    position: { x: number; y: number } | null;
    onSelect: (action: string) => void;
    onClose: () => void;
}

export default function SuggestionMenu({ position, onSelect, onClose }: SuggestionMenuProps) {
    if (!position) return null;

    const actions = [
        { label: "Send Email", icon: "📧", category: "Communication" },
        { label: "Create Record", icon: "📝", category: "Data" },
        { label: "AI Generate Text", icon: "✨", category: "AI" },
        { label: "Navigate to Page", icon: "🔗", category: "Navigation" },
        { label: "Make API Call", icon: "🌐", category: "External" },
    ];

    return (
        <div
            className="fixed z-[9999] bg-white rounded-lg shadow-xl border border-gray-200 w-64 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
            style={{
                left: position.x,
                top: position.y,
            }}
        >
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Add Action
                </span>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                    ✕
                </button>
            </div>

            <div className="p-1 max-h-80 overflow-y-auto">
                <div className="mb-2 px-2 pt-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-2 py-1 text-sm border rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                    />
                </div>

                {actions.map((action) => (
                    <button
                        key={action.label}
                        onClick={() => onSelect(action.label)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md flex items-center gap-3 transition-colors"
                    >
                        <span className="text-lg">{action.icon}</span>
                        <span>{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
