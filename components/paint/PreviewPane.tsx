"use client";

import { RefreshCcw, Smartphone, Monitor } from "lucide-react";
import { useState } from "react";

const DEVICES = [
  { id: "mobile", label: "Mobile", width: 375, icon: <Smartphone size={16} /> },
  {
    id: "desktop",
    label: "Desktop",
    width: "100%",
    icon: <Monitor size={16} />,
  },
];

export default function PreviewPane() {
  const [device, setDevice] = useState(DEVICES[1]); // default: desktop

  return (
    <div className="h-full w-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="h-12 border-b flex items-center justify-between px-4 bg-white/80 backdrop-blur-md">
        <span className="text-sm font-medium text-gray-700">Preview</span>

        <div className="flex items-center gap-2">
          {/* Device Switcher */}
          {DEVICES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDevice(d)}
              className={`
                px-2 py-1 rounded-md text-xs flex items-center gap-1
                border transition
                ${
                  device.id === d.id
                    ? "bg-sky-100 border-sky-300 text-sky-700"
                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                }
              `}
            >
              {d.icon}
              {d.label}
            </button>
          ))}

          {/* Refresh */}
          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 transition"
          >
            <RefreshCcw size={14} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* FRAME */}
      <div className="flex-1 w-full flex justify-center items-start overflow-auto p-4 bg-gray-50">
        <div
          className="bg-white border shadow-md rounded-xl overflow-hidden"
          style={{
            width: device.width,
            height: "100%",
          }}
        >
          {/* Inner Preview Placeholder */}
          <div className="h-full flex items-center justify-center text-gray-400">
            <span className="text-sm">App output will appear here</span>
          </div>
        </div>
      </div>
    </div>
  );
}
