"use client";

import Link from "next/link";
import {
  Cpu,
  Fingerprint,
  Pencil,
  Settings2,
  Sparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "Lightning Fast App Generation",
    icon: Zap,
    description: "Generate full-stack apps instantly from your visual flow.",
    href: "/stats", // will create later
  },
  {
    title: "AI-Powered Logic",
    icon: Cpu,
    description:
      "Let AvatarFlowX turn your nodes into working backend & logic.",
    href: "/ai-logic",
  },
  {
    title: "Secure & Stable",
    icon: Fingerprint,
    description: "Your generated apps follow safe, production-ready patterns.",
    href: "/security",
  },
  {
    title: "Fully Customizable",
    icon: Pencil,
    description: "Modify UI, schema, routes, and logic however you want.",
    href: "/customization",
  },
  {
    title: "Total Control",
    icon: Settings2,
    description:
      "Inspect or edit the generated code anytime — front & backend.",
    href: "/control",
  },
  {
    title: "Built for AI Workflows",
    icon: Sparkles,
    description: "Perfect for LLM tools, agents, dashboards, and automation.",
    href: "/ai-built",
  },
];

export default function Features() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl space-y-12 px-6">
        {/* TITLE */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold">
            Powerful Features for Building with Flow
          </h2>
          <p className="text-muted-foreground">
            AvatarFlowX gives you everything you need to create, customize, and
            launch complete applications — visually.
          </p>
        </div>

        {/* GRID */}
        <div className="grid border divide-x divide-y max-w-5xl mx-auto sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => {
            const Icon = item.icon;

            return (
              <Link
                key={i}
                href={item.href}
                className="
                                    group p-10 flex flex-col gap-3 
                                    hover:bg-accent/10 transition-all
                                    hover:cursor-pointer 
                                    hover:shadow-lg 
                                    duration-200
                                "
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-5 text-primary group-hover:scale-110 transition" />
                  <h3 className="text-base font-medium">{item.title}</h3>
                </div>

                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
