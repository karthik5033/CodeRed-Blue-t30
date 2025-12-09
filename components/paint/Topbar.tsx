"use client";

import { Settings, Play, Save } from "lucide-react";

export default function Topbar() {
  return (
    <header
      className="
        h-14 w-full flex items-center justify-between
        px-4 bg-white/80 backdrop-blur-md border-b
        shadow-[0_1px_3px_rgba(0,0,0,0.06)]
      "
    >
      {/* Left: Title */}
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">Paint Workspace</h1>
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
          beta
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <TopbarButton icon={<Save size={14} />} label="Save" />
        <TopbarButton icon={<Play size={14} />} label="Run" primary />
        <div
          className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          title="Settings"
        >
          <Settings size={18} className="text-gray-600" />
        </div>
      </div>
    </header>
  );
}

function TopbarButton({
  icon,
  label,
  primary,
}: {
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      className={`
        flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border
        transition-all
        ${
          primary
            ? "bg-sky-600 text-white border-sky-700 hover:bg-sky-700"
            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
