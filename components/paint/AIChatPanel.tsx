"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, Wand2, Terminal } from "lucide-react";
import { Node, Edge } from "reactflow";

import { generateChatResponse } from "../../app/actions/ai";

interface AIChatPanelProps {
    onApplyFlow?: (nodes: Node[], edges: Edge[]) => void;
    forceMessage?: string | null;
}

export default function AIChatPanel({ onApplyFlow, forceMessage }: AIChatPanelProps) {
    const [messages, setMessages] = useState<{ role: "user" | "ai" | "model"; text: string }[]>([
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

    // Handle external messages (e.g. from Sidebar clicks)
    useEffect(() => {
        if (forceMessage) {
            handleSend(forceMessage);
        }
    }, [forceMessage]);

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        const userMsg = { role: "user" as const, text: text };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            // Prepare history for API
            // Gemini ERROR fix: History must start with 'user'. We strictly remove the first message if it's the default AI greeting or any AI message at the start.
            // We also filter out the *current* user message from history because 'sendMessage' handles it.
            let historyMessages = messages;

            // 1. Remove the current (last) user message which we just added to state
            // (Actually, 'messages' state might not have updated yet in this closure if it was just set? 
            // no, 'messages' is from the render scope, so it's the *previous* state before the setMessages call above?
            // Wait, setMessages((prev)...) updates state for *next* render. 
            // The 'messages' variable here is still the *old* one.
            // So 'messages' contains [AI Greeting, Previous User, Previous AI...].
            // It does NOT contain the 'text' we are sending right now. Perfect.

            // 2. Filter leading AI messages
            while (historyMessages.length > 0 && historyMessages[0].role === 'ai') {
                historyMessages = historyMessages.slice(1);
            }

            const history = historyMessages.map(m => ({
                role: (m.role === 'user' ? 'user' : 'model') as "user" | "model",
                parts: m.text
            }));

            const responseText = await generateChatResponse(history, text);

            // 🔹 Extract JSON Flow Data using brace counting
            const extractBalancedJSON = (text: string): string | null => {
                const startIndex = text.indexOf('{');
                if (startIndex === -1) return null;

                let braceCount = 0;
                let inString = false;
                let escape = false;
                let endIndex = -1;

                for (let i = startIndex; i < text.length; i++) {
                    const char = text[i];

                    if (!escape && char === '"') {
                        inString = !inString;
                    }

                    if (!inString) {
                        if (char === '{') {
                            braceCount++;
                        } else if (char === '}') {
                            braceCount--;
                            if (braceCount === 0) {
                                endIndex = i;
                                break;
                            }
                        }
                    }

                    if (char === '\\' && !escape) {
                        escape = true;
                    } else {
                        escape = false;
                    }
                }

                if (endIndex !== -1) {
                    return text.substring(startIndex, endIndex + 1);
                }
                return null;
            };

            const extractedJson = extractBalancedJSON(responseText);

            if (extractedJson && onApplyFlow) {
                try {
                    const flowData = JSON.parse(extractedJson);

                    if (flowData.nodes && flowData.edges) {
                        onApplyFlow(flowData.nodes, flowData.edges);

                        // Success! Show a clean confirmation instead of the raw JSON
                        const successMsg = "✅ Canvas updated with the requested flow.\n\n" +
                            (responseText.replace(extractedJson, "").trim() || "You can now edit the nodes or generate the app.");

                        setMessages((prev) => [...prev, { role: "ai", text: successMsg }]);
                        return;
                    }
                } catch (e) {
                    console.error("Failed to parse AI flow JSON", e);
                    // Fallthrough to show raw text if parsing failed so user can see what happened
                }
            }

            setMessages((prev) => [...prev, { role: "ai", text: responseText }]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: "ai", text: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsTyping(false);
        }
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
