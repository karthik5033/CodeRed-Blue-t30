"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, Wand2, Terminal } from "lucide-react";

export default function AIChatPanel() {
    const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
        { role: "ai", text: "Hi! I'm your AvatarFlow Agent. I can help you build workflows, generate boilerplate, or explain concepts. What are we building today?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (text = input) => {
        if (!text.trim()) return;
        setMessages((prev) => [...prev, { role: "user", text: text }]);
        setInput("");
        setIsTyping(true);

        // Mock response
        setTimeout(() => {
            setIsTyping(false);
            let response = "I've updated the workflow based on your request.";
            if (text.toLowerCase().includes("boilerplate")) {
                response = "Generating boilerplate code for a new SaaS workflow...";
            } else if (text.toLowerCase().includes("explain")) {
                response = "This workflow triggers when a user clicks 'Sign Up', then validates the data, and finally creates a record in the database.";
            }
            setMessages((prev) => [...prev, { role: "ai", text: response }]);
        }, 1500);
    };

    const QuickAction = ({ icon, label, prompt }: { icon: any, label: string, prompt: string }) => (
        <button
            onClick={() => handleSend(prompt)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition text-left"
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-white border-t border-gray-200 font-sans">
            <div className="p-3 bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                        <Bot className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">AI Agent</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] text-gray-400 font-medium">Online</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${msg.role === "ai" ? "bg-white border-indigo-100 text-indigo-600 shadow-sm" : "bg-gray-800 border-transparent text-white"}`}>
                            {msg.role === "ai" ? <Sparkles className="w-4 h-4" /> : <span className="text-xs font-bold">You</span>}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm max-w-[85%] shadow-sm ${msg.role === "ai"
                                ? "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                                : "bg-indigo-600 text-white rounded-tr-none"
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="p-3 bg-white border border-gray-100 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1 h-10">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-gray-100 space-y-3">
                {/* Quick Actions */}
                {messages.length < 3 && (
                    <div className="grid grid-cols-2 gap-2">
                        <QuickAction icon={<Wand2 className="w-3 h-3" />} label="Generate Flow" prompt="Generate a boilerplate user registration flow." />
                        <QuickAction icon={<Terminal className="w-3 h-3" />} label="Explain Logic" prompt="Explain the logic of the currently selected nodes." />
                    </div>
                )}

                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Describe a workflow to build..."
                        className="w-full pl-4 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim()}
                        className="absolute right-1.5 top-1.5 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
