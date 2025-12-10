"use client";

import React, { useState } from "react";
import { Node, Edge } from "reactflow";
import { Play, Search, Settings, ChevronRight, Monitor, Smartphone, Maximize2, Plus } from "lucide-react";

import FlowCanvas from "./FlowCanvas";
import NodeEditorModal from "./NodeEditorModal";
import PreviewPane from "./PreviewPane";
import SuggestionMenu from "./SuggestionMenu";
import AIChatPanel from "./AIChatPanel";

import { toTOON } from "../../utils/toon";
import { generateAppBoilerplate } from "../../app/actions/ai";
import { PanelResizeHandle, Panel, PanelGroup } from "react-resizable-panels";

/* ------------------ PALETTE COMPONENTS ------------------ */
function PaletteSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-8">
            <h3 className="text-[13px] font-semibold text-gray-900 mb-3 px-1">{title}</h3>
            <div className="space-y-1">{children}</div>
        </div>
    );
}

function PaletteItem({ label, icon, onClick }: { label: string; icon: any; onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer transition-all group"
        >
            <div className="w-6 h-6 flex items-center justify-center text-gray-500 group-hover:text-gray-900">
                {typeof icon === 'string' ? <span className="text-lg leading-none">{icon}</span> : icon}
            </div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{label}</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-3 h-3 text-gray-400" />
            </div>
        </div>
    );
}

export default function EditorShell() {
    /* 🔹 UI State */
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCode, setGeneratedCode] = useState<string | undefined>(undefined);
    const [pendingChatMsg, setPendingChatMsg] = useState<string | null>(null);
    const [tokenStats, setTokenStats] = useState<{ jsonSize: number; toonSize: number; savedPercent: number } | null>(null);

    /* 🔹 ReactFlow State */
    const [nodes, setNodes] = useState<Node[]>([
        {
            id: "start-trigger",
            type: "default",
            position: { x: 100, y: 100 },
            data: { label: "Input Node (Form)" },
            style: {
                width: 240,
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                color: "#1e293b",
                fontWeight: "500",
                fontSize: "14px"
            },
        },
        {
            id: "ai-logic",
            type: "default",
            position: { x: 400, y: 100 },
            data: { label: "AI Logic Node" },
            style: {
                width: 240,
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                color: "#1e293b",
                fontWeight: "500",
                fontSize: "14px"
            },
        },
        {
            id: "output-node",
            type: "default",
            position: { x: 700, y: 100 },
            data: { label: "Output Node (Result)" },
            style: {
                width: 240,
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                color: "#1e293b",
                fontWeight: "500",
                fontSize: "14px"
            },
        }
    ]);
    const [edges, setEdges] = useState<Edge[]>([
        { id: 'e1-2', source: 'start-trigger', target: 'ai-logic', animated: true, style: { stroke: '#cbd5e1' } },
        { id: 'e2-3', source: 'ai-logic', target: 'output-node', animated: true, style: { stroke: '#cbd5e1' } }
    ]);

    /* 🔹 UI State */
    const [editNode, setEditNode] = useState<Node | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [suggestionPos, setSuggestionPos] = useState<{ x: number; y: number } | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    /* 🔹 Handlers */
    const handleAddNode = (label: string) => {
        const newNode: Node = {
            id: `node-${Date.now()}`,
            type: "default",
            position: { x: 250, y: 250 },
            data: { label },
            style: {
                width: 240,
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                color: "#1e293b",
                fontWeight: "500",
                fontSize: "14px"
            }
        };
        setNodes((nds) => [...nds, newNode]);
        return newNode;
    };

    const handleNodeClick = (node: Node | null) => {
        if (node) {
            setSelectedNodeId(node.id);
        } else {
            setSelectedNodeId(null);
            setSuggestionPos(null);
        }
    };

    const toggleSuggestionMenu = (e: React.MouseEvent | { clientX: number, clientY: number }) => {
        if (e && 'preventDefault' in e && typeof e.preventDefault === 'function') {
            e.preventDefault();
            e.stopPropagation();
        }
        setSuggestionPos({ x: ('clientX' in e ? e.clientX : 500), y: ('clientY' in e ? e.clientY : 300) });
    };

    const handleActionSelect = (actionLabel: string) => {
        // Handle "Delete Node" specially
        if (actionLabel === "Delete Node" && selectedNodeId) {
            setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
            setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
            setSelectedNodeId(null); // Clear selection
            setSuggestionPos(null);
            return;
        }

        const newNode = handleAddNode(actionLabel);
        if (selectedNodeId) {
            const parentNode = nodes.find(n => n.id === selectedNodeId);
            if (parentNode) {
                newNode.position = {
                    x: parentNode.position.x + 300,
                    y: parentNode.position.y
                };
            }
            const newEdge: Edge = {
                id: `edge-${selectedNodeId}-${newNode.id}`,
                source: selectedNodeId,
                target: newNode.id,
                animated: true,
                style: { stroke: '#cbd5e1', strokeWidth: 2 }
            };
            setEdges((eds) => [...eds, newEdge]);
            setSelectedNodeId(newNode.id);
        }
        setNodes((nds) => nds.map(n => n.id === newNode.id ? newNode : n));
        setSuggestionPos(null);
    };

    return (
        <div className="flex flex-col h-screen w-full bg-white text-slate-900 font-sans">

            {/* ---------------- GLOBAL HEADER ---------------- */}
            <header className="h-16 px-6 border-b border-gray-100 flex items-center justify-between bg-white z-50">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        AvatarFlowX Editor
                    </h1>
                    <span className="text-xs text-slate-500 font-medium">Build apps visually.</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                        Export
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                setIsGenerating(true);

                                // TOON Logic: Convert flow to optimized string
                                const toonData = toTOON(nodes, edges);

                                // Calculate Savings
                                const jsonSize = JSON.stringify({ nodes, edges }).length;
                                const toonSize = toonData.length;
                                const savedPercent = Math.round((1 - toonSize / jsonSize) * 100);
                                setTokenStats({ jsonSize, toonSize, savedPercent });

                                console.log(`TOON Optimization: ${jsonSize} -> ${toonSize} bytes (${savedPercent}% saved)`);
                                console.log("Sending TOON Data:", toonData);

                                const code = await generateAppBoilerplate(toonData);
                                console.log("GENERATED CODE RECEIVED:", code); // Debug log

                                if (!code || code.trim().length === 0) {
                                    alert("AI returned empty code.");
                                } else if (code.startsWith("// Error")) {
                                    alert("AI generation error: " + code);
                                }

                                setGeneratedCode(code);
                                setIsGenerating(false);
                            } catch (e) {
                                setIsGenerating(false);
                                alert("Failed to generate app.");
                            }
                        }}
                        disabled={isGenerating}
                        className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>Generate App</>
                        )}
                    </button>
                </div>
            </header>

            {/* ---------------- MAIN CONTENT ---------------- */}
            <div className="flex-1 overflow-hidden">
                {!mounted ? (
                    <div className="flex items-center justify-center h-full bg-slate-50">
                        <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    <PanelGroup direction="horizontal">
                        {/* ---------------- LEFT SIDEBAR ---------------- */}
                        <Panel defaultSize={20} minSize={15} maxSize={30} className="flex flex-col bg-white">
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

                                {/* Flow Builder Intro */}
                                <div className="mb-6">
                                    <h2 className="text-sm font-bold text-slate-900 mb-1">Workflow Builder</h2>
                                    <p className="text-xs text-slate-500">Select components to build your app logic.</p>
                                </div>

                                {/* Common Chats / Templates */}
                                <div className="mb-6 space-y-2">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Common Workflows</h3>
                                    {[
                                        { label: "Portfolio Website", prompt: "Create a modern Portfolio website with a Hero section, About Me, Project Gallery (grid), and Contact Form." },
                                        { label: "SaaS Dashboard", prompt: "Build a comprehensive SaaS Dashboard with a sidebar, top metrics cards, revenue chart, and recent activity table." },
                                        { label: "E-commerce Store", prompt: "Generate an E-commerce flow: Product Listing Page with filters -> Product Details -> Shopping Cart -> Checkout." },
                                        { label: "Social Media Feed", prompt: "Design a social media feed with a 'Post Input' area, infinite scroll stream of posts (avatar + content), and a right sidebar for trends." },
                                        { label: "Task Manager (Kanban)", prompt: "Create a Kanban-style Task Manager with columns for 'To Do', 'In Progress', and 'Done', including drag-and-drop visuals." },
                                        { label: "Login & Auth Flow", prompt: "Build a secure Authentication flow: Login Screen with social buttons -> Forgot Password -> Two-Factor Verification." },
                                        { label: "AI Chat Interface", prompt: "Design a ChatGPT-style AI interface with a left sidebar for history and a main chat area with input box and message bubbles." },
                                        { label: "Landing Page (Startup)", prompt: "Create a high-conversion Startup Landing Page with: Sticky Navbar, Value Prop Hero, Feature Grid, Testimonials, and Pricing Table." }
                                    ].map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setPendingChatMsg(item.prompt);
                                                // Clear it shortly after so it can be triggered again if needed
                                                setTimeout(() => setPendingChatMsg(null), 500);
                                            }}
                                            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center justify-between group"
                                        >
                                            {item.label}
                                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-indigo-400" />
                                        </button>
                                    ))}
                                </div>

                                {/* Tip */}
                                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-xs text-yellow-700 leading-relaxed">
                                    <strong>Tip:</strong> Double-click nodes to add specifications like "Use red buttons" or "Dark mode".
                                </div>
                            </div>

                            {/* AI Chat Layout Adjustment */}
                            <div className="border-t border-gray-100 h-[350px]">
                                <AIChatPanel
                                    onApplyFlow={(newNodes, newEdges) => { setNodes(newNodes); setEdges(newEdges); }}
                                    forceMessage={pendingChatMsg}
                                />
                            </div>
                        </Panel>

                        <PanelResizeHandle className="bg-transparent w-4 -ml-2 z-50 hover:bg-transparent flex items-center justify-center group outline-none">
                            <div className="w-[1px] h-8 bg-gray-200 group-hover:bg-indigo-400 transition-colors rounded-full" />
                        </PanelResizeHandle>

                        {/* ---------------- CENTER CANVAS ---------------- */}
                        <Panel defaultSize={55} minSize={30} className="bg-slate-50/50 relative flex flex-col">
                            <div className="m-4 flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
                                <div
                                    className="w-full h-full"
                                    onContextMenu={(e) => { e.preventDefault(); setSuggestionPos({ x: e.clientX, y: e.clientY }); }}
                                >
                                    <FlowCanvas
                                        nodes={nodes}
                                        edges={edges}
                                        setNodes={setNodes}
                                        setEdges={setEdges}
                                        onSelectNode={(n) => handleNodeClick(n as Node)}
                                        onNodeEdit={(node) => {
                                            setEditNode(node);
                                            setModalOpen(true);
                                        }}
                                        onAddSuggestion={toggleSuggestionMenu}
                                    />

                                    <SuggestionMenu
                                        position={suggestionPos}
                                        onClose={() => setSuggestionPos(null)}
                                        onSelect={handleActionSelect}
                                        context={selectedNodeId ? nodes.find(n => n.id === selectedNodeId)?.data.label : ""}
                                    />

                                    {/* Floating Action Button */}
                                    <div className="absolute top-6 left-6 z-10">
                                        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-lg text-xs font-medium text-slate-600 flex items-center gap-2">
                                            <Plus className="w-3 h-3 text-indigo-500" />
                                            Right-click to add nodes
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Panel>

                        <PanelResizeHandle className="bg-transparent w-4 -ml-2 z-50 hover:bg-transparent flex items-center justify-center group outline-none">
                            <div className="w-[1px] h-8 bg-gray-200 group-hover:bg-indigo-400 transition-colors rounded-full" />
                        </PanelResizeHandle>

                        {/* ---------------- RIGHT PREVIEW ---------------- */}
                        <Panel defaultSize={35} minSize={25} maxSize={60} className="flex flex-col bg-slate-50/50 p-6">
                            <div className="mb-6">
                                <h2 className="text-base font-bold text-slate-900 mb-1">Live Preview</h2>
                                <p className="text-sm text-slate-500">Generated UI updates instantly.</p>
                            </div>

                            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full w-full">
                                <div className="flex-1 overflow-hidden relative h-full w-full">
                                    <PreviewPane code={generatedCode || undefined} isGenerating={isGenerating} tokenStats={tokenStats} />
                                </div>
                            </div>
                        </Panel>

                    </PanelGroup>
                )}
            </div>

            {/* ---------------- MODALS ---------------- */}
            <NodeEditorModal
                open={modalOpen}
                node={editNode}
                onClose={() => setModalOpen(false)}
                onDelete={(id) => {
                    setNodes((nds) => nds.filter((n) => n.id !== id));
                    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
                    setModalOpen(false);
                }}
                onSave={(updated) => {
                    if (!editNode) return;
                    setNodes((prev) =>
                        prev.map((n) =>
                            n.id === editNode.id ? { ...n, data: { ...n.data, ...updated } } : n
                        )
                    );
                    setModalOpen(false);
                }}
            />
        </div>
    );
}
