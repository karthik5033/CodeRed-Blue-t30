"use client";

import React, { useState, useEffect } from "react";
import { Node, Edge, ReactFlowInstance } from "reactflow";
import { Play, Search, Settings, ChevronRight, ChevronDown, Monitor, Smartphone, Maximize2, Plus, Undo, Redo } from "lucide-react";

import FlowCanvas from "./FlowCanvas";
import NodeEditorModal from "./NodeEditorModal";
import PreviewPane from "./PreviewPane";
import SuggestionMenu from "./SuggestionMenu";
import AIChatPanel from "./AIChatPanel";

import { toTOON } from "../../utils/toon";
import { generateAppBoilerplate, generateFlowFromImage } from "../../app/actions/ai";
import { PanelResizeHandle, Panel, PanelGroup } from "react-resizable-panels";
import { Upload } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";

import DatabaseViewer from "../ai-builder/DatabaseViewer";

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
    const [isUploading, setIsUploading] = useState(false);
    const [activeRightTab, setActiveRightTab] = useState<'preview' | 'database'>('preview');
    const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);

    // File Input Ref
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    /* 🔹 ReactFlow Instance for fitView control */
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

    /* 🔹 History management for undo/redo */
    const { pushHistory, undo, redo, canUndo, canRedo } = useHistory();

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
        // Restore from LocalStorage
        if (typeof window !== 'undefined') {
            const savedNodes = localStorage.getItem('avtarflow_nodes');
            const savedEdges = localStorage.getItem('avtarflow_edges');
            const savedCode = localStorage.getItem('avtarflow_generated_code');

            if (savedNodes) {
                try {
                    const parsedNodes = JSON.parse(savedNodes);
                    if (Array.isArray(parsedNodes) && parsedNodes.length > 0) setNodes(parsedNodes);
                } catch (e) { console.error("Failed to parse nodes", e); }
            }
            if (savedEdges) {
                try {
                    const parsedEdges = JSON.parse(savedEdges);
                    if (Array.isArray(parsedEdges)) setEdges(parsedEdges);
                } catch (e) { console.error("Failed to parse edges", e); }
            }
            if (savedCode) {
                setGeneratedCode(savedCode);
            }
        }
    }, []);

    // Auto-Save Nodes & Edges & Code
    React.useEffect(() => {
        if (!mounted) return;
        const timeoutId = setTimeout(() => {
            localStorage.setItem('avtarflow_nodes', JSON.stringify(nodes));
            localStorage.setItem('avtarflow_edges', JSON.stringify(edges));
            if (generatedCode) {
                localStorage.setItem('avtarflow_generated_code', generatedCode);
            }
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [nodes, edges, generatedCode, mounted]);

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+Z or Cmd+Z for undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                const prevState = undo();
                if (prevState) {
                    setNodes(prevState.nodes);
                    setEdges(prevState.edges);
                }
            }
            // Ctrl+Shift+Z or Cmd+Shift+Z or Ctrl+Y for redo
            if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
                e.preventDefault();
                const nextState = redo();
                if (nextState) {
                    setNodes(nextState.nodes);
                    setEdges(nextState.edges);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    // Track node/edge changes for undo/redo with debouncing (for drag operations)
    const prevNodesRef = React.useRef<Node[]>(nodes);
    const prevEdgesRef = React.useRef<Edge[]>(edges);

    useEffect(() => {
        const timeout = setTimeout(() => {
            // Only push to history if there's an actual change
            const nodesChanged = JSON.stringify(prevNodesRef.current) !== JSON.stringify(nodes);
            const edgesChanged = JSON.stringify(prevEdgesRef.current) !== JSON.stringify(edges);

            if (nodesChanged || edgesChanged) {
                pushHistory(prevNodesRef.current, prevEdgesRef.current);
                prevNodesRef.current = nodes;
                prevEdgesRef.current = edges;
            }
        }, 500); // Debounce for 500ms to avoid capturing every drag frame

        return () => clearTimeout(timeout);
    }, [nodes, edges, pushHistory]);

    /* 🔹 Handlers */
    const handleAddNode = (label: string) => {
        // Push current state to history before making changes
        pushHistory(nodes, edges);

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

    const handleUndo = () => {
        const prevState = undo();
        if (prevState) {
            setNodes(prevState.nodes);
            setEdges(prevState.edges);
        }
    };

    const handleRedo = () => {
        const nextState = redo();
        if (nextState) {
            setNodes(nextState.nodes);
            setEdges(nextState.edges);
        }
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // Convert to Base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                console.log("Image uploaded, sending to Gemini...");

                const flowData = await generateFlowFromImage(base64);
                if (flowData && flowData.nodes && flowData.edges) {
                    setNodes(flowData.nodes);
                    setEdges(flowData.edges);
                    if (reactFlowInstance) {
                        setTimeout(() => reactFlowInstance.fitView(), 500);
                    }
                } else {
                    alert("Could not generate flow from image. Try a clearer image.");
                }
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error(error);
            setIsUploading(false);
            alert("Upload failed.");
        }
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
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
                    >
                        {isUploading ? <div className="w-3 h-3 rounded-full border-2 border-slate-400 border-t-slate-700 animate-spin" /> : <Upload className="w-4 h-4" />}
                        Upload Flow
                    </button>
                    <button
                        onClick={handleUndo}
                        disabled={!canUndo}
                        title="Undo (Ctrl+Z)"
                        className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleRedo}
                        disabled={!canRedo}
                        title="Redo (Ctrl+Shift+Z)"
                        className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Redo className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setActiveRightTab(activeRightTab === 'preview' ? 'database' : 'preview')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors shadow-sm ${activeRightTab === 'database'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'text-slate-700 bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        {activeRightTab === 'database' ? 'Show Preview' : 'Show Database'}
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                        Export
                    </button>
                    <button
                        onClick={async () => {
                            if (!generatedCode) return;
                            try {
                                setIsGenerating(true);
                                setActiveRightTab('preview');

                                const { editReactComponent } = await import('../../app/actions/ai');
                                const enhancementPrompt = "Enhance the UI significantly (modern aesthetics, better shadows/spacing, glassmorphism) and ensure backend data consistency. Add 2-3 useful features (like sorting, filtering, or improved dashboard widgets) that make sense for this app type.";

                                const enhancedCode = await editReactComponent(generatedCode, enhancementPrompt);

                                if (enhancedCode && !enhancedCode.startsWith("// Error")) {
                                    setGeneratedCode(enhancedCode);
                                } else {
                                    alert("Enhancement failed: " + enhancedCode);
                                }
                                setIsGenerating(false);
                            } catch (e) {
                                console.error(e);
                                setIsGenerating(false);
                                alert("Failed to enhance app.");
                            }
                        }}
                        disabled={isGenerating || !generatedCode}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        Enhance
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                setIsGenerating(true);
                                setActiveRightTab('preview'); // Switch to preview on generate

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

                                {/* Common Workflows - Accordion Style */}
                                <div className="mb-6">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Common Workflows</h3>
                                    <div className="space-y-2">
                                        {[
                                            {
                                                category: "Portfolio & Business",
                                                icon: "💼",
                                                workflows: [
                                                    { label: "Portfolio Website", prompt: "Create a detailed flowchart for a modern Portfolio website with a Hero section, About Me, Project Gallery (grid), and Contact Form." },
                                                    { label: "Company Website", prompt: "Build a corporate website flowchart with Navbar, Hero Banner, Services Section (3 columns), Team Grid, and Contact Page." },
                                                    { label: "Personal Blog", prompt: "Design a blog flowchart with Header, Blog Post List (cards), Individual Post View with comments, and Sidebar with categories." },
                                                    { label: "Agency Landing Page", prompt: "Create an agency landing page with Sticky Nav, Hero CTA, Case Studies carousel, Client Logos, and Footer with links." },
                                                    { label: "Consulting Site", prompt: "Build a consultant website with Service Offerings, Testimonial Section, Booking Calendar, and Lead Capture Form." }
                                                ]
                                            },
                                            {
                                                category: "E-commerce & Retail",
                                                icon: "🛒",
                                                workflows: [
                                                    { label: "E-commerce Store", prompt: "Generate an E-commerce flowchart: Product Listing Page with filters → Product Details → Shopping Cart → Checkout." },
                                                    { label: "Product Catalog", prompt: "Create a product catalog with Grid/List toggle, Category Navigation, Search/Filter, and Quick View modals." },
                                                    { label: "Checkout Flow", prompt: "Design a multi-step checkout: Cart Review → Shipping Info → Payment → Order Confirmation with email." },
                                                    { label: "Marketplace", prompt: "Build a marketplace flowchart with Vendor Listings, Product Search, Reviews/Ratings, and Seller Dashboard." },
                                                    { label: "Digital Store", prompt: "Create a digital products store with Instant Downloads, License Keys, Purchase History, and File Management." }
                                                ]
                                            },
                                            {
                                                category: "SaaS & Dashboards",
                                                icon: "📊",
                                                workflows: [
                                                    { label: "SaaS Dashboard", prompt: "Build a flowchart for a comprehensive SaaS Dashboard with a sidebar, top metrics cards, revenue chart, and recent activity table." },
                                                    { label: "Analytics Dashboard", prompt: "Create an analytics dashboard with Real-time Stats, Line/Bar Charts, Data Tables, and Export functionality." },
                                                    { label: "Admin Panel", prompt: "Design an admin panel with User Management Table, Settings Pages, Activity Logs, and Notification Center." },
                                                    { label: "Project Dashboard", prompt: "Build a project management dashboard with Task Overview, Team Members, Progress Charts, and Calendar View." },
                                                    { label: "CRM Dashboard", prompt: "Create a CRM dashboard with Sales Pipeline, Contact List, Deal Tracker, and Performance Metrics." }
                                                ]
                                            },
                                            {
                                                category: "Social & Community",
                                                icon: "👥",
                                                workflows: [
                                                    { label: "Social Media Feed", prompt: "Design a flowchart for a social media feed with a 'Post Input' area, infinite scroll stream of posts (avatar + content), and a right sidebar for trends." },
                                                    { label: "Community Forum", prompt: "Create a forum with Thread List, Post Detail View, Reply System, User Profiles, and Moderation Tools." },
                                                    { label: "Chat Application", prompt: "Build a real-time chat app with Contacts List, Message Threads, Typing Indicators, and File Sharing." },
                                                    { label: "Event Platform", prompt: "Design an events platform with Calendar View, Event Details, RSVP System, and Attendee List." },
                                                    { label: "Membership Site", prompt: "Create a membership site with Login Wall, Member Directory, Content Library, and Discussion Boards." }
                                                ]
                                            },
                                            {
                                                category: "Productivity & Tools",
                                                icon: "⚡",
                                                workflows: [
                                                    { label: "Task Manager (Kanban)", prompt: "Create a flowchart for a Kanban-style Task Manager with columns for 'To Do', 'In Progress', and 'Done', including drag-and-drop visuals." },
                                                    { label: "Note Taking App", prompt: "Build a notes app with Sidebar Navigation, Rich Text Editor, Search, Tags, and Cloud Sync indicator." },
                                                    { label: "Calendar & Scheduling", prompt: "Design a calendar app with Month/Week/Day views, Event Creation Modal, Reminders, and Google Calendar Sync." },
                                                    { label: "Document Manager", prompt: "Create a document manager with Folder Tree, File Grid/List, Upload Area, Preview Panel, and Version History." },
                                                    { label: "Time Tracker", prompt: "Build a time tracking app with Timer Widget, Project Selection, Activity Log, Reports, and Billing Integration." }
                                                ]
                                            },
                                            {
                                                category: "Authentication & Onboarding",
                                                icon: "🔐",
                                                workflows: [
                                                    { label: "Login & Auth Flow", prompt: "Build a secure Authentication flowchart: Login Screen with social buttons → Forgot Password → Two-Factor Verification." },
                                                    { label: "Signup & Onboarding", prompt: "Create a multi-step signup: Email/Password → Profile Setup → Preferences → Welcome Tour with tooltips." },
                                                    { label: "User Profile", prompt: "Design a user profile page with Avatar Upload, Bio Editor, Account Settings, Privacy Controls, and Activity History." },
                                                    { label: "Password Reset", prompt: "Build password reset flow: Email Input → Verification Code → New Password → Success Confirmation." },
                                                    { label: "Social Login", prompt: "Create social auth integration with Google/Facebook/GitHub buttons, Account Linking, and Permission Requests." }
                                                ]
                                            },
                                            {
                                                category: "Marketing & Landing Pages",
                                                icon: "🚀",
                                                workflows: [
                                                    { label: "Landing Page (Startup)", prompt: "Create a high-conversion Startup Landing Page flowchart with: Sticky Navbar, Value Prop Hero, Feature Grid, Testimonials, and Pricing Table." },
                                                    { label: "Product Launch", prompt: "Build a product launch page with Countdown Timer, Pre-order Form, Feature Showcase, and Email Signup." },
                                                    { label: "Lead Generation", prompt: "Design a lead gen page with Hero Form, Benefits List, Social Proof, FAQ Section, and Thank You Modal." },
                                                    { label: "Webinar Registration", prompt: "Create webinar signup with Speaker Bio, Agenda, Registration Form, Calendar Add, and Confirmation Email." },
                                                    { label: "App Download Page", prompt: "Build an app landing page with Screenshots Carousel, Features Grid, App Store Badges, and Reviews Section." }
                                                ]
                                            },
                                            {
                                                category: "AI & Chat Interfaces",
                                                icon: "🤖",
                                                workflows: [
                                                    { label: "AI Chat Interface", prompt: "Design a flowchart for a ChatGPT-style AI interface with a left sidebar for history and a main chat area with input box and message bubbles." },
                                                    { label: "Chatbot Widget", prompt: "Create an embedded chatbot with Floating Button, Chat Window, Quick Replies, and Human Handoff option." },
                                                    { label: "AI Assistant Dashboard", prompt: "Build an AI assistant dashboard with Conversation History, Model Settings, Prompt Templates, and Usage Analytics." },
                                                    { label: "Voice Chat App", prompt: "Design a voice chat interface with Recording Button, Waveform Visualization, Transcript Display, and Voice Settings." },
                                                    { label: "AI Content Generator", prompt: "Create a content generator with Input Form, Generation Options, Preview Panel, Export Buttons, and History Log." }
                                                ]
                                            }
                                        ].map((group, groupIndex) => (
                                            <div key={groupIndex} className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                                                {/* Category Header - Clickable */}
                                                <button
                                                    onClick={() => setExpandedWorkflow(expandedWorkflow === group.category ? null : group.category)}
                                                    className="w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{group.icon}</span>
                                                        <span className="font-medium text-xs text-slate-700">{group.category}</span>
                                                    </div>
                                                    {expandedWorkflow === group.category ? (
                                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                                    ) : (
                                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                                    )}
                                                </button>

                                                {/* Workflows - Shown when expanded */}
                                                {expandedWorkflow === group.category && (
                                                    <div className="border-t border-slate-200 p-2 space-y-1.5 bg-slate-50">
                                                        {group.workflows.map((item, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => {
                                                                    setPendingChatMsg(item.prompt);
                                                                    setTimeout(() => setPendingChatMsg(null), 500);
                                                                }}
                                                                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-100 rounded-md hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all group"
                                                            >
                                                                {item.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>


                                {/* Tip */}
                                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-xs text-yellow-700 leading-relaxed">
                                    <strong>Tip:</strong> Double-click nodes to add specifications like "Use red buttons" or "Dark mode".
                                </div>
                            </div>

                            {/* AI Chat Layout Adjustment */}
                            <div className="border-t border-gray-100 h-[350px]">
                                <AIChatPanel
                                    onApplyFlow={(newNodes, newEdges) => {
                                        // 1. Normalize Coordinates: Shift top-left-most node to (100, 100)
                                        // This prevents the AI from generating nodes at (10000, 10000) or negative space
                                        if (newNodes.length > 0) {
                                            const minX = Math.min(...newNodes.map(n => n.position.x));
                                            const minY = Math.min(...newNodes.map(n => n.position.y));

                                            const shiftedNodes = newNodes.map(n => ({
                                                ...n,
                                                position: {
                                                    x: n.position.x - minX + 100,
                                                    y: n.position.y - minY + 100
                                                }
                                            }));

                                            setNodes(shiftedNodes);
                                        } else {
                                            setNodes(newNodes);
                                        }

                                        setEdges(newEdges);

                                        // 2. Force Fit View
                                        if (reactFlowInstance) {
                                            // Small delay to allow React Render cycle to complete
                                            setTimeout(() => {
                                                reactFlowInstance.fitView({ padding: 0.2, duration: 800 });
                                            }, 200);
                                        }
                                    }}
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
                                        onInit={(instance) => setReactFlowInstance(instance)}
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
                            <div className="mb-6 flex justify-between items-center">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 mb-1">
                                        {activeRightTab === 'database' ? 'Local Database' : 'Live Preview'}
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        {activeRightTab === 'database'
                                            ? 'Inspect SQLite data'
                                            : 'Generated UI updates instantly.'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full w-full">
                                <div className="flex-1 overflow-hidden relative h-full w-full">
                                    {activeRightTab === 'database' ? (
                                        <DatabaseViewer />
                                    ) : (
                                        <PreviewPane code={generatedCode || undefined} isGenerating={isGenerating} tokenStats={tokenStats} />
                                    )}
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
