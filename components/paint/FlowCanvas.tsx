// apps/web/components/paint/FlowCanvas.tsx
"use client";

import React, { useCallback } from "react";
import { Background, BackgroundVariant } from "reactflow";
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
} from "reactflow";
import "reactflow/dist/style.css";

type Props = {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onSelectNode: (node: { id: string; label?: string; type?: string; data?: any } | null) => void;
  onNodeEdit: (node: Node) => void;
};

export default function FlowCanvas({ nodes, edges, setNodes, setEdges, onSelectNode, onNodeEdit }: Props) {
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
  }, [setEdges]);

  const handleNodeClick = useCallback(
    (_evt: React.MouseEvent, node: Node) => {
      onSelectNode({
        id: node.id,
        label: node.data?.label,
        type: node.data?.type ?? "default",
        data: node.data,
      });
    },
    [onSelectNode]
  );

  const handleNodeDoubleClick = useCallback(
    (_evt: React.MouseEvent, node: Node) => {
      onNodeEdit(node);
    },
    [onNodeEdit]
  );

  return (
    <div className="w-full h-full rounded-md border border-dashed border-gray-200 bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        fitView
        attributionPosition="bottom-left"
      >
        <Background
          id="bg"
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="#e6e6e6"
        />

        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
