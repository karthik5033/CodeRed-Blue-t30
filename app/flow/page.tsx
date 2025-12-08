"use client";

import { useMorphText } from "../../lib/hooks/useMorphText";
import { ReactFlowProvider } from "@xyflow/react";
import FlowCanvas from "../../components/FlowEditor/FlowCanvas";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

export default function FlowPage() {
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
    <div className="w-full h-screen bg-muted flex flex-col overflow-hidden">
      {/* HEADER */}
      <header
        className="
        w-full px-8 py-5 
        relative
        bg-background/80 
        backdrop-blur-md 
        border-b border-border
        shadow-sm
        flex items-center justify-between
        overflow-hidden
      "
      >
        <div
          className="
            absolute inset-0 
            pointer-events-none 
            opacity-20
            bg-[radial-gradient(circle_at_top_left,rgba(120,120,255,0.25),transparent_60%)]
          "
        />

        {/* LEFT SIDE */}
        <div className="relative flex flex-col gap-1">
          <h1 className="text-[32px] font-bold tracking-tight text-foreground leading-none">
            AvatarFlowX <span className="text-primary">Editor</span>
          </h1>

          <div className="h-[22px] overflow-hidden">
            <p
              className={`
                text-muted-foreground text-sm font-medium leading-none
                transition-all duration-500
                ${
                  morphText
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-1"
                }
              `}
            >
              {morphText}
            </p>
          </div>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex items-center gap-3 relative z-10">
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow-sm hover:bg-primary/90 transition">
            Generate App
          </button>
          <button className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-accent/50 shadow-sm transition">
            Export
          </button>
        </div>
      </header>

      {/* MAIN SPLIT PANEL */}
      <div className="flex-1 w-full overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full w-full">
          {/* LEFT PANEL */}
          <Panel
            defaultSize={62}
            minSize={20}
            className="relative h-full p-5 bg-muted/50 border-r border-border/50 transition-all"
          >
            <div className="h-full w-full rounded-xl bg-card shadow-md border border-border p-5 flex flex-col">
              <h2 className="text-lg font-semibold text-foreground mb-1">
                Flow Builder
              </h2>

              <p className="text-muted-foreground text-sm mb-4">
                Drag tools, create nodes & map your logic.
              </p>

              <div className="flex-1 rounded-lg overflow-hidden border border-border bg-background shadow-sm">
                <ReactFlowProvider>
                  <FlowCanvas />
                </ReactFlowProvider>
              </div>
            </div>
          </Panel>

          {/* RESIZE HANDLE */}
          <PanelResizeHandle
            className="
              w-2 bg-transparent 
              hover:bg-primary/20 
              active:bg-primary 
              cursor-col-resize 
              flex items-center justify-center transition
            "
          >
            <div className="h-10 w-0.5 rounded-full bg-border transition-colors" />
          </PanelResizeHandle>

          {/* RIGHT PANEL */}
          <Panel
            defaultSize={38}
            minSize={20}
            className="relative h-full p-5 bg-muted/40 transition-all"
          >
            <div
              className="
                h-full w-full 
                rounded-xl 
                bg-card 
                backdrop-blur-sm 
                shadow-md 
                border border-border 
                p-6 
                flex flex-col 
                overflow-hidden
              "
            >
              <h2 className="text-lg font-semibold text-foreground mb-1">
                Live Preview
              </h2>

              <p className="text-muted-foreground text-sm mb-4">
                Generated UI updates instantly.
              </p>

              <div
                className="
                  flex-1 
                  overflow-auto 
                  px-3 py-5 
                  rounded-xl 
                  scrollbar-thin 
                  scrollbar-track-transparent 
                  scrollbar-thumb-muted-foreground/30
                "
              >
                <div className="w-full flex justify-center pt-4 pb-8">
                  <div
                    className="
                      w-[380px] h-[680px] 
                      bg-background 
                      rounded-xl 
                      shadow-lg 
                      border border-border 
                      flex items-center justify-center 
                      text-muted-foreground 
                      text-sm
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
