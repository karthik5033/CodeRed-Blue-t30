"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Bot, Workflow, Cpu, Boxes } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AIWorkflows() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <div className="space-y-2">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to Home
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Built for AI Workflows
          </h1>

          <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
            AvatarFlowX is optimized for LLM tools, agent pipelines, dashboards,
            and automation. Decode → route → generate → execute — all with
            predictable, validated backend logic ready for production.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <Button asChild size="lg">
            <Link href="/editor">Start Building</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#deep-dive">Learn More</Link>
          </Button>
        </div>
      </div>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Card className="rounded-2xl border shadow-sm hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bot className="size-5" />
                  LLM-Ready Scaffolding
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed">
                Generate handlers structured for prompts, embeddings, vector
                calls, model routing, and multi-agent workflows. Zero extra
                setup required.
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38 }}
          >
            <Card className="rounded-2xl border shadow-sm hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Workflow className="size-5" />
                  Chain, Fan-Out, or Branch Logic
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed">
                Build powerful logic pipelines: step-wise execution, branching
                flows, memory injection, and multi-model task graphs — visually.
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42 }}
          >
            <Card className="rounded-2xl border shadow-sm hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Cpu className="size-5" />
                  High-Performance Execution
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed">
                Generated code runs fast on Vercel, Cloudflare Workers, Node
                servers, or edge runtimes — with predictable performance and
                safe sandboxing.
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Card className="rounded-2xl border shadow-sm hover:shadow-md transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Boxes className="size-5" />
                  Integrates With Any Model or API
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed">
                Connect OpenAI, Anthropic, Gemini, Replicate, vector DBs, RAG
                pipelines, or custom inference — AvatarFlowX adapts to every
                use-case.
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Deep Dive */}
      <section id="deep-dive" className="max-w-7xl mx-auto px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="rounded-2xl border shadow-sm p-10 bg-card"
        >
          <h2 className="text-2xl font-semibold mb-4 tracking-tight">
            Built for the next generation of AI applications
          </h2>

          <p className="text-muted-foreground leading-relaxed text-sm max-w-3xl">
            AvatarFlowX helps teams build AI-native products faster — from
            simple chat tools to multi-agent workflows, automated decision
            engines, and enterprise AI systems. The visual canvas ensures
            clarity, while the generated backend guarantees safe, predictable
            execution.
          </p>

          <div className="mt-6 flex gap-3">
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
