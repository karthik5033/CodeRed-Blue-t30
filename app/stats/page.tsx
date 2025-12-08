"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Activity, Zap, Code, Eye } from "lucide-react";
import { motion } from "motion/react";

/** Small simulated app preview used inside the demo panel */
function DemoPreviewMock() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState<null | {
    id: string;
    name: string;
  }>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // simulate generation/enrichment
    setSubmitted({
      id: "rec_" + Math.random().toString(36).slice(2, 8),
      name: name || "Anon",
    });
    setName("");
    setEmail("");
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-medium">Sample App</h4>
          <p className="text-sm text-muted-foreground">
            Instantly generated UI — input → API → result
          </p>
        </div>
        <div className="text-xs text-muted-foreground">Preview</div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="rounded-md border px-3 py-2 bg-card"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-md border px-3 py-2 bg-card"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-full bg-white px-4 py-2 text-black font-medium"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => {
              setName("");
              setEmail("");
            }}
            className="rounded-full border px-4 py-2"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h5 className="text-sm font-semibold">Last result</h5>
        {submitted ? (
          <div className="mt-2 rounded-md border bg-card p-4">
            <div className="text-sm text-muted-foreground">
              id: <span className="font-mono">{submitted.id}</span>
            </div>
            <div className="mt-1">
              Name: <span className="font-medium">{submitted.name}</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Stored via generated endpoint /api/submit
            </div>
          </div>
        ) : (
          <div className="mt-2 text-sm text-muted-foreground">
            No submissions yet — try the form above.
          </div>
        )}
      </div>
    </div>
  );
}

/** Simple code sample used for the Code tab */
const codeSample = `# FastAPI generated endpoint (example)
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class SubmitPayload(BaseModel):
    name: str
    email: str

@app.post("/api/submit")
async def submit(payload: SubmitPayload):
    # generated validation & storage
    return {"ok": True, "id": "rec_12345"}`;

const Stat = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) => (
  <div className="flex flex-col">
    <div className="text-2xl md:text-3xl font-extrabold">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
    {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
  </div>
);

export default function LightningFast() {
  // Tab switching for Preview / Code view
  const [tab, setTab] = useState<"preview" | "code">("preview");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Last submitted result
  const [submitted, setSubmitted] = useState<null | {
    id: string;
    name: string;
  }>(null);

  // Fake code output for "Code" tab
  const codeSample = `
export async function submit(data) {
  const result = await fetch("/api/submit", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return await result.json();
}
`;

 
  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb / small header */}
      <div className="max-w-7xl mx-auto px-6 py-6 lg:py-10">
        <div className="flex items-center justify-between">
          {/* Left: Back + Title */}
          <div className="space-y-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition font-medium"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 group-hover:border-zinc-900 transition">
                ←
              </span>
              Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Lightning Fast App Generation
            </h1>

            <p className="text-sm text-muted-foreground max-w-2xl">
              Build complete apps from a visual flow — frontend, backend, data
              schema, and routes — in seconds.
            </p>
          </div>

          {/* Right Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-semibold tracking-wide shadow-sm">
              Featured
            </span>

            <Link
              href="/editor"
              className="px-5 py-2 rounded-full bg-zinc-900 text-white font-medium text-sm hover:bg-zinc-800 transition shadow"
            >
              Open Editor
            </Link>
          </div>
        </div>
      </div>

      {/* Hero + Demo */}
      <section className="max-w-7xl mx-auto px-6 pb-12 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Value props + stats */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">
                From Canvas → App in seconds
              </h2>
              <p className="text-muted-foreground">
                Draw a flow, press Generate, and AvatarFlowX returns a
                deployable app scaffold — with working UI, API endpoints, and
                data schema.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="size-4" /> Typical generate time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Stat
                    label="Average generation"
                    value="~7s"
                    hint="Measured on 5-node flow (dev machine)"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="size-4" /> Code completeness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Stat
                    label="Ready-to-run scaffold"
                    value="95%"
                    hint="UI + backend + DB mapping"
                  />
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="size-4" /> Production-minded defaults
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-none space-y-2 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5">
                        <Check className="size-4 text-green-500" />
                      </span>
                      <span>
                        Type-safe frontend + backend wiring (TypeScript)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5">
                        <Check className="size-4 text-green-500" />
                      </span>
                      <span>Supabase-ready schema + migrations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5">
                        <Check className="size-4 text-green-500" />
                      </span>
                      <span>
                        Deploy scripts for Cloudflare Workers / Vercel
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="flex gap-3 items-center pt-2">
              <Button asChild size="lg">
                <Link href="/editor">Try it now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#how-it-works">How it works</Link>
              </Button>
            </div>
          </div>

          {/* Right: Improved Demo Panel */}
          {/* Right: Enhanced Demo Panel */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl overflow-hidden border bg-gradient-to-b from-zinc-900 to-black shadow-xl"
            >
              {/* Top tab bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/60 backdrop-blur">
                <div className="text-sm text-white/90 font-medium">
                  Live Demo
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTab("preview")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                        ${
                          tab === "preview"
                            ? "bg-white text-black shadow-sm"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                  >
                    Preview
                  </button>

                  <button
                    onClick={() => setTab("code")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                        ${
                          tab === "code"
                            ? "bg-white text-black shadow-sm"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                  >
                    Code
                  </button>
                </div>
              </div>

              {/* Inner content */}
              <div className="p-0">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                  className="min-h-[440px] flex"
                >
                  {tab === "preview" ? (
                    <div className="w-full p-8 bg-gradient-to-b from-zinc-900 to-black text-white">
                      <h4 className="text-xl font-semibold mb-1">Sample App</h4>
                      <p className="text-sm text-zinc-400 mb-6">
                        Instantly generated UI → input → API → result
                      </p>

                      {/* Form */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setSubmitted({
                            id: "rec_" + Math.random().toString(36).slice(2, 8),
                            name: name || "Anonymous",
                          });
                          setName("");
                          setEmail("");
                        }}
                        className="grid gap-4"
                      >
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full name"
                          className="rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-500 outline-none"
                        />
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          className="rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm focus:ring-2 focus:ring-zinc-500 outline-none"
                        />

                        <div className="flex gap-3 pt-1">
                          <button
                            type="submit"
                            className="rounded-full bg-white text-black font-medium px-5 py-2 shadow hover:opacity-90 transition"
                          >
                            Submit
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setName("");
                              setEmail("");
                            }}
                            className="rounded-full border border-zinc-600 px-5 py-2 text-sm hover:bg-white/10 transition"
                          >
                            Reset
                          </button>
                        </div>
                      </form>

                      {/* Result */}
                      <div className="mt-8">
                        <h5 className="text-sm font-semibold tracking-wide text-zinc-300">
                          Last Result
                        </h5>

                        {submitted ? (
                          <div className="mt-3 rounded-lg border border-zinc-700 bg-zinc-800 p-4 text-sm">
                            <div className="text-zinc-400">id:</div>
                            <div className="font-mono text-white">
                              {submitted.id}
                            </div>

                            <div className="mt-2 text-zinc-400">Name:</div>
                            <div className="text-white font-medium">
                              {submitted.name}
                            </div>

                            <div className="mt-2 text-xs text-zinc-500">
                              Stored via generated endpoint{" "}
                              <span className="font-mono">/api/submit</span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 text-sm text-zinc-500">
                            No submissions yet — try the form above.
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full p-6 bg-black text-white overflow-auto">
                      <pre className="text-sm leading-relaxed text-zinc-200 font-mono">
                        {codeSample}
                      </pre>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works (short) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-xl border p-6 bg-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <Zap className="size-5" />
              <h3 className="text-lg font-semibold">1. Draw your flow</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Add Input, AI, and Output nodes. Connect edges to define data
              flow.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-xl border p-6 bg-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <Activity className="size-5" />
              <h3 className="text-lg font-semibold">2. Generate</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              AvatarFlowX transforms the flow into a canonical structure and
              calls the generator to produce code.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-xl border p-6 bg-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <Check className="size-5" />
              <h3 className="text-lg font-semibold">3. Inspect & Deploy</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Preview code, tweak UI, then export or auto-deploy to your
              platform of choice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-28">
        <div className="rounded-2xl border p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Ready to generate your first app?
            </h3>
            <p className="text-sm text-muted-foreground">
              Open the editor, draw a simple 3-node flow, and press Generate.
            </p>
          </div>

          <div className="flex gap-3">
            <Button asChild>
              <Link href="/editor">Open Editor</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
