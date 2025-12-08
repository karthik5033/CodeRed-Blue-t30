import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn("h-8 w-auto", className)}
      viewBox="0 0 220 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Abstract 'AF' Symbol with Flow elements */}
      <path
        d="M12 28V12M12 12H24M12 20H20M28 28L34 12L40 28M30 22H38"
        stroke="#6366F1"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dynamic Flow Accent (The "Flow" visual) */}
      <path
        d="M8 32C8 32 15 36 24 32C33 28 42 32 42 32"
        stroke="#A5B4FC"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Wordmark */}
      <text
        x="55"
        y="26"
        style={{
          font: "700 20px Inter, system-ui, sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        <tspan fill="currentColor">AvatarFlow</tspan>
        <tspan fill="#6366F1">X</tspan>
      </text>
    </svg>
  );
};
