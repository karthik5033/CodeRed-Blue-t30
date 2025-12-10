"use client";

import React from "react";
import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";

interface PreviewPaneProps {
  code?: string;
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

export default function PreviewPane({ code }: PreviewPaneProps) {
  return (
    <div className="h-full w-full">
      <SandpackProvider
        template="react-ts"
        theme="light"
        files={{
          "/App.tsx": code || DEFAULT_CODE,
        }}
        customSetup={{
          dependencies: {
            "lucide-react": "latest",
            "clsx": "latest",
            "tailwind-merge": "latest"
          }
        }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"]
        }}
      >
        <div className="h-full flex flex-col">
          <div className="bg-gray-100 border-b border-gray-200 px-3 py-1 text-[10px] text-gray-500 flex justify-between">
            <span>Preview Running</span>
            <span>React + Tailwind</span>
          </div>
          <div className="flex-1 relative">
            {/* We hide the code editor by default to look like a "Phone" preview, but we could toggle it */}
            <SandpackPreview
              style={{ height: "100%" }}
              showOpenInCodeSandbox={false}
              showRefreshButton={true}
            />
          </div>
        </div>
      </SandpackProvider>
    </div>
  );
}
