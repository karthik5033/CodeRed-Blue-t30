"use client";

import React, { useState } from "react";
import { Node, Edge } from "reactflow";

import FlowCanvas from "./FlowCanvas";
import NodeEditorModal from "./NodeEditorModal";
import PreviewPane from "./PreviewPane";

/* ------------------ PALETTE ITEM COMPONENT ------------------ */
function PaletteItem({
    label,
    icon,
    color,
}: {
    label: string;
    icon: string;
    color: string;
}) {
    return (
        <div
            className={`
        flex items-center gap-3 p-3 rounded-lg border cursor-pointer 
        hover:shadow-sm hover:bg-gray-50 transition-all active:scale-[0.98]
        ${color}
      `}
        >
            <div className="text-lg">{icon}</div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
    );
}

/* --------------------------- MAIN --------------------------- */
export default function EditorShell() {
    /* 🔹 ReactFlow state (source of truth) */
    const [nodes, setNodes] = useState<Node[]>([
        {
            id: "start-1",
            type: "default",
            position: { x: 350, y: 180 },
            data: { label: "Start (Input)", description: "" },
            style: {
                width: 260,
                borderRadius: 12,
                background: "#ffffff",
                border: "2px solid #161628",
                padding: 10,
            },
        },
    ]);

    const [edges, setEdges] = useState<Edge[]>([]);

    /* 🔹 Node selection & modal state */
    const [selectedNode, setSelectedNode] = useState<any | null>(null);
    const [editNode, setEditNode] = useState<Node | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="w-full h-screen flex bg-[#f8f8fa] overflow-hidden">

            {/* ---------------- LEFT PALETTE ---------------- */}
            <div className="w-[220px] bg-white border-r border-gray-200 p-4 flex flex-col gap-3">

                <h3 className="text-xs font-semibold text-gray-500 tracking-wide mb-2">
                    Palette
                </h3>

                <PaletteItem label="Input" icon="📝" color="bg-blue-50 border-blue-200" />
                <PaletteItem label="AI Step" icon="🤖" color="bg-purple-50 border-purple-200" />
                <PaletteItem label="Output" icon="📤" color="bg-green-50 border-green-200" />
                <PaletteItem label="Decision" icon="🔀" color="bg-yellow-50 border-yellow-200" />

            </div>

            {/* ---------------- CANVAS + AI PANEL SECTION ---------------- */}
            <div className="flex flex-1 border-r border-gray-200 relative flex-col">

                {/* Top bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-semibold">AvatarFlowX — Paint Workspace</h1>
                        <span className="px-2 py-0.5 text-xs rounded-md bg-gray-100 border">beta</span>
                    </div>
                    <button className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Run</button>
                </div>

                {/* CANVAS + AI PANEL WRAPPER (side-by-side) */}
                <div className="flex flex-1">

                    {/* CANVAS AREA */}
                    <div className="flex-1 relative">
                        <div className="absolute inset-0 p-3 top-0">
                            <FlowCanvas
                                nodes={nodes}
                                edges={edges}
                                setNodes={setNodes}
                                setEdges={setEdges}
                                onSelectNode={setSelectedNode}
                                onNodeEdit={(node) => {
                                    setEditNode(node);
                                    setModalOpen(true);
                                }}
                            />
                        </div>
                    </div>

                    {/* AI SUGGESTIONS PANEL */}
                    <div className="w-72 bg-white border-l border-gray-200 shadow-md p-4">
                        <h2 className="text-sm font-semibold mb-3">AI Suggestions</h2>

                        {selectedNode ? (
                            <div className="space-y-3">
                                <p className="text-xs text-gray-500">
                                    Node: <span className="font-medium">{selectedNode.label}</span>
                                </p>

                                <button className="w-full text-left px-3 py-2 border rounded-md hover:bg-gray-50">Suggest next steps</button>
                                <button className="w-full text-left px-3 py-2 border rounded-md hover:bg-gray-50">Generate UI</button>
                                <button className="w-full text-left px-3 py-2 border rounded-md hover:bg-gray-50">Map to API</button>

                                <div className="text-xs text-gray-500 pt-3">Click a node to see suggestions.</div>
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">Click a node to see suggestions.</p>
                        )}
                    </div>

                </div>
            </div>

            {/* ---------------- RIGHT PREVIEW PANEL ---------------- */}
            <div className="w-[420px] bg-[#fff8f3] flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <div className="text-xs text-gray-500">Preview</div>
                        <div className="text-base font-semibold">Live App View</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 rounded-md border hover:bg-gray-50">Console</button>
                        <button className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Open</button>
                    </div>
                </div>

                {/* Sandpack Preview */}
                <div className="flex-1 overflow-hidden">
                    <PreviewPane />
                </div>
            </div>

            {/* ---------------- NODE EDIT MODAL ---------------- */}
            <NodeEditorModal
                open={modalOpen}
                node={editNode}
                onClose={() => setModalOpen(false)}
                onSave={(updated) => {
                    if (!editNode) return;

                    setNodes((prev) =>
                        prev.map((n) =>
                            n.id === editNode.id
                                ? { ...n, data: { ...n.data, ...updated } }
                                : n
                        )
                    );
                }}
            />
        </div>
    );
}
