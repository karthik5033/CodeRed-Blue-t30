"use client";

import React from "react";

export default function Sidebar({
  addNode,
  exportFlow,
}: {
  addNode: (type: string) => void;
  exportFlow: () => void;
}) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("node-type", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="p-2 bg-card rounded-md border border-border">
      <div className="flex flex-col gap-2">
        <div
          draggable
          onDragStart={(e) => onDragStart(e, "textNode")}
          className="cursor-grab p-2 rounded-md border border-border bg-background text-sm text-foreground"
        >
          + Text Node (drag)
        </div>

        <button
          onClick={() => addNode("textNode")}
          className="mt-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm"
        >
          + Add Text Node
        </button>

        <button
          onClick={exportFlow}
          className="mt-2 px-3 py-2 rounded-md border border-border bg-background text-sm"
        >
          Export Flow (JSON)
        </button>

        <small className="text-xs text-muted-foreground mt-2 block">
          Tip: double-click a node to edit its label. Add outputs inside the
          node to create multiple connection ports.
        </small>
      </div>
    </aside>
  );
}
