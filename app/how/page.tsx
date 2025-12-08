import { Button } from "@/components/ui/button";
import { ArrowRight, Workflow, Cpu, Boxes, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen w-full bg-linear-to-b from-zinc-50 to-white px-6 py-24">
      {/* HEADER SECTION */}
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold text-zinc-900 tracking-tight">
          How AvatarFlowX Works
        </h1>
        <p className="text-zinc-600 mt-4 text-lg">
          A visual-first workflow that turns your ideas into fully generated
          apps.
        </p>
      </div>

      {/* STEP SECTIONS */}
      <div className="mx-auto mt-20 max-w-5xl space-y-16">
        {/* STEP 1 */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="p-6 rounded-2xl border shadow-sm bg-white">
            <Workflow className="h-12 w-12 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">1. Draw Your Flow</h2>
            <p className="text-zinc-600 mt-2 max-w-md">
              Drag & drop nodes to define UI screens, backend logic, API calls,
              conditions, database actions and routing — visually.
            </p>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:flex-row-reverse">
          <div className="p-6 rounded-2xl border shadow-sm bg-white">
            <Cpu className="h-12 w-12 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">
              2. AI Converts Logic Instantly
            </h2>
            <p className="text-zinc-600 mt-2 max-w-md">
              Every node becomes real code — React components, API routes,
              schema, server logic, validation and state management.
            </p>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="p-6 rounded-2xl border shadow-sm bg-white">
            <Boxes className="h-12 w-12 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">
              3. Live Preview Updates in Real-Time
            </h2>
            <p className="text-zinc-600 mt-2 max-w-md">
              The entire UI updates instantly based on your flow — no rebuilds,
              no waiting.
            </p>
          </div>
        </div>

        {/* STEP 4 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:flex-row-reverse">
          <div className="p-6 rounded-2xl border shadow-sm bg-white">
            <Sparkles className="h-12 w-12 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">4. Export or Deploy</h2>
            <p className="text-zinc-600 mt-2 max-w-md">
              Download the generated codebase or deploy instantly using our
              cloud runtime.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto mt-20 text-center">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/flow">
            Try the Visual Editor <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
