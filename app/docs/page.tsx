"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, Book, Terminal, Zap, Code2, Layers, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DocsPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-100">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center text-white">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            AvatarFlowX <span className="text-slate-500 font-normal text-sm ml-2">Docs</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-black transition-colors">Home</Link>
            <Link href="/abc" className="text-sm font-medium text-slate-600 hover:text-black transition-colors">Builder</Link>
            <Button size="sm" className="bg-black text-white hover:bg-slate-800" asChild>
              <Link href="/abc">Launch App</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start space-y-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Book className="w-4 h-4 text-slate-500" /> Getting Started
                </h3>
                <ul className="space-y-2 border-l border-slate-200 pl-4">
                  <li><a href="#introduction" className="block text-sm text-black font-medium border-l-2 border-black -ml-[17px] pl-4">Introduction</a></li>
                  <li><a href="#installation" className="block text-sm text-slate-600 hover:text-black transition-colors">Installation</a></li>
                  <li><a href="#architecture" className="block text-sm text-slate-600 hover:text-black transition-colors">Architecture</a></li>
                </ul>
              </div>
              <div className="mt-8">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-slate-500" /> AI Features
                </h3>
                <ul className="space-y-2 border-l border-slate-200 pl-4">
                  <li><a href="#prompting" className="block text-sm text-slate-600 hover:text-black transition-colors">Effective Prompting</a></li>
                  <li><a href="#auto-routing" className="block text-sm text-slate-600 hover:text-black transition-colors">Auto-Routing</a></li>
                  <li><a href="#state-management" className="block text-sm text-slate-600 hover:text-black transition-colors">State Management</a></li>
                </ul>
              </div>
              <div className="mt-8">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-500" /> Components
                </h3>
                <ul className="space-y-2 border-l border-slate-200 pl-4">
                  <li><a href="#ui-kit" className="block text-sm text-slate-600 hover:text-black transition-colors">UI Kit</a></li>
                  <li><a href="#themes" className="block text-sm text-slate-600 hover:text-black transition-colors">Theming</a></li>
                </ul>
              </div>
            </motion.div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-16">

            {/* Hero Section */}
            <motion.section
              id="introduction"
              className="space-y-6"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-800">
                v2.0 Released
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                Build better apps, <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">faster than ever.</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl text-slate-600 leading-relaxed max-w-3xl">
                AvatarFlowX is an AI-powered visual development environment.
                It translates your natural language descriptions and visual flowcharts into production-ready React + Tailwind code instantly.
              </motion.p>

              <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 mb-4 group-hover:scale-110 transition-transform">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">Natural Language to UI</h3>
                  <p className="text-slate-500 text-sm">Describe your interface in plain English, and our advanced LLM engine builds it pixel-perfectly.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 mb-4 group-hover:scale-110 transition-transform">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">Clean React Code</h3>
                  <p className="text-slate-500 text-sm">We don't generate spaghetti code. You get clean, componentized React components using standard libraries.</p>
                </div>
              </motion.div>

              {/* Decorative Image */}
              <motion.div variants={fadeInUp} className="rounded-xl overflow-hidden border border-slate-200 shadow-xl mt-8 relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent z-10" />
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                  alt="Dashboard Analytics"
                  className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                />
              </motion.div>
            </motion.section>

            <motion.hr initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} className="border-slate-200" />

            {/* Installation */}
            <motion.section
              id="installation"
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-slate-900">Installation</h2>
              <p className="text-slate-600">
                You don't need to install anything to use the comprehensive hosted version.
                However, if you want to run the engine locally:
              </p>

              <div className="rounded-xl bg-slate-900 p-6 shadow-2xl overflow-x-auto relative">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-500 text-xs ml-2 font-mono">bash — 80x24</span>
                </div>
                <pre className="font-mono text-sm text-slate-50">
                  <span className="text-pink-400">git</span> clone https://github.com/avatarflow/core.git{"\n"}
                  <span className="text-pink-400">cd</span> avatarflow-core{"\n"}
                  <span className="text-pink-400">npm</span> install{"\n"}
                  <span className="text-pink-400">npm</span> run dev
                </pre>
              </div>
            </motion.section>

            <motion.hr initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} className="border-slate-200" />

            {/* Prompting Guide */}
            <motion.section
              id="prompting"
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-slate-900">Mastering AI Prompts</h2>
              <p className="text-slate-600">
                The quality of the output depends on the quality of your prompt. AvatarFlowX uses a specialized "Context-Aware" prompting engine.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-red-600">❌ Bad Prompt</h3>
                  <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-800 text-sm">
                    "Make a website for coffee."
                  </div>
                  <p className="text-xs text-slate-500">Too vague. The AI will guess blindly.</p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-green-600">✅ Good Prompt</h3>
                  <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-green-800 text-sm">
                    "Create a modern landing page for a coffee shop. Header with logo and nav. Hero section with a full-width image of latte art and 'Order Now' button. Grid of 3 featured blends below."
                  </div>
                  <p className="text-xs text-slate-500">Specific structure, content, and visual cues.</p>
                </div>
              </div>

              <div className="mt-8 rounded-xl overflow-hidden border border-slate-200 shadow-md relative">
                <img
                  src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2940&auto=format&fit=crop"
                  alt="Code editing"
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 w-full p-4 bg-white/90 border-t border-slate-200 backdrop-blur-sm z-20">
                  <p className="text-sm font-medium text-slate-700">Pro Tip: You can also drag and drop images into the editor to use as inspiration!</p>
                </div>
              </div>
            </motion.section>

            <motion.div
              className="p-8 rounded-2xl bg-black text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div>
                <h3 className="text-2xl font-bold mb-2">Ready to start building?</h3>
                <p className="text-slate-400">Launch the studio and create your first app in seconds.</p>
              </div>
              <Button size="lg" className="bg-white text-black hover:bg-zinc-200" asChild>
                <Link href="/abc">Open Builder <ChevronRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </motion.div>

          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <p>&copy; 2024 AvatarFlowX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
