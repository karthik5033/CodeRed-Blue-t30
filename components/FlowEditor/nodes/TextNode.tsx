import React from "react";
import { Handle, Position, NodeResizer } from "@xyflow/react";

export default function TextNode({ id, data, selected }: any) {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(data?.label || "");

  // collapsible states
  const [showSettings, setShowSettings] = React.useState(false);
  const [showOutputs, setShowOutputs] = React.useState(true);

  const outputs: string[] = data?.outputs ?? [];
  const description = data?.description ?? "";
  const category = data?.category ?? "";

  React.useEffect(() => {
    setValue(data?.label || "");
  }, [data?.label]);

  const commitLabel = () => {
    setEditing(false);
    data?.onChange?.(id, { label: value });
  };

  const commitSettings = (diff: any) => {
    data?.onChange?.(id, { ...diff });
  };

  const addOutput = () => {
    const newOutputs = [...outputs, `out-${outputs.length + 1}`];
    data?.onChange?.(id, { outputs: newOutputs });
  };

  const removeOutput = (index: number) => {
    const newOutputs = outputs.filter((_, i) => i !== index);
    data?.onChange?.(id, { outputs: newOutputs });
  };

  return (
    <div className="relative bg-white border border-[#d0d7e2] rounded-xl shadow-sm p-3">
      {/* ⭐ RESIZER HANDLE ⭐ */}
      <NodeResizer
        isVisible={selected}
        minWidth={180}
        minHeight={140}
        handleClassName="bg-primary"
        lineClassName="border-primary"
      />

      {/* INPUT HANDLES */}
      <Handle
        id={`${id}-in-top`}
        type="target"
        position={Position.Top}
        style={{ background: "#94a3b8", width: 10, height: 10 }}
      />

      <Handle
        id={`${id}-in-left`}
        type="target"
        position={Position.Left}
        style={{ background: "#94a3b8", width: 10, height: 10 }}
      />

      <Handle
        id={`${id}-in-right`}
        type="target"
        position={Position.Right}
        style={{ background: "#94a3b8", width: 10, height: 10 }}
      />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        {editing ? (
          <input
            autoFocus
            className="w-full text-sm px-2 py-1 rounded-md border outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commitLabel}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitLabel();
              if (e.key === "Escape") {
                setValue(data?.label || "");
                setEditing(false);
              }
            }}
          />
        ) : (
          <div
            className="text-sm font-semibold cursor-text"
            onClick={() => setEditing(true)}
          >
            {value || "Untitled Node"}
          </div>
        )}

        <button
          onClick={addOutput}
          className="text-xs px-2 py-1 border rounded-md"
        >
          + out
        </button>
      </div>

      {/* SETTINGS */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex justify-between items-center w-full text-xs mb-1"
      >
        <span>Settings</span>
        <span>{showSettings ? "▲" : "▼"}</span>
      </button>

      {showSettings && (
        <div className="p-2 border rounded-md bg-accent/40 mb-2 text-xs flex flex-col gap-2">
          <div>
            <label className="text-muted-foreground text-xs">Description</label>
            <input
              className="w-full px-2 py-1 mt-1 border rounded-md"
              value={description}
              onChange={(e) => commitSettings({ description: e.target.value })}
            />
          </div>

          <div>
            <label className="text-muted-foreground text-xs">Category</label>
            <input
              className="w-full px-2 py-1 mt-1 border rounded-md"
              value={category}
              onChange={(e) => commitSettings({ category: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* OUTPUT SECTION */}
      <button
        onClick={() => setShowOutputs(!showOutputs)}
        className="flex justify-between items-center w-full text-xs mb-1"
      >
        <span>Outputs</span>
        <span>{showOutputs ? "▲" : "▼"}</span>
      </button>

      {showOutputs && (
        <div className="p-2 border rounded-md bg-accent/40 text-xs flex flex-col gap-2">
          {outputs.length === 0 ? (
            <div className="text-muted-foreground">No outputs added</div>
          ) : (
            outputs.map((name, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex-1">{name}</span>

                <Handle
                  id={`${id}-out-extra-${index}`}
                  type="source"
                  position={Position.Bottom}
                  style={{
                    background: "#4e7aff",
                    width: 10,
                    height: 10,
                    bottom: -10,
                  }}
                />

                <button
                  onClick={() => removeOutput(index)}
                  className="text-[10px] px-2 py-1 border rounded-md"
                >
                  −
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* FIXED OUTPUT HANDLES */}
      <Handle
        id={`${id}-out-bottom`}
        type="source"
        position={Position.Bottom}
        style={{ background: "#4e7aff", width: 10, height: 10 }}
      />

      <Handle
        id={`${id}-out-left`}
        type="source"
        position={Position.Left}
        style={{ background: "#4e7aff", width: 10, height: 10, left: -10 }}
      />

      <Handle
        id={`${id}-out-right`}
        type="source"
        position={Position.Right}
        style={{ background: "#4e7aff", width: 10, height: 10, right: -10 }}
      />
    </div>
  );
}
