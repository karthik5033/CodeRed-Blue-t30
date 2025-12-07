"use client";

import { Handle, Position } from "@xyflow/react";
import { useState } from "react";

export default function TextNode({ data }: any) {
  const [text, setText] = useState(data.text || "");

  return (
    <div className="bg-white p-3 rounded-xl shadow-md border border-slate-300 w-[160px]">
      <textarea
        className="w-full bg-transparent resize-none outline-none text-slate-800 text-sm"
        rows={2}
        value={text}
        placeholder="Type..."
        onChange={(e) => setText(e.target.value)}
      />

      {/* INPUT HANDLE */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-blue-500"
      />

      {/* OUTPUT HANDLE */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-green-500"
      />
    </div>
  );
}
