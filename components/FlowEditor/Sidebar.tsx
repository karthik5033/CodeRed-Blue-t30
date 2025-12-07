"use client";

export default function Sidebar({
  addNode,
}: {
  addNode: (type: string) => void;
}) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("node-type", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside
      className="
        w-full 
        flex 
        flex-col 
        gap-3 
        p-4 
        border-r 
        border-slate-200 
        bg-white 
        shadow-sm
      "
    >
      <h3 className="text-sm font-semibold text-slate-600 tracking-wide">
        Add Nodes
      </h3>

      {/* TEXT NODE BUTTON */}
      <div
        className="
          cursor-pointer 
          p-3 
          rounded-xl 
          border 
          border-slate-300 
          bg-slate-50 
          hover:bg-slate-100 
          transition 
          shadow-sm
        "
        draggable
        onDragStart={(e) => onDragStart(e, "textNode")}
        onClick={() => addNode("textNode")} // ←🔥 CLICK HANDLER ADDED
      >
        ➕ Text Node
      </div>
    </aside>
  );
}
