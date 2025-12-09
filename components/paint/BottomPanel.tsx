"use client";

import { Cpu, HardDrive, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

export default function BottomPanel() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const t = new Date();
      setTime(t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      className="
        h-12 w-full border-t bg-white/80 backdrop-blur-md 
        flex items-center justify-between px-4 text-sm text-gray-600
      "
    >
      {/* Left Status */}
      <div className="flex items-center gap-4">
        <StatusItem icon={<Cpu size={14} />} label="Idle" />
        <StatusItem icon={<HardDrive size={14} />} label="No project loaded" />
      </div>

      {/* Right Status */}
      <div className="flex items-center gap-4">
        <StatusItem icon={<Wifi size={14} />} label="Online" />
        <div className="text-gray-500">{time}</div>
      </div>
    </footer>
  );
}

function StatusItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1 text-gray-500">
      {icon}
      <span>{label}</span>
    </div>
  );
}
