"use client";

import { Grip, ChevronDown } from "lucide-react";

const GROUPS = [
  {
    title: "Basic",
    items: ["Rectangle", "Circle", "Arrow"],
  },
  {
    title: "Flow",
    items: ["Step", "Decision", "Output"],
  },
];

export default function Palette() {
  return (
    <div className="h-full flex flex-col p-4 select-none">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Grip size={16} className="text-sky-600" />
        <h2 className="text-sm font-semibold">Palette</h2>
      </div>

      {/* Groups */}
      <div className="space-y-6 overflow-auto pr-2">
        {GROUPS.map((group) => (
          <Group key={group.title} group={group} />
        ))}
      </div>
    </div>
  );
}

function Group({ group }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {group.title}
        </div>
        <ChevronDown size={14} className="text-gray-400" />
      </div>

      <div className="space-y-2">
        {group.items.map((item: string) => (
          <PaletteItem key={item} label={item} />
        ))}
      </div>
    </div>
  );
}

function PaletteItem({ label }: { label: string }) {
  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("paint_item", label);
    e.dataTransfer.effectAllowed = "copyMove";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="
        bg-white border border-gray-200 rounded-lg 
        p-2 text-sm shadow-sm cursor-grab
        hover:shadow-md hover:border-sky-300 transition-all
        active:scale-[0.97]
      "
    >
      {label}
    </div>
  );
}
