"use client";

import { useEffect, useRef, useState } from "react";

type Item = {
  id: string;
  type: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  label?: string;
};

type History = {
  items: Item[];
};

const GRID = 24;

export default function EditorCanvas() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);

  // history stack for undo/redo
  const undoStack = useRef<History[]>([]);
  const redoStack = useRef<History[]>([]);

  // dragging state
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // helper: push current state into undo stack
  const pushHistory = (label?: string) => {
    undoStack.current.push({ items: JSON.parse(JSON.stringify(items)) });
    // cap history to 50
    if (undoStack.current.length > 50) undoStack.current.shift();
    redoStack.current = []; // new branch
  };

  // drop from palette
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("paint_item");
    if (!type || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (snapToGrid) {
      x = Math.round(x / GRID) * GRID;
      y = Math.round(y / GRID) * GRID;
    }

    const newItem: Item = {
      id: crypto.randomUUID(),
      type,
      x,
      y,
      w: 120,
      h: 44,
      label: type,
    };

    pushHistory();
    setItems((s) => [...s, newItem]);
    setSelectedId(newItem.id);
  };

  const allowDrop = (e: React.DragEvent) => e.preventDefault();

  // mousedown on item => start drag
  const handleItemMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const item = items.find((it) => it.id === id);
    if (!item) return;

    dragRef.current = {
      id,
      startX: clientX,
      startY: clientY,
      origX: item.x,
      origY: item.y,
    };

    setIsDragging(true);
    setSelectedId(id);
  };

  // global mouse move (while dragging)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current || !containerRef.current) return;
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const { id, startX, startY, origX, origY } = dragRef.current;

      let nx = origX + (e.clientX - startX);
      let ny = origY + (e.clientY - startY);

      if (snapToGrid) {
        nx = Math.round(nx / GRID) * GRID;
        ny = Math.round(ny / GRID) * GRID;
      }

      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, x: nx, y: ny } : it))
      );
    };

    const onUp = (e: MouseEvent) => {
      if (dragRef.current) {
        pushHistory();
      }
      dragRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, snapToGrid]);

  // keyboard handlers (delete, undo/redo, arrow keys)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // undo (Ctrl/Cmd+Z)
      const zUndo =
        (e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z";
      const zRedo =
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "y" ||
          (e.shiftKey && e.key.toLowerCase() === "z"));

      if (zUndo) {
        e.preventDefault();
        const h = undoStack.current.pop();
        if (h) {
          redoStack.current.push({ items: JSON.parse(JSON.stringify(items)) });
          setItems(h.items);
          setSelectedId(null);
        }
        return;
      }

      if (zRedo) {
        e.preventDefault();
        const r = redoStack.current.pop();
        if (r) {
          undoStack.current.push({ items: JSON.parse(JSON.stringify(items)) });
          setItems(r.items);
          setSelectedId(null);
        }
        return;
      }

      // delete key
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        pushHistory();
        setItems((prev) => prev.filter((it) => it.id !== selectedId));
        setSelectedId(null);
        return;
      }

      // arrow nudge
      const nudges = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (selectedId && nudges.includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? GRID : 1;
        setItems((prev) =>
          prev.map((it) => {
            if (it.id !== selectedId) return it;
            let nx = it.x;
            let ny = it.y;
            if (e.key === "ArrowUp") ny -= step;
            if (e.key === "ArrowDown") ny += step;
            if (e.key === "ArrowLeft") nx -= step;
            if (e.key === "ArrowRight") nx += step;
            if (snapToGrid) {
              nx = Math.round(nx / GRID) * GRID;
              ny = Math.round(ny / GRID) * GRID;
            }
            return { ...it, x: nx, y: ny };
          })
        );
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, selectedId, snapToGrid]);

  // click on empty canvas to clear selection
  const handleCanvasClick = () => {
    setSelectedId(null);
  };

  // simple duplicate action (ctrl + d) — optional
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "d" &&
        selectedId
      ) {
        e.preventDefault();
        const src = items.find((it) => it.id === selectedId);
        if (!src) return;
        pushHistory();
        const dup: Item = {
          ...src,
          id: crypto.randomUUID(),
          x: src.x + (snapToGrid ? GRID : 10),
          y: src.y + (snapToGrid ? GRID : 10),
        };
        setItems((prev) => [...prev, dup]);
        setSelectedId(dup.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, selectedId, snapToGrid]);

  return (
    <div className="h-full w-full relative flex flex-col">
      {/* top toolbar small controls */}
      <div className="px-3 py-2 border-b bg-white/70 flex items-center gap-3">
        <button
          onClick={() => {
            setSnapToGrid((s) => !s);
          }}
          className={`text-xs px-2 py-1 rounded ${
            snapToGrid ? "bg-sky-600 text-white" : "bg-white border"
          }`}
        >
          Snap: {snapToGrid ? "ON" : "OFF"}
        </button>

        <button
          onClick={() => {
            // manual undo
            const h = undoStack.current.pop();
            if (h) {
              redoStack.current.push({
                items: JSON.parse(JSON.stringify(items)),
              });
              setItems(h.items);
              setSelectedId(null);
            }
          }}
          className="text-xs px-2 py-1 rounded bg-white border"
        >
          Undo
        </button>

        <button
          onClick={() => {
            const r = redoStack.current.pop();
            if (r) {
              undoStack.current.push({
                items: JSON.parse(JSON.stringify(items)),
              });
              setItems(r.items);
              setSelectedId(null);
            }
          }}
          className="text-xs px-2 py-1 rounded bg-white border"
        >
          Redo
        </button>

        <div className="text-xs text-gray-500 ml-3">
          Tip: drag palette → canvas. Delete to remove. Ctrl/Cmd+Z undo.
        </div>
      </div>

      {/* canvas area */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-auto
        bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)]
        bg-[size:24px_24px]"
        onDrop={handleDrop}
        onDragOver={allowDrop}
        onClick={handleCanvasClick}
      >
        {items.map((it) => (
          <div
            key={it.id}
            onMouseDown={(e) => handleItemMouseDown(e, it.id)}
            className={`absolute p-2 px-3 rounded-lg border shadow-sm select-none transition-all cursor-grab
              ${
                selectedId === it.id
                  ? "ring-2 ring-sky-400 bg-white"
                  : "bg-white"
              }`}
            style={{
              left: it.x,
              top: it.y,
              width: it.w,
              height: it.h,
              transform:
                isDragging && selectedId === it.id
                  ? "translateZ(0)"
                  : undefined,
            }}
            title={it.label}
          >
            <div className="text-xs font-medium">{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
