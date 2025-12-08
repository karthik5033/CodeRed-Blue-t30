"use client";

import Sidebar from "./Sidebar";
import React from "react";

import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  MiniMap,
  ReactFlowProvider,
} from "@xyflow/react";

import TextNode from "./nodes/TextNode";

const nodeTypes = {
  textNode: TextNode,
};

export default function FlowCanvas() {
  const [reactFlowInstance, setReactFlowInstance] = React.useState<any>(null);

  const snapToGrid = (position: any, gridSize = 24) => ({
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  });

  const [nodes, setNodes] = React.useState([
    {
      id: "input",
      type: "default",
      position: { x: 100, y: 250 },
      data: { label: "Input Node (Form)" },
      style: {
        padding: 12,
        borderRadius: 12,
        border: "1px solid #d0d7e2",
        background: "white",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
      },
    },
    {
      id: "logic",
      type: "default",
      position: { x: 420, y: 250 },
      data: { label: "AI Logic Node" },
      style: {
        padding: 12,
        borderRadius: 12,
        border: "1px solid #d0d7e2",
        background: "white",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
      },
    },
    {
      id: "output",
      type: "default",
      position: { x: 740, y: 250 },
      data: { label: "Output Node (Results)" },
      style: {
        padding: 12,
        borderRadius: 12,
        border: "1px solid #d0d7e2",
        background: "white",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
      },
    },
  ]);

  const [edges, setEdges] = React.useState([
    {
      id: "e1",
      source: "input",
      target: "logic",
      animated: true,
      style: { stroke: "#4e7aff", strokeWidth: 2 },
    },
    {
      id: "e2",
      source: "logic",
      target: "output",
      animated: true,
      style: { stroke: "#4e7aff", strokeWidth: 2 },
    },
  ]);

  const onDragOver = (event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: any) => {
    event.preventDefault();
    if (!reactFlowInstance) return;

    const type = event.dataTransfer.getData("node-type");
    if (!type) return;

    let position = reactFlowInstance.project({
      x: event.clientX,
      y: event.clientY,
    });

    position = snapToGrid(position);

    const newNode = {
      id: `${type}_${Date.now()}`,
      type,
      position,
      data: { label: "", text: "" },
      style: {
        padding: 12,
        borderRadius: 12,
        border: "1px solid #d0d7e2",
        background: "white",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const addNode = (type: string) => {
    const newNode = {
      id: `${type}_${Date.now()}`,
      type,
      position: { x: 100, y: 100 },
      data: { label: "", text: "" },
      style: {
        padding: 12,
        borderRadius: 12,
        border: "1px solid #d0d7e2",
        background: "white",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const onNodesChange = React.useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = React.useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = React.useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#4e7aff", strokeWidth: 2 },
          },
          eds
        )
      ),
    []
  );

  return (
    <ReactFlowProvider>
      <div className="w-full h-full flex">
        <div className="flex-1 rounded-xl overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            panOnDrag
            panOnScroll
            zoomOnScroll
          >
            <Background
              id="grid"
              gap={24}
              size={2}
              color="#e2e8f0"
              variant={BackgroundVariant.Dots}
            />

            <Controls position="bottom-left" />

            <MiniMap
              nodeColor={() => "#4e7aff"}
              nodeStrokeWidth={1.5}
              maskColor="rgba(255,255,255,0.7)"
              style={{
                bottom: 16,
                right: 16,
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
