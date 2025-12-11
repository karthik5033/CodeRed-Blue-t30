"use client";

import React, { useEffect, useState } from "react";
import { SandpackProvider, SandpackPreview, SandpackConsole, SandpackLayout, SandpackCodeEditor } from "@codesandbox/sandpack-react";
import { Moon, Sun, Type, Palette, RefreshCw, Zap } from "lucide-react";

interface PreviewPaneProps {
  code?: string;
  isGenerating?: boolean;
  tokenStats?: { jsonSize: number; toonSize: number; savedPercent: number } | null;
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

type ThemeColor = 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky';

export default function PreviewPane({ code, isGenerating, tokenStats }: PreviewPaneProps) {
  const [showCode, setShowCode] = React.useState(false);
  const [showConsole, setShowConsole] = React.useState(false);
  const [activeCode, setActiveCode] = useState(code || DEFAULT_CODE);
  const [isDark, setIsDark] = useState(false);

  // Sync prop changes to state
  useEffect(() => {
    if (code) setActiveCode(code);
  }, [code]);

  const handleColorChange = (newColor: ThemeColor) => {
    // Regex to replace color-500, color-600 etc. with new color
    // This matches common Tailwind usage like 'bg-blue-500', 'text-indigo-600'
    const updated = activeCode.replace(/(text|bg|border|from|to|via)-(blue|indigo|violet|purple|fuchsia|pink|rose|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|gray|slate|zinc|neutral|stone)-/g, `$1-${newColor}-`);
    setActiveCode(updated);
  };

  const toggleDarkMode = () => {
    // Simple toggle for preview container - app needs to support dark mode classes or we just wrap it
    // For now, let's just toggle a wrapper class if possible, or inject 'dark'
    setIsDark(!isDark);
  };

  return (
    <div className="h-full w-full flex flex-col relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-3 py-2 text-xs text-gray-500 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">Live Preview</span>
          {tokenStats ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
              <Zap className="w-3 h-3 fill-emerald-500 text-emerald-600" />
              <span className="font-medium text-[10px]">TOON: {tokenStats.savedPercent}% saved</span>
            </div>
          ) : (
            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] text-gray-500">React + Tailwind</span>
          )}
          {isGenerating && (
            <div className="flex items-center gap-1 text-indigo-600">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Generating...</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // Save current code to localStorage to pass to the customize page
              if (typeof window !== 'undefined') {
                localStorage.setItem('avtarflow_current_code', activeCode);
                // Use window.location as a fallback if router push isn't available or simple
                // navigation is preferred.
                window.location.href = '/customize';
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-md text-xs font-medium hover:bg-indigo-100 transition-colors"
          >
            <Palette className="w-3.5 h-3.5" />
            Customize
          </button>

          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`font-medium transition-colors ${showConsole ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
          >
            {showConsole ? "Hide Console" : "Console"}
          </button>
          <button
            onClick={() => setShowCode(!showCode)}
            className={`font-medium transition-colors ${showCode ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
          >
            {showCode ? "Hide Code" : "Code"}
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-slate-50">
        <SandpackProvider
          key={code} // Reset when new generation comes in, but allow local edits otherwise
          template="react-ts"
          theme="light"
          files={{
            "/App.tsx": { code: activeCode, active: true },
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
              "react-router-dom": "6.22.3",
              "typed.js": "2.0.12",
              "recharts": "2.12.0",
              "date-fns": "latest"
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
            {/* Main Preview Area */}
            <div className="flex-1 relative min-h-0 w-full">
              <SandpackPreview
                style={{ height: "100%", width: "100%" }}
                showOpenInCodeSandbox={false}
                showRefreshButton={false} // We have our own status
                showNavigator={true}
              />

              {/* Loading Overlay */}
              {isGenerating && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm font-medium text-slate-700">Generating App...</p>
                </div>
              )}

              {/* Code Editor Overlay */}
              {showCode && (
                <div className="absolute inset-0 z-20 bg-white border-l border-gray-200 flex flex-col animate-in slide-in-from-bottom-10 duration-200">
                  <div className="p-2 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <span className="text-xs font-mono text-gray-500">App.tsx</span>
                    <div className="text-[10px] text-gray-400">Edits update live</div>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <SandpackCodeEditor
                      showTabs={false}
                      showLineNumbers={true}
                      showInlineErrors={true}
                      wrapContent={true}
                      style={{ height: "100%" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {showConsole && (
              <div className="h-32 border-t border-gray-200 bg-white transition-all shrink-0">
                <SandpackConsole style={{ height: "100%" }} />
              </div>
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
}
