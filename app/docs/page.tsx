"use client";

import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <div className="flex w-full mx-auto max-w-7xl">
        {/* ---------------- SIDEBAR ---------------- */}
        <aside
          className="
          hidden lg:block 
          w-64 flex-none 
          border-r border-border/40 
          px-6 py-10 
          sticky top-0 h-screen
          bg-background/60 backdrop-blur-xl
        "
        >
          <h2 className="text-xl font-semibold mb-6">Documentation</h2>

          <nav className="space-y-6 text-sm">
            <div>
              <p className="uppercase tracking-wide text-muted-foreground mb-2 text-xs">
                Overview
              </p>
              <ul className="space-y-1">
                <li>
                  <Link href="#intro" className="hover:text-primary transition">
                    Introduction
                  </Link>
                </li>
                <li>
                  <Link
                    href="#getting-started"
                    className="hover:text-primary transition"
                  >
                    Getting Started
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="uppercase tracking-wide text-muted-foreground mb-2 text-xs">
                Core Concepts
              </p>
              <ul className="space-y-1">
                <li>
                  <Link href="#nodes" className="hover:text-primary transition">
                    Node System
                  </Link>
                </li>
                <li>
                  <Link href="#logic" className="hover:text-primary transition">
                    Logic Flows
                  </Link>
                </li>
                <li>
                  <Link href="#ui" className="hover:text-primary transition">
                    UI Generation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="uppercase tracking-wide text-muted-foreground mb-2 text-xs">
                Advanced
              </p>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="#deployment"
                    className="hover:text-primary transition"
                  >
                    Deployment
                  </Link>
                </li>
                <li>
                  <Link href="#api" className="hover:text-primary transition">
                    API & Endpoints
                  </Link>
                </li>
                <li>
                  <Link
                    href="#security"
                    className="hover:text-primary transition"
                  >
                    Security Model
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* ---------------- MAIN CONTENT ---------------- */}
        <main className="flex-1 px-6 md:px-12 py-16">
          <h1 className="text-4xl font-bold mb-3" id="intro">
            AvatarFlowX Documentation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-12">
            Learn how to visually build apps, generate backend logic, and deploy
            full-stack software using AvatarFlowX.
          </p>

          {/* SECTION: Getting Started */}
          <section id="getting-started" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-3">Getting Started</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              A step-by-step guide to installing, configuring, and creating your
              first AvatarFlowX project.
            </p>

            <div className="mt-6 p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2">
                Your First Visual App
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn the basics of the visual editor, node connections, and
                logic scaffolding.
              </p>
              <Link
                href="/flow"
                className="text-primary font-medium hover:underline"
              >
                Open the Editor →
              </Link>
            </div>
          </section>

          {/* SECTION: Node System */}
          <section id="nodes" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-3">Node System</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              AvatarFlowX uses a modular node approach: Inputs, Transformations,
              API Calls, UI Blocks, and Automation.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <NodeCard
                title="Input Nodes"
                desc="Collect and validate user data using typed schemas."
              />
              <NodeCard
                title="Logic Nodes"
                desc="Branching, loops, transformations, and data mapping."
              />
              <NodeCard
                title="API Nodes"
                desc="Connect to backend routes, external APIs, and databases."
              />
              <NodeCard
                title="UI Builder Nodes"
                desc="Generate responsive UI screens and components."
              />
            </div>
          </section>

          {/* SECTION: Deployment */}
          <section id="deployment" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-3">Deployment</h2>
            <p className="text-muted-foreground max-w-2xl mb-4">
              Deploy anywhere — Vercel, Netlify, Docker, or your own server.
              AvatarFlowX generates clean, production-ready code.
            </p>

            <div className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-lg mb-2">Build & Export</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Export your app as a full Next.js project containing UI, API
                routes, validation, and server logic.
              </p>
              <Link
                href="/docs/export"
                className="text-primary font-medium hover:underline"
              >
                Learn how export works →
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ---------------- CARD COMPONENT ---------------- */

function NodeCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-5 rounded-xl border bg-card shadow-sm hover:shadow-lg transition cursor-pointer">
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
