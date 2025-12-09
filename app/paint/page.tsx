"use client";

import Topbar from "@/components/paint/Topbar";
import Palette from "@/components/paint/Palette";
import EditorCanvas from "@/components/paint/EditorCanvas";
import PreviewPane from "@/components/paint/PreviewPane";
import BottomPanel from "@/components/paint/BottomPanel";

export default function PaintPage() {
  return (
    <div className="h-screen w-full flex flex-col bg-[#fafafa] text-slate-900 overflow-hidden">
      {/* Top Navigation Bar */}
      <Topbar />

      {/* Main Work Area */}
      <div className="flex flex-1">
        {/* Left Toolbox / Palette */}
        <aside className="w-72 border-r bg-white/90 shadow-inner">
          <Palette />
        </aside>

        {/* Canvas Editor */}
        <main className="flex-1 bg-gradient-to-br from-white to-gray-100 relative overflow-hidden">
          <EditorCanvas />
        </main>

        {/* Preview Window */}
        <aside className="w-[420px] border-l bg-white/90 shadow-inner">
          <PreviewPane />
        </aside>
      </div>

      {/* Footer Status Bar */}
      <BottomPanel />
    </div>
  );
}
