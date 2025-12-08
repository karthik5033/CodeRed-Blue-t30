"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Layers, Infinity, Cloud, GitBranch, ArrowRight } from "lucide-react";

export default function FutureProofPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="space-y-2">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to Home
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Future-Proof Architecture
          </h1>

          <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
            AvatarFlowX is designed to evolve with your app — automatically
            adapting to scale, new features, new models, or new backend demands.
            Build once, then grow without rewriting the foundation.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <Button asChild size="lg">
            <Link href="/editor">Start Building</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#deep-dive">Deep Dive</Link>
          </Button>
        </div>
      </div>

      {/* Floating Gradient Blob */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="pointer-events-none fixed -top-32 right-0 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-blue-100 to-purple-100 blur-3xl opacity-30"
      />

      {/* HERO ARCHITECTURE DIAGRAM */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl border shadow-sm p-10 bg-card relative overflow-hidden"
        >
          {/* Subtle background swirl */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.06),transparent_70%)]"
          />

          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            A System That Adapts As You Grow
          </h2>

          {/* ARCHITECTURE SHOWCASE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Block 1 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="rounded-xl border bg-white p-6 shadow transition"
            >
              <Layers className="size-6 mb-3 text-foreground" />
              <h3 className="font-semibold text-lg">Layered Foundations</h3>
              <p className="text-sm text-muted-foreground mt-1">
                UI, logic, schemas, routing, and state are generated in clean
                layers. Swap any layer without breaking the others.
              </p>
            </motion.div>

            {/* Block 2 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="rounded-xl border bg-white p-6 shadow transition"
            >
              <GitBranch className="size-6 mb-3 text-foreground" />
              <h3 className="font-semibold text-lg">
                Evolution Without Rewrites
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add features, change flows, or modify logic — AvatarFlowX
                regenerates code intelligently while preserving custom edits.
              </p>
            </motion.div>

            {/* Block 3 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="rounded-xl border bg-white p-6 shadow transition"
            >
              <Cloud className="size-6 mb-3 text-foreground" />
              <h3 className="font-semibold text-lg">Cloud Native by Default</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Whether deployed to Vercel, Supabase, or Cloudflare Workers, the
                architecture stays stable and fast.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* DEEP DIVE */}
      <section id="deep-dive" className="max-w-7xl mx-auto px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border shadow-sm p-10 bg-card"
        >
          <h2 className="text-2xl font-semibold mb-4 tracking-tight">
            Grow From MVP → Enterprise Without Changing Stack
          </h2>

          <p className="text-muted-foreground leading-relaxed text-sm max-w-3xl">
            AvatarFlowX uses deterministic generation patterns and layered
            architecture, ensuring your project remains stable even as the
            codebase becomes large. From simple dashboards to massive
            multi-service systems — the structure adapts without chaos.
          </p>

          {/* Deep Dive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {/* Card 1 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-xl border p-6 bg-white shadow-sm"
            >
              <Infinity className="size-5 text-foreground" />
              <h3 className="font-semibold text-lg mt-3">
                Infinite Extensibility
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add custom modules, logic, endpoints, or libraries — everything
                stays predictable and non-breaking.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-xl border p-6 bg-white shadow-sm"
            >
              <ArrowRight className="size-5 text-foreground" />
              <h3 className="font-semibold text-lg mt-3">
                Forward-Compatible Flows
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Updates to AvatarFlowX or your flows never destroy manual
                customizations thanks to smart diffing.
              </p>
            </motion.div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button asChild>
              <Link href="/editor">Open Editor</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back Home</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
