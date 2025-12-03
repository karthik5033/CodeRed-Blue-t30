"use client";
import { useTypewriter } from "../../lib/hooks/useTypewriter";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FlowCanvas from "@/components/FlowEditor/FlowCanvas";

import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

export default function FlowPage() {
    const animatedText = useTypewriter(
      [
        "Build apps visually.",
        "Drag nodes effortlessly.",
        "Connect logic like magic.",
        "Generate UI & backend instantly.",
      ],
      55,
      1300
    );

  return (
    <div className="w-full h-screen bg-[#f5f7fa] flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="w-full px-8 py-5 bg-white border-b shadow-sm flex items-center justify-between">
        {/* Left side title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-bold tracking-tight text-slate-900 leading-none">
            AvatarFlowX <span className="text-blue-600">Editor</span>
          </h1>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <p className="text-slate-500 text-[15px] font-medium">
              {animatedText}
            </p>
          </div>
        </div>

        {/* Right side placeholder for actions */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
            Generate App
          </button>
          <button className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition">
            Export
          </button>
        </div>
      </header>

      {/* MAIN EDITOR AREA */}
      <div className="flex-1 w-full overflow-hidden">
        <div className="h-full w-full flex">
          {/* LEFT: Flow Editor */}
          <div className="flex-[0.62] h-full p-5 bg-[#f7f9fc] border-r border-slate-300/40">
            <div className="h-full w-full rounded-2xl bg-white shadow-md border border-slate-200 p-4 flex flex-col">
              <h2 className="text-xl font-semibold text-slate-800 mb-1">
                Flow Canvas
              </h2>
              <p className="text-slate-500 text-sm mb-4">
                Create your flow using nodes & connections.
              </p>

              <div className="flex-1 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-white">
                <FlowCanvas />
              </div>
            </div>
          </div>

          {/* RIGHT: Preview Panel */}
          <div className="flex-[0.38] h-full p-5 bg-[#faf4ef] flex flex-col overflow-hidden">
            <div
              className="
      h-full w-full 
      rounded-2xl 
      bg-white/70 backdrop-blur 
      shadow-xl 
      border border-[#f4d7c3] 
      p-5 
      flex flex-col 
      overflow-hidden
  "
            >
              {/* Title */}
              <h2 className="text-xl font-semibold text-slate-800 mb-1">
                Live Preview
              </h2>
              <p className="text-slate-500 text-sm mb-4">
                Generated UI updates instantly.
              </p>

              {/* Center Preview */}
              <div
                className="
  flex-1 
  overflow-auto 
  px-2 py-4 
  rounded-3xl 
  scrollbar-thin 
  scrollbar-track-transparent 
  scrollbar-thumb-slate-300 
"
              >
                <div className="w-full flex justify-center pt-2 pb-6">
                  <div
                    className="
      w-[380px] h-[680px] 
      bg-white 
      rounded-3xl 
      shadow-2xl 
      border border-slate-200 
      flex items-center justify-center 
      text-slate-400 
      transition-all duration-300
  "
                  >
                    Live App Preview Coming Soon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
