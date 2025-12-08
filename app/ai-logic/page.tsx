"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Cpu, Zap, Layers, FileCode, Check } from "lucide-react";

export default function AILogicPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header / Breadcrumb */}
      {/* Enhanced Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Side — Title Area */}
          <div className="lg:col-span-7 space-y-5">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-black inline-flex items-center gap-1 transition"
            >
              ← Back to Home
            </Link>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              AI-Powered Logic
            </h1>

            <p className="text-lg max-w-xl text-muted-foreground leading-relaxed">
              Convert visual nodes into production-ready backend logic.
              AvatarFlowX uses structured templates + AI transforms to generate
              validation, business logic, and API endpoints you can ship
              instantly.
            </p>

            {/* Better Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <Button
                variant="secondary"
                className="rounded-full px-5 py-2.5 text-base font-medium shadow-sm hover:shadow"
              >
                Technical Overview
              </Button>

              <Button
                asChild
                className="rounded-full px-5 py-2.5 text-base font-medium shadow hover:shadow-md"
              >
                <Link href="/editor">Open Editor</Link>
              </Button>
            </div>
          </div>

          {/* Right Side — Quick Facts Carousel */}
          <div className="lg:col-span-5 flex justify-end">
            <div className="rounded-2xl border bg-card p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <span className="inline-block p-2 rounded-lg bg-muted">⚙️</span>
                Quick Facts
              </h3>

              <div className="space-y-5 text-sm">
                <div>
                  <p className="font-medium text-foreground">
                    Nodes to Functions
                  </p>
                  <p className="text-muted-foreground">
                    Each visual node is converted into a typed backend handler.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-foreground">Auto Validation</p>
                  <p className="text-muted-foreground">
                    Input schemas and validation rules are generated
                    automatically.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-foreground">Stable Output</p>
                  <p className="text-muted-foreground">
                    The same flow always produces identical, predictable backend
                    logic.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-foreground">
                    Custom Logic Ready
                  </p>
                  <p className="text-muted-foreground">
                    Attach custom functions or override generated steps anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagram + Explanation */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl font-semibold">
              How AvatarFlowX turns a flow into logic
            </h2>
            <p className="text-muted-foreground">
              We convert the canvas into a canonical structure (TOON-like), then
              synthesize handlers and glue code: validation, enrichment,
              storage, and routing. The result is a ready-to-run backend wired
              to the UI.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex gap-3 items-start">
                <div className="rounded-md bg-zinc-50 p-2">
                  <Zap className="size-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Fast generation</div>
                  <div className="text-sm text-muted-foreground">
                    Typical flow converted in seconds.
                  </div>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="rounded-md bg-zinc-50 p-2">
                  <Layers className="size-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Layered output</div>
                  <div className="text-sm text-muted-foreground">
                    UI, service layer, and DB migrations produced alongside each
                    other.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual lightweight diagram */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border bg-white/6 p-6"
            >
              <svg viewBox="0 0 600 260" className="w-full h-auto">
                {/* input node */}
                <rect
                  x="20"
                  y="80"
                  width="140"
                  height="80"
                  rx="12"
                  fill="#F8FAFC"
                  stroke="#E6E9EE"
                />
                <text
                  x="90"
                  y="120"
                  textAnchor="middle"
                  fontSize="14"
                  fill="#111827"
                  fontWeight="600"
                >
                  Input Node
                </text>
                <text
                  x="90"
                  y="140"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6B7280"
                >
                  forms / user data
                </text>

                {/* arrow */}
                <path
                  d="M160 120 L240 120"
                  stroke="#C6CEDA"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />

                {/* AI core */}
                <g transform="translate(240,70)">
                  <defs>
                    <marker
                      id="arrow"
                      markerWidth="6"
                      markerHeight="6"
                      refX="5"
                      refY="3"
                      orient="auto"
                    >
                      <path d="M0,0 L6,3 L0,6 z" fill="#C6CEDA" />
                    </marker>
                  </defs>

                  <rect
                    x="0"
                    y="10"
                    width="140"
                    height="120"
                    rx="14"
                    fill="#111827"
                    opacity="0.95"
                  />
                  <text
                    x="70"
                    y="80"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#fff"
                    fontWeight="700"
                  >
                    AI Transformation
                  </text>
                  <text
                    x="70"
                    y="100"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#CBD5E1"
                  >
                    templates · enrichment · rules
                  </text>
                </g>

                {/* arrow to backend */}
                <path
                  d="M400 120 L480 120"
                  stroke="#C6CEDA"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />

                {/* backend node */}
                <rect
                  x="480"
                  y="80"
                  width="140"
                  height="80"
                  rx="12"
                  fill="#F8FAFC"
                  stroke="#E6E9EE"
                />
                <text
                  x="550"
                  y="120"
                  textAnchor="middle"
                  fontSize="14"
                  fill="#111827"
                  fontWeight="600"
                >
                  Backend
                </text>
                <text
                  x="550"
                  y="140"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6B7280"
                >
                  FastAPI endpoints + DB
                </text>
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is produced */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="size-4" /> Generated artifacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                <li>Type-safe React components wired to your flow</li>
                <li>FastAPI routes with payload validation (Pydantic)</li>
                <li>Supabase schema + migration scripts</li>
                <li>CI/deploy helpers (Docker, Cloudflare/Vercel)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="size-4" /> Safety & audits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-start gap-3">
                  <Check className="size-4 text-green-500" />
                  <div>Validation & sanitization hooks included</div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="size-4 text-green-500" />
                  <div>Human-reviewable transforms and logs</div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="size-4 text-green-500" />
                  <div>Opt-out and safe defaults for external calls</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="size-4" /> When to use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Ideal for dashboards, data collection flows, admin panels,
                internal tools, and agent orchestration where you want rapid
                iteration without hand-writing every endpoint.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Example code short */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="rounded-2xl border p-6 bg-card">
          <h3 className="text-lg font-semibold">
            Tiny example — node → generated FastAPI endpoint
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            This is the kind of endpoint AvatarFlowX will produce for a submit
            node.
          </p>

          <div className="mt-4 overflow-auto rounded">
            <pre className="bg-black p-4 text-sm text-white font-mono">
              {`from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class SubmitPayload(BaseModel):
    name: str
    email: str

@app.post("/api/submit")
async def submit(payload: SubmitPayload):
    # validated, enriched, stored
    return {"ok": True, "id": "rec_12345"}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Best practices + CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Best practices</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Keep nodes focused: one responsibility per node.</li>
              <li>
                Use enrichment nodes for external API calls and mark them
                explicit.
              </li>
              <li>
                Prefer explicit schema types for predictable output and fewer
                manual edits.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border p-6 flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-semibold">Ready to try?</h4>
              <p className="text-sm text-muted-foreground mt-2">
                Open the editor, drag an Input → AI → Output, and watch
                AvatarFlowX generate the backend for you.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <Button asChild>
                <Link href="/editor">Open Editor</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Learn more</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
