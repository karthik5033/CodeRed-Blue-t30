"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    ArrowLeft, Sparkles, Palette, Type, Undo, Redo, Copy, Download,
    Monitor, Tablet, Smartphone, Check, Layout, Image as ImageIcon,
    Sliders, MousePointer2, ChevronDown
} from "lucide-react";
import { SandpackProvider, SandpackPreview, SandpackLayout } from "@codesandbox/sandpack-react";
import { generateChatResponse, suggestImage } from "../actions/ai";

export default function CustomizePage() {
    // ---------------- STATE ----------------
    // History
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Core
    const [code, setCode] = useState<string>("");
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'design' | 'content' | 'images' | 'ai'>('design');
    const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [copied, setCopied] = useState(false);

    // Content Extraction
    const [textFields, setTextFields] = useState<{ id: string, label: string, value: string, index: number }[]>([]);

    // Image Search
    const [imageQuery, setImageQuery] = useState("");
    const [isSearchingImage, setIsSearchingImage] = useState(false);

    // ---------------- EFFECTS ----------------
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCode = localStorage.getItem('avtarflow_current_code');
            if (savedCode) {
                setHistory([savedCode]);
                setHistoryIndex(0);
                setCode(savedCode);
            }
        }
    }, []);

    // Extract Text Content
    useEffect(() => {
        if (!code) return;
        const regex = />([^<{]+)</g;
        let match;
        const fields = [];
        let i = 0;

        while ((match = regex.exec(code)) !== null) {
            const text = match[1].trim();
            if (text.length > 2) {
                fields.push({
                    id: `field-${i}`,
                    label: text.substring(0, 20) + (text.length > 20 ? '...' : ''),
                    value: text,
                    index: i
                });
                i++;
            }
        }
        // Only update if length differs significantly to prevent jitter
        // (In a real app, we'd use a more stable ID generation)
        if (fields.length !== textFields.length || fields[0]?.value !== textFields[0]?.value) {
            setTextFields(fields);
        }
    }, [code]);

    // ---------------- ACTIONS ----------------
    const updateCode = (newCode: string) => {
        if (newCode === code) return;
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newCode);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setCode(newCode);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setCode(history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setCode(history[historyIndex + 1]);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "App.tsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleAIEdit = async () => {
        if (!prompt.trim() || !code) return;
        setIsGenerating(true);
        try {
            const fullPrompt = `Here is my current React component code:\n\n${code}\n\nUser Request: ${prompt}\n\nPlease modify the code to satisfy the user request. Return ONLY the full, valid React component code.`;
            const historyData = [{ role: "user" as const, parts: fullPrompt }];
            let response = await generateChatResponse(historyData, prompt);
            response = response.replace(/^```(tsx|jsx|javascript|typescript)?\n/, "").replace(/\n```$/, "");
            updateCode(response);
            setPrompt("");
        } catch (error) {
            console.error("AI Edit failed:", error);
            alert("Failed to update code with AI.");
        } finally {
            setIsGenerating(false);
        }
    };

    // --- Design Helpers ---
    const applyTheme = (color: string) => {
        const updated = code.replace(/(text|bg|border|from|to|via)-(blue|indigo|violet|purple|fuchsia|pink|rose|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|gray|slate|zinc|neutral|stone)-/g, `$1-${color}-`);
        updateCode(updated);
    };

    const applyFont = (fontFamily: string) => {
        const updated = code.replace(/font-(sans|serif|mono)/g, fontFamily);
        updateCode(updated);
    };

    const applyRadius = (radius: string) => {
        const updated = code.replace(/rounded-(none|sm|md|lg|xl|2xl|3xl|full|DEFAULT)/g, `rounded-${radius}`);
        updateCode(updated);
    };

    // --- Content Helpers ---
    const handleTextChange = (originalValue: string, newValue: string) => {
        const escapedOrig = originalValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`>${escapedOrig}<`, 'g');
        const updated = code.replace(regex, `>${newValue}<`);
        updateCode(updated);
    };

    // --- Image Helpers ---
    const handleImageReplace = (newUrl: string) => {
        let updated = code;
        let changed = false;

        // 1. Replace existing image URLs in src attributes
        const srcRegex = /src="https:\/\/[^"]+\.(jpg|jpeg|png|gif|webp|svg)"/gi;
        if (srcRegex.test(updated)) {
            updated = updated.replace(srcRegex, `src="${newUrl}"`);
            changed = true;
        }

        // 2. Replace Unsplash URLs specifically
        if (!changed) {
            const unsplashRegex = /https:\/\/images\.unsplash\.com\/[^\s"']+/g;
            if (unsplashRegex.test(updated)) {
                updated = updated.replace(unsplashRegex, newUrl);
                changed = true;
            }
        }

        // 3. Replace background gradients with inline style (for hero sections)
        if (!changed) {
            // Look for divs with gradient backgrounds
            const gradientRegex = /(<div[^>]*className="[^"]*)(bg-gradient-to-[a-z]+\s+from-[^\s"]+\s+(?:via-[^\s"]+\s+)?to-[^\s"]+)([^"]*"[^>]*)(>)/g;
            if (gradientRegex.test(updated)) {
                updated = updated.replace(gradientRegex, (match, before, gradient, after, close) => {
                    // Remove the gradient classes and add inline style
                    const cleanedClasses = before + after.replace(gradient, '').trim();
                    return `${cleanedClasses} style={{ backgroundImage: "url('${newUrl}')", backgroundSize: 'cover', backgroundPosition: 'center' }}${close}`;
                });
                changed = true;
            }
        }

        // 4. Fallback: replace first img tag if nothing else worked
        if (!changed) {
            updated = updated.replace(/<img[^>]+src="([^"]+)"/, (match, oldSrc) => match.replace(oldSrc, newUrl));
        }

        updateCode(updated);
    };

    const handleImageSearch = async () => {
        if (!imageQuery.trim()) return;
        setIsSearchingImage(true);
        try {
            const url = await suggestImage(imageQuery);
            if (url) {
                handleImageReplace(url);
                setImageQuery(""); // Clear after successful add
            } else {
                alert("No image found. Try a different term.");
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsSearchingImage(false);
        }
    };

    // ---------------- UI COMPONENTS ----------------

    return (
        <div className="flex h-screen w-full bg-[#f8f9fb] font-sans overflow-hidden text-slate-900">
            {/* ---------------- PROFESSIONAL SIDEBAR ---------------- */}
            <div className="w-[340px] bg-white border-r border-gray-200 flex flex-col shrink-0 z-30 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                {/* Header */}
                <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-white">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-1.5 hover:bg-slate-50 rounded-md text-slate-400 hover:text-slate-700 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <span className="font-semibold text-sm text-slate-900 tracking-tight">Editor</span>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Icon Rail */}
                    <div className="w-14 items-center flex flex-col border-r border-gray-100 py-4 bg-slate-50/50 gap-1">
                        {[
                            { id: 'design', icon: Sliders, label: 'Design' },
                            { id: 'content', icon: Type, label: 'Content' },
                            { id: 'images', icon: ImageIcon, label: 'Media' },
                            { id: 'ai', icon: Sparkles, label: 'AI' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group relative ${activeTab === tab.id
                                    ? 'bg-white shadow text-indigo-600 ring-1 ring-gray-200'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                                    }`}
                                title={tab.label}
                            >
                                <tab.icon className="w-5 h-5" />
                                {activeTab === tab.id && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-indigo-600 rounded-r-full -ml-[1px]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                        <div className="p-5 min-h-full">
                            {/* --- DESIGN PANEL --- */}
                            {activeTab === 'design' && (
                                <div className="space-y-8 animate-in slide-in-from-left-2 duration-200">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-sm font-bold text-slate-900">Design System</h2>
                                        <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">Global</span>
                                    </div>

                                    {/* Colors */}
                                    <section>
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">Color Palette</label>
                                        <div className="grid grid-cols-6 gap-2">
                                            {[
                                                { name: 'slate', class: 'bg-slate-500 hover:ring-slate-400' },
                                                { name: 'red', class: 'bg-red-500 hover:ring-red-400' },
                                                { name: 'orange', class: 'bg-orange-500 hover:ring-orange-400' },
                                                { name: 'amber', class: 'bg-amber-500 hover:ring-amber-400' },
                                                { name: 'yellow', class: 'bg-yellow-500 hover:ring-yellow-400' },
                                                { name: 'lime', class: 'bg-lime-500 hover:ring-lime-400' },
                                                { name: 'green', class: 'bg-green-500 hover:ring-green-400' },
                                                { name: 'emerald', class: 'bg-emerald-500 hover:ring-emerald-400' },
                                                { name: 'teal', class: 'bg-teal-500 hover:ring-teal-400' },
                                                { name: 'cyan', class: 'bg-cyan-500 hover:ring-cyan-400' },
                                                { name: 'sky', class: 'bg-sky-500 hover:ring-sky-400' },
                                                { name: 'blue', class: 'bg-blue-500 hover:ring-blue-400' },
                                                { name: 'indigo', class: 'bg-indigo-500 hover:ring-indigo-400' },
                                                { name: 'violet', class: 'bg-violet-500 hover:ring-violet-400' },
                                                { name: 'fuchsia', class: 'bg-fuchsia-500 hover:ring-fuchsia-400' },
                                                { name: 'pink', class: 'bg-pink-500 hover:ring-pink-400' },
                                                { name: 'rose', class: 'bg-rose-500 hover:ring-rose-400' },
                                            ].map((colorObj) => (
                                                <button
                                                    key={colorObj.name}
                                                    onClick={() => applyTheme(colorObj.name)}
                                                    className={`w-8 h-8 rounded-full ${colorObj.class} shadow-sm hover:scale-110 transition-all ring-1 ring-slate-200 ring-offset-1`}
                                                    title={colorObj.name}
                                                />
                                            ))}
                                        </div>
                                    </section>

                                    <hr className="border-dashed border-gray-100" />

                                    {/* Typography */}
                                    <section>
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">Typography</label>
                                        <div className="space-y-2">
                                            {[
                                                { id: 'font-sans', name: 'Inter', type: 'Sans Serif' },
                                                { id: 'font-serif', name: 'Merriweather', type: 'Serif' },
                                                { id: 'font-mono', name: 'JetBrains Mono', type: 'Monospace' },
                                            ].map((font) => (
                                                <button
                                                    key={font.id}
                                                    onClick={() => applyFont(font.id)}
                                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 bg-white hover:border-indigo-400 hover:ring-1 hover:ring-indigo-400/20 transition-all group active:bg-slate-50"
                                                >
                                                    <span className={`text-sm text-slate-700 ${font.id}`}>{font.name}</span>
                                                    <span className="text-[10px] text-slate-400 group-hover:text-indigo-500 font-medium">{font.type}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Radius */}
                                    <section>
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">Border Radius</label>
                                        <div className="flex bg-slate-100 p-1 rounded-lg">
                                            {[
                                                { id: 'none', label: 'Square' },
                                                { id: 'md', label: 'Soft' },
                                                { id: 'full', label: 'Round' },
                                            ].map((r) => (
                                                <button
                                                    key={r.id}
                                                    onClick={() => applyRadius(r.id)}
                                                    className="flex-1 py-1.5 text-xs font-medium text-slate-600 rounded-md hover:bg-white hover:shadow-sm transition-all active:scale-95 focus:bg-white focus:shadow-sm"
                                                >
                                                    {r.label}
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            )}

                            {/* --- CONTENT PANEL --- */}
                            {activeTab === 'content' && (
                                <div className="space-y-6 animate-in slide-in-from-left-2 duration-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-sm font-bold text-slate-900">Text Content</h2>
                                    </div>

                                    {textFields.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-200 rounded-xl bg-slate-50/50">
                                            <Layout className="w-8 h-8 text-gray-300 mb-2" />
                                            <p className="text-xs text-gray-400 font-medium">No editable fields detected.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {textFields.map((field, idx) => (
                                                <div key={idx} className="group relative">
                                                    <label className="text-[11px] font-semibold text-slate-500 mb-1.5 block truncate group-hover:text-indigo-600 transition-colors">
                                                        {field.label}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        defaultValue={field.value}
                                                        onBlur={(e) => handleTextChange(field.value, e.target.value)}
                                                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all placeholder:text-slate-300"
                                                        placeholder="Enter content..."
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- IMAGES PANEL --- */}
                            {activeTab === 'images' && (
                                <div className="space-y-6 animate-in slide-in-from-left-2 duration-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-sm font-bold text-slate-900">Media Library</h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            // Gradients & Abstract
                                            { url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80", label: "Gradient" },
                                            { url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80", label: "Dark Wave" },

                                            // Business & Office
                                            { url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80", label: "Office" },
                                            { url: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&w=1200&q=80", label: "Meeting" },

                                            // Tech & Code
                                            { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80", label: "Code" },
                                            { url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80", label: "Tech" },

                                            // Architecture & Buildings
                                            { url: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80", label: "Building" },
                                            { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", label: "Skyline" },

                                            // Nature & Landscape
                                            { url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80", label: "Nature" },
                                            { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80", label: "Mountain" },

                                            // Products
                                            { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80", label: "Shoe" },
                                            { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80", label: "Phone" },

                                            // Data & Analytics
                                            { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", label: "Charts" },
                                            { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80", label: "Analytics" },

                                            // Minimal & Clean
                                            { url: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80", label: "Minimal" },
                                            { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80", label: "Abstract" },

                                            // People & Team
                                            { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80", label: "Team" },
                                            { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80", label: "Portrait" }
                                        ].map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleImageReplace(img.url)}
                                                className="group relative aspect-video rounded-lg overflow-hidden bg-slate-100 ring-1 ring-black/5 hover:ring-2 hover:ring-indigo-500 transition-all hover:shadow-lg"
                                            >
                                                <img src={img.url} alt={img.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                                    <span className="text-xs font-bold text-white tracking-wide bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 shadow-sm">
                                                        Use Image
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-gray-200">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Custom URL or Search</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Paste URL or ask AI for 'mountains'..."
                                                value={imageQuery}
                                                onChange={(e) => setImageQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleImageSearch()}
                                                className="flex-1 px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            />
                                            {/* AI Search Button */}
                                            <button
                                                onClick={handleImageSearch}
                                                disabled={isSearchingImage || !imageQuery}
                                                className="px-3 bg-fuchsia-500 text-white rounded-lg text-xs font-bold hover:bg-fuchsia-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 min-w-[32px]"
                                                title="AI Search & Add"
                                            >
                                                {isSearchingImage ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                            </button>

                                            {/* Standard Add Button */}
                                            <button
                                                onClick={() => {
                                                    if (imageQuery) handleImageReplace(imageQuery);
                                                }}
                                                className="px-3 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm shrink-0"
                                            >
                                                Use
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- AI PANEL --- */}
                            {activeTab === 'ai' && (
                                <div className="space-y-4 animate-in slide-in-from-left-2 duration-200 h-full flex flex-col">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-sm font-bold text-slate-900">AI Assistant</h2>
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                                            <Sparkles className="w-3 h-3" />
                                            <span className="text-[10px] font-bold">Pro</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 bg-gradient-to-b from-indigo-50/50 to-white border border-indigo-50 rounded-xl p-4 flex flex-col">
                                        <p className="text-xs text-indigo-900/60 font-medium mb-auto leading-relaxed">
                                            Describe any change you want to make. The AI understands layout, style, and content.
                                        </p>

                                        <div className="space-y-3 mt-4">
                                            {[
                                                "Make it dark mode",
                                                "Add a contact form",
                                                "Make buttons pill shaped"
                                            ].map((suggestion, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setPrompt(suggestion)}
                                                    className="w-full text-left px-3 py-2 text-[11px] text-indigo-600 bg-white border border-indigo-100 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
                                                >
                                                    ✨ "{suggestion}"
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="What should we change?"
                                            className="w-full h-32 p-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none shadow-sm transition-all placeholder:text-slate-300"
                                        />
                                        <button
                                            onClick={handleAIEdit}
                                            disabled={isGenerating || !prompt.trim()}
                                            className="w-full mt-3 py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-700 transition shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>PROCESSING...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>GENERATE CHANGES</span>
                                                    <Sparkles className="w-3.5 h-3.5 opacity-80" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- MAIN PREVIEW AREA ---------------- */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fb]">
                <div className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
                    {/* Viewport Toggles */}
                    <div className="flex bg-gray-100/80 p-0.5 rounded-lg border border-gray-200/50">
                        <button
                            onClick={() => setPreviewMode('desktop')}
                            className={`p-1.5 px-3 rounded-md transition-all flex items-center gap-2 ${previewMode === 'desktop' ? 'bg-white shadow-sm text-slate-900 border border-gray-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Monitor className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setPreviewMode('tablet')}
                            className={`p-1.5 px-3 rounded-md transition-all flex items-center gap-2 ${previewMode === 'tablet' ? 'bg-white shadow-sm text-slate-900 border border-gray-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Tablet className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setPreviewMode('mobile')}
                            className={`p-1.5 px-3 rounded-md transition-all flex items-center gap-2 ${previewMode === 'mobile' ? 'bg-white shadow-sm text-slate-900 border border-gray-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Smartphone className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                            <button
                                onClick={undo}
                                disabled={historyIndex <= 0}
                                className="p-1.5 px-2.5 hover:bg-slate-50 text-slate-500 rounded-md disabled:opacity-30 transition-colors border-r border-gray-100"
                            >
                                <Undo className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={redo}
                                disabled={historyIndex >= history.length - 1}
                                className="p-1.5 px-2.5 hover:bg-slate-50 text-slate-500 rounded-md disabled:opacity-30 transition-colors"
                            >
                                <Redo className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-gray-200"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied" : "Copy"}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm hover:shadow"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 overflow-auto relative flex flex-col items-center justify-start py-8 px-4">
                    {code ? (
                        <div
                            className={`bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl border border-gray-200/80 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${previewMode === 'mobile' ? 'w-[375px] aspect-[375/812] my-auto' :
                                previewMode === 'tablet' ? 'w-[768px] aspect-[768/1024] my-auto' :
                                    'w-full h-full'
                                }`}
                        >
                            {previewMode !== 'mobile' && (
                                <div className="h-6 bg-slate-50 border-b border-gray-200/60 flex items-center px-3 gap-1.5 shrink-0">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300/80"></div>
                                </div>
                            )}

                            <div className="flex-1 relative min-h-0 bg-white">
                                <SandpackProvider
                                    key={code}
                                    template="react-ts"
                                    theme="light"
                                    files={{ "/App.tsx": { code: code, active: true }, }}
                                    customSetup={{
                                        dependencies: {
                                            "react": "18.2.0",
                                            "react-dom": "18.2.0",
                                            "lucide-react": "latest",
                                            "clsx": "latest",
                                            "tailwind-merge": "latest",
                                            "react-xarrows": "2.0.2",
                                            "react-use-gesture": "9.1.3",
                                            "framer-motion": "10.16.4",
                                            "react-router-dom": "6.22.3",
                                            "typed.js": "2.0.12",
                                            "recharts": "2.12.0",
                                            "date-fns": "latest"
                                        }
                                    }}
                                    options={{
                                        externalResources: ["https://cdn.tailwindcss.com"],
                                        classes: { "sp-wrapper": "h-full w-full", "sp-layout": "h-full w-full" }
                                    }}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <SandpackLayout style={{ height: "100%", width: "100%", borderRadius: 0, border: 'none' }}>
                                        <SandpackPreview
                                            style={{ height: "100%", width: "100%" }}
                                            showOpenInCodeSandbox={false}
                                            showRefreshButton={false}
                                            showNavigator={false}
                                        />
                                    </SandpackLayout>
                                </SandpackProvider>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 mt-20">
                            <div className="w-10 h-10 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                            <span className="text-sm font-medium">Loading Preview...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
