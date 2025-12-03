import React, { useCallback, useRef, useState } from "react";
import {
  ReactFlowProvider,
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeChange,
  EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";

/*
  FlowCanvas.tsx
  - Wraps ReactFlow in ReactFlowProvider
  - Provides default nodes + edges for AvatarFlowX v1
  - Includes handlers for node/edge changes and connecting
  - Lightweight, beginner-friendly, production-minded
*/

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Input Node (Form)" },
    position: { x: 0, y: 0 },
  },
  {
    id: "2",
    type: "default",
    data: { label: "AI Logic Node" },
    position: { x: 300, y: 0 },
  },
  {
    id: "3",
    type: "output",
    data: { label: "Output Node (Results)" },
    position: { x: 600, y: 0 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
];

export default function FlowCanvas() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [rfInstance, setRfInstance] = useState<any>(null);

  // Handles node drag / changes
  const onNodesChange: OnNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  // Handles edge add / remove / update
  const onEdgesChange: OnEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  // When a user connects two nodes (draws an edge)
  const onConnect: OnConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
  }, []);

  const onInit = useCallback((flow: any) => {
    setRfInstance(flow);
  }, []);

  // Quick helper to reset the canvas to initial demo state
  const resetCanvas = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    if (rfInstance) {
      rfInstance.fitView();
    }
  }, [rfInstance]);

  return (
    <div className="w-full h-[70vh] rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <ReactFlowProvider>
        <div ref={reactFlowWrapper} className="w-full h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            fitView
            attributionPosition="bottom-left"
            panOnScroll
          >
            {/* visual helpers */}
            <Background gap={12} size={1} />
            <MiniMap
              nodeColor={(n) => {
                if (n.type === "input") return "#10b981"; // green-ish for inputs
                if (n.type === "output") return "#ef4444"; // red-ish for outputs
                return "#2563eb"; // blue for logic nodes
              }}
            />
            <Controls showInteractive={true} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>

      {/* Small action bar - beginner friendly and non-invasive */}
      <div className="p-2 flex items-center gap-2">
        <button
          className="px-3 py-1 rounded bg-slate-800 text-white text-sm"
          onClick={resetCanvas}
        >
          Reset Canvas
        </button>
        <div className="text-xs text-slate-600">
          Drag nodes → Connect edges → Double-click canvas to add
        </div>
      </div>
    </div>
  );
}
