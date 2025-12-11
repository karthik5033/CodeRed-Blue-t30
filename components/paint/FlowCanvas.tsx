"use client";

import React, { useCallback } from "react";
import { Background, BackgroundVariant, useReactFlow, ReactFlowInstance } from "reactflow";
import ReactFlow, {
  addEdge,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  NodeProps,
  Handle,
  Position
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus } from "lucide-react";

/* ---------------- CUSTOM NODE ---------------- */
// Wrapper to add the Bubble-like (+) button
const CustomNode = ({ data, selected }: NodeProps) => {
  return (
    <div
      className={`relative group rounded-xl border-2 transition-all shadow-sm ${selected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-indigo-300'}`}
      style={{
        backgroundColor: data.color || '#ffffff',
        minHeight: '60px',
        minWidth: '150px'
      }}
    >
      <div className="h-full w-full relative py-2">
        {/* Top Handle (Target/Source) */}
        <Handle
          id="top"
          type="target"
          position={Position.Top}
          className="!bg-indigo-300 hover:!bg-indigo-500 !w-3 !h-3 rounded-full opacity-0 group-hover:opacity-100 transition-all border-2 border-white -mt-1.5"
        />

        <div className="px-3">
          <div className="text-center text-sm font-semibold text-gray-800 leading-tight">
            {data.label}
          </div>
          {data.description && (
            <div className="mt-2 text-xs text-gray-500 text-center leading-snug border-t border-black/5 pt-2">
              {data.description}
            </div>
          )}
        </div>

        {/* Bottom Handle (Source/Target) */}
        <Handle
          id="bottom"
          type="source"
          position={Position.Bottom}
          className="!bg-indigo-300 hover:!bg-indigo-500 !w-3 !h-3 rounded-full opacity-0 group-hover:opacity-100 transition-all border-2 border-white -mb-1.5"
        />

        {/* Left Handle (Target) */}
        <Handle
          id="left"
          type="target"
          position={Position.Left}
          className="!bg-indigo-300 hover:!bg-indigo-500 !w-3 !h-3 rounded-full opacity-0 group-hover:opacity-100 transition-all border-2 border-white -ml-1.5"
        />

        {/* Right Handle (Source) */}
        <Handle
          id="right"
          type="source"
          position={Position.Right}
          className="!bg-indigo-300 hover:!bg-indigo-500 !w-3 !h-3 rounded-full opacity-0 group-hover:opacity-100 transition-all border-2 border-white -mr-1.5"
        />
      </div>

      {/* Bubble-like (+) Add Button - Appears on hover/selection */}
      {(selected || true) && ( // Keeping consistent for demo, usually only on hover/select
        <button
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white hover:bg-indigo-50 border border-gray-300 hover:border-indigo-300 rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-indigo-600 transition-all z-50 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            // We need to bubble this event up to EditorShell
            // Since we can't easily pass props to node types without context, 
            // we'll rely on the global click handler or a specific class
            e.stopPropagation();
            // Dispatch a custom event or use the onNodeClick to trigger logic
            const event = new CustomEvent("openSuggestionMenu", { detail: { x: e.clientX, y: e.clientY + 20 } });
            window.dispatchEvent(event);
          }}
        >
          <Plus className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

const nodeTypes = {
  default: CustomNode, // Override default for now, or use specific type
};

type Props = {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onSelectNode: (node: { id: string; label?: string; type?: string; data?: any } | null) => void;
  onNodeEdit: (node: Node) => void;
  onAddSuggestion?: (e: any) => void;
  onInit?: (instance: ReactFlowInstance) => void;
};

export default function FlowCanvas({ nodes, edges, setNodes, setEdges, onSelectNode, onNodeEdit, onAddSuggestion, onInit }: Props) {

  // Listen for custom event from CustomNode
  React.useEffect(() => {
    const handleCustomEvent = (e: any) => {
      if (onAddSuggestion) {
        onAddSuggestion({ clientX: e.detail.x, clientY: e.detail.y, stopPropagation: () => { } });
      }
    };
    window.addEventListener("openSuggestionMenu", handleCustomEvent);
    return () => window.removeEventListener("openSuggestionMenu", handleCustomEvent);
  }, [onAddSuggestion]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '5,5' } }, eds));
  }, [setEdges]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_e, node) => onSelectNode(node)}
        onNodeDoubleClick={(_e, node) => onNodeEdit(node)}
        onInit={onInit}
        nodeTypes={nodeTypes}

        fitView
        attributionPosition="bottom-left"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        }}
      >
        <Background
          id="bg"
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#e2e8f0"
          className="bg-[#f8fafc]"
        />

        <MiniMap
          nodeColor={() => '#e2e8f0'}
          maskColor="rgba(248, 250, 252, 0.7)"
          className="!bg-white !shadow-sm !border !border-gray-100 !rounded-lg"
        />
        <Controls className="!bg-white !shadow-sm !border !border-gray-100 !rounded-lg !text-gray-500" />
      </ReactFlow>
    </div>
  );
}
