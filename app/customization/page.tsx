"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Layers, PanelsTopLeft, SlidersHorizontal } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Customizable() {
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
            Fully Customizable
          </h1>

          <p className="text-muted-foreground max-w-2xl">
            Modify UI, schema, routes, and logic however you want. AvatarFlowX
            gives you complete control with predictable, editable,
            production-ready code you can shape to match any workflow.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <Button asChild size="lg">
            <Link href="/editor">Open Editor</Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="#deep-dive">Deep Dive</Link>
          </Button>
        </div>
      </div>

      {/* Hero Cards */}
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
                  <Pencil className="size-5" /> Editable UI Components
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed">
                Every generated UI component is structured, typed, and easy to
                customize. Update layouts, rearrange sections, or style elements
                with full freedom — without losing consistency.
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
                  <Layers className="size-5" /> Schema-Level Control
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed">
                Adjust entity models, relationships, validation rules, and
                migrations. AvatarFlowX regenerates consistent backend logic
                instantly to match your changes.
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
                  <SlidersHorizontal className="size-5" /> Route + Logic Editing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed">
                Add new endpoints, change API behavior, inject custom business
                logic, or override defaults. You always stay in control of the
                generated backend.
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
                  <PanelsTopLeft className="size-5" /> Theme & Layout Freedom
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed">
                Swap themes, create unique layouts, introduce brand styling, or
                extend the design system — AvatarFlowX stays flexible while
                keeping everything predictable.
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
            Customize Everything — Without losing structure
          </h2>

          <p className="text-muted-foreground leading-relaxed text-sm max-w-3xl">
            AvatarFlowX code generation follows strict and predictable patterns.
            This means you can fully edit UI, schemas, routes, handlers, or
            logic — while keeping clarity, maintainability, and clean TypeScript
            throughout your project.
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
