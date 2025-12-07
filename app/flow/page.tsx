"use client";

import { useMorphText } from "../../lib/hooks/useMorphText";
import { ReactFlowProvider } from "@xyflow/react";
import FlowCanvas from "../../components/FlowEditor/FlowCanvas";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

export default function FlowPage() {
  // 🔥 Smooth Morph Text Animation
  const morphText = useMorphText(
    [
      "Build apps visually.",
      "Connect logic like magic.",
      "Drag nodes effortlessly.",
      "Generate UI & backend instantly.",
    ],
    2400
  );

  return (
    <div className="w-full h-screen bg-[#f3f5f8] flex flex-col overflow-hidden">
      {/* HEADER */}
      <header
        className="
  w-full px-8 py-5 
  relative
  bg-white/80 
  backdrop-blur-lg 
  border-b 
  shadow-[0_2px_12px_-4px_rgba(0,0,0,0.15)]
  flex items-center justify-between
  overflow-hidden
"
      >
        {/* 🌈 Soft Animated Gradient Glow */}
        <div
          className="
    absolute inset-0 
    pointer-events-none 
    opacity-40
    bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.25),transparent_60%)]
    animate-pulse-slow
  "
        />

        {/* LEFT SIDE */}
        <div className="relative flex flex-col gap-1">
          <h1 className="text-[34px] font-extrabold tracking-tight text-slate-900 leading-none">
            AvatarFlowX <span className="text-blue-600">Editor</span>
          </h1>

          {/* Text Container */}
          <div className="h-[22px] overflow-hidden">
            <p
              className={`
          text-slate-600 text-[15px] font-medium leading-none
          transition-all duration-500 
          transform
          ${
            morphText ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          }
        `}
            >
              {morphText}
            </p>
          </div>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex items-center gap-3 relative z-10">
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm transition">
            Generate App
          </button>
          <button className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-sm transition">
            Export
          </button>
        </div>
      </header>

      {/* MAIN SPLIT PANEL */}
      <div className="flex-1 w-full overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full w-full">
          {/* LEFT SIDE - Flow Canvas */}
          <Panel
            defaultSize={62}
            minSize={20}
            className="relative h-full p-5 bg-[#f7f9fc] border-r border-slate-300/30 transition-all"
          >
            <div className="h-full w-full rounded-3xl bg-white shadow-lg border border-slate-200 p-5 flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                Flow Builder
              </h2>

              <p className="text-slate-500 text-sm mb-4">
                Drag tools, create nodes & map your logic.
              </p>

              {/* CANVAS */}
              <div className="flex-1 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
                <ReactFlowProvider>
                  <FlowCanvas />
                </ReactFlowProvider>
              </div>
            </div>
          </Panel>

          {/* RESIZE HANDLE */}
          <PanelResizeHandle className="w-2 bg-transparent hover:bg-blue-500/20 active:bg-blue-500 cursor-col-resize flex items-center justify-center transition">
            <div className="h-10 w-1 rounded-full bg-slate-300 group-hover:bg-blue-600 transition-colors" />
          </PanelResizeHandle>

          {/* RIGHT SIDE - Live Preview */}
          <Panel
            defaultSize={38}
            minSize={20}
            className="relative h-full p-5 bg-[#f8f2eb] transition-all"
          >
            <div
              className="
                h-full w-full 
                rounded-3xl 
                bg-white/70 
                backdrop-blur-xl 
                shadow-xl 
                border border-[#f0d4c1] 
                p-6 
                flex flex-col 
                overflow-hidden
              "
            >
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                Live Preview
              </h2>

              <p className="text-slate-600 text-sm mb-4">
                Generated UI updates instantly.
              </p>

              <div
                className="
                  flex-1 
                  overflow-auto 
                  px-3 py-5 
                  rounded-3xl 
                  scrollbar-thin 
                  scrollbar-track-transparent 
                  scrollbar-thumb-slate-300 
                "
              >
                <div className="w-full flex justify-center pt-4 pb-8">
                  <div
                    className="
                      w-[380px] h-[680px] 
                      bg-white 
                      rounded-3xl 
                      shadow-2xl 
                      border border-slate-200 
                      flex items-center justify-center 
                      text-slate-400 
                      text-[15px]
                      transition-all duration-300
                    "
                  >
                    Live App Preview Coming Soon
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
