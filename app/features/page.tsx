import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen w-full bg-linear-to-b from-zinc-50 to-white px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-5xl font-bold text-zinc-900 tracking-tight">
          All Features
        </h1>
        <p className="text-zinc-600 mt-4 text-lg">
          Everything AvatarFlowX offers to help you build apps visually at
          lightning speed.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            title: "Lightning Fast App Generation",
            desc: "Turn a visual flow into a complete full-stack app instantly.",
          },
          {
            title: "AI-Powered Logic Engine",
            desc: "Every node becomes real routed backend logic.",
          },
          {
            title: "Fully Customizable UI",
            desc: "Modify styling, schema, components, and API behavior.",
          },
          {
            title: "Secure & Sandbox-Safe",
            desc: "Strong validation layers ensure safe execution.",
          },
          {
            title: "Total Code Control",
            desc: "Inspect generated code, override, or export.",
          },
          {
            title: "Built for AI Workflows",
            desc: "Perfect for LLM tools, agents, automations & dashboards.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all"
          >
            <CheckCircle2 className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold mt-3">{item.title}</h2>
            <p className="text-zinc-600 mt-1 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 text-center">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/flow">Launch Editor</Link>
        </Button>
      </div>
    </div>
  );
}
