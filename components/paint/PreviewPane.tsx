"use client";

import React from "react";
import { SandpackProvider, SandpackPreview, SandpackConsole, SandpackLayout } from "@codesandbox/sandpack-react";

interface PreviewPaneProps {
  code?: string;
  isGenerating?: boolean;
}

const DEFAULT_CODE = `export default function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Ready to Build</h1>
        <p className="text-slate-500 mb-6">Generate your app to see the preview here.</p>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
          Example Button
        </button>
      </div>
    </div>
  );
}`;

export default function PreviewPane({ code, isGenerating }: PreviewPaneProps) {
  const [showCode, setShowCode] = React.useState(false);
  const [showConsole, setShowConsole] = React.useState(false);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="bg-gray-100 border-b border-gray-200 px-3 py-2 text-xs text-gray-500 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">Live Preview</span>
          <span className="px-1.5 py-0.5 bg-gray-200 rounded text-[10px]">React + Tailwind</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`font-medium underline decoration-dotted transition-colors ${showConsole ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
          >
            {showConsole ? "Hide Console" : "Console"}
          </button>
          <button
            onClick={() => setShowCode(!showCode)}
            className={`font-medium underline decoration-dotted transition-colors ${showCode ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
          >
            {showCode ? "Hide Code" : "Code"}
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-slate-50">
        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-medium text-slate-700">Generating App...</p>
          </div>
        )}

        {/* Code Overlay - now with max height to not block everything if user wants to peek */}
        {showCode ? (
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-slate-900 text-slate-50 p-4 overflow-auto text-xs font-mono z-20 shadow-xl border-b border-slate-700">
            <div className="absolute top-2 right-2 text-slate-400 text-[10px]">read-only</div>
            <pre>{code || DEFAULT_CODE}</pre>
          </div>
        ) : null}

        {!code ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <div className="w-16 h-16 mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-sm font-medium text-slate-600">No App Generated Yet</p>
            <p className="text-xs mt-1">Build a flow and click "Generate App"</p>
          </div>
        ) : (

          <div className="h-full w-full">
            <SandpackProvider
              key={code}
              template="react-ts"
              theme="light"
              files={{
                "/App.tsx": code,
              }}
              customSetup={{
                dependencies: {
                  "react": "18.2.0",
                  "react-dom": "18.2.0",
                  "lucide-react": "latest",
                  "clsx": "latest",
                  "tailwind-merge": "latest",
                  "react-xarrows": "2.0.2",
                  "react-use-gesture": "9.1.3",
                  "framer-motion": "10.16.4",
                  "react-router-dom": "6.22.3"
                }
              }}
              options={{
                externalResources: ["https://cdn.tailwindcss.com"],
                classes: {
                  "sp-wrapper": "h-full w-full",
                  "sp-layout": "h-full w-full",
                }
              }}
              style={{ height: '100%', width: '100%' }}
            >
              <SandpackLayout style={{ height: "100%", width: "100%", flexDirection: "column", display: "flex", borderRadius: 0 }}>
                <SandpackPreview
                  style={{ flex: 1, height: "100%", width: "100%", minHeight: 0 }}
                  showOpenInCodeSandbox={false}
                  showRefreshButton={true}
                />
                {showConsole && (
                  <div className="h-32 border-t border-gray-200 bg-white transition-all shrink-0">
                    <SandpackConsole style={{ height: "100%" }} />
                  </div>
                )}
              </SandpackLayout>
            </SandpackProvider>
          </div>
        )
        }
      </div >
    </div >
  );
}
