"use client";

import Link from "next/link";
import { Check, X, ArrowRight, Home, DollarSign, TrendingUp, Zap, Star, Users, AlertCircle, Shield, Clock, Target } from "lucide-react";
import { useEffect, useState } from "react";

const pricingData = {
    title: "Pricing That Actually Makes Sense",
    subtitle: "In-Depth Analysis: Why Open-Source AI Models Win for Startups",

    // Expanded Market Statistics
    marketStats: [
        { label: "ChatGPT Pro Cost", value: "$20", subtext: "Per user/month", annual: "$240", marketShare: "45%" },
        { label: "Cursor AI Cost", value: "$20", subtext: "Per user/month", annual: "$240", marketShare: "25%" },
        { label: "GitHub Copilot", value: "$10", subtext: "Per user/month", annual: "$120", marketShare: "30%" },
        { label: "Average Team Spend", value: "$3k", subtext: "5-person team/year", annual: "$3,000", marketShare: "100%" }
    ],

    // Industry Benchmarks
    industryBenchmarks: [
        { metric: "Avg Startup AI Budget", value: "$5,400", context: "Annual spend on AI tools (2024)" },
        { metric: "Developer Productivity Gain", value: "35%", context: "With AI assistance (GitHub study)" },
        { metric: "Cost per AI Request", value: "$0.13", context: "Average across premium platforms" },
        { metric: "Monthly Generations", value: "150", context: "Average per developer" },
        { metric: "Break-even Point", value: "23 reqs", context: "To justify $20/month cost" },
        { metric: "Annual Request Total", value: "9,000", context: "5-person team volume" }
    ],

    // Detailed Usage Statistics
    usageBreakdown: {
        lowUsage: { requests: 50, chatgptCost: 6.5, cursorCost: 6.5, avatarflowCost: 0 },
        mediumUsage: { requests: 150, chatgptCost: 20, cursorCost: 20, avatarflowCost: 0 },
        highUsage: { requests: 500, chatgptCost: 20, cursorCost: 20, avatarflowCost: 0 },
        enterprise: { requests: 2000, chatgptCost: 20, cursorCost: 20, avatarflowCost: 0 }
    },

    // Annual Cost Comparison (Expanded)
    annualComparison: {
        competitor: [
            { tool: "ChatGPT Pro (5 users)", monthly: 100, annual: 1200, perRequest: 0.067 },
            { tool: "Cursor AI (5 users)", monthly: 100, annual: 1200, perRequest: 0.067 },
            { tool: "GitHub Copilot (5 users)", monthly: 50, annual: 600, perRequest: 0.033 },
            { tool: "Subtotal AI Tools", monthly: 250, annual: 3000, perRequest: 0.167 },
            { tool: "Cloud Services", monthly: 100, annual: 1200, perRequest: 0 },
            { tool: "Total Annual Cost", monthly: 350, annual: 4200, perRequest: 0.167 }
        ],
        avatarflow: [
            { tool: "AvatarFlow Platform", monthly: 0, annual: 0, perRequest: 0 },
            { tool: "Open-Source Models", monthly: 0, annual: 0, perRequest: 0 },
            { tool: "Unlimited Users", monthly: 0, annual: 0, perRequest: 0 },
            { tool: "Cloud Hosting (Optional)", monthly: 17, annual: 200, perRequest: 0 },
            { tool: "Total Annual Cost", monthly: 17, annual: 200, perRequest: 0 }
        ]
    },

    // Expanded Model Comparison
    modelComparison: [
        {
            category: "Code Generation & Completion",
            openSource: { name: "CodeLlama 70B / DeepSeek Coder", cost: "$0", performance: "94%", speed: "Fast", quality: "Production-ready" },
            premium: { name: "GPT-4 Turbo / Cursor", cost: "$20/mo", performance: "97%", speed: "Fast", quality: "Production-ready" },
            verdict: "3% better performance for infinite cost increase",
            costPer1000: { openSource: "$0", premium: "$0.67" }
        },
        {
            category: "Chat & Requirements Planning",
            openSource: { name: "Llama 3.1 70B / Mixtral 8x7B", cost: "$0", performance: "91%", speed: "Very Fast", quality: "Excellent" },
            premium: { name: "Claude Pro", cost: "$20/mo", performance: "95%", speed: "Fast", quality: "Excellent" },
            verdict: "4% better for $240/year premium",
            costPer1000: { openSource: "$0", premium: "$0.67" }
        },
        {
            category: "UI/UX Component Generation",
            openSource: { name: "Qwen 2.5 Coder 32B", cost: "$0", performance: "89%", speed: "Fast", quality: "High" },
            premium: { name: "Cursor AI Composer", cost: "$20/mo", performance: "93%", speed: "Fast", quality: "Very High" },
            verdict: "4% improvement costs $240/year",
            costPer1000: { openSource: "$0", premium: "$0.67" }
        },
        {
            category: "System Architecture Design",
            openSource: { name: "DeepSeek Coder V2", cost: "$0", performance: "87%", speed: "Fast", quality: "Good" },
            premium: { name: "GitHub Copilot Chat", cost: "$10/mo", performance: "90%", speed: "Fast", quality: "Very Good" },
            verdict: "3% gain for $120/year",
            costPer1000: { openSource: "$0", premium: "$0.33" }
        },
        {
            category: "Documentation & Comments",
            openSource: { name: "Llama 3.1 8B Instruct", cost: "$0", performance: "92%", speed: "Very Fast", quality: "Excellent" },
            premium: { name: "ChatGPT Plus", cost: "$20/mo", performance: "94%", speed: "Fast", quality: "Excellent" },
            verdict: "2% improvement, 240/year cost",
            costPer1000: { openSource: "$0", premium: "$0.67" }
        }
    ],

    // Pricing Tiers (Expanded)
    tiers: [
        {
            name: "AvatarFlow Free",
            price: "$0",
            priceDetail: "Forever",
            description: "For entrepreneurs validating ideas",
            features: [
                { text: "Unlimited flowchart creation", included: true, detail: "No limits" },
                { text: "Full-stack code generation", included: true, detail: "Frontend + Backend + DB + API" },
                { text: "Open-source AI models", included: true, detail: "CodeLlama, Llama 3.1, Qwen" },
                { text: "Export all generated code", included: true, detail: "Download anytime" },
                { text: "Community support", included: true, detail: "Discord + Docs" },
                { text: "Unlimited projects", included: true, detail: "No project caps" },
                { text: "Visual builder access", included: true, detail: "Drag & drop editor" },
                { text: "Database design tools", included: true, detail: "Visual schema design" },
                { text: "No watermarks", included: true, detail: "100% your brand" },
                { text: "Commercial use allowed", included: true, detail: "Sell your apps" },
                { text: "Unlimited team members", included: true, detail: "Collaborate freely" },
                { text: "Version control integration", included: true, detail: "Git export ready" }
            ],
            highlighted: true,
            savings: "$3,000/year vs competitors"
        },
        {
            name: "ChatGPT Pro",
            price: "$20",
            priceDetail: "Per user/month",
            description: "Premium AI chat interface",
            features: [
                { text: "Chat-based coding help", included: true, detail: "Text interface" },
                { text: "GPT-4 Turbo access", included: true, detail: "Latest model" },
                { text: "Manual copy-paste workflow", included: true, detail: "No automation" },
                { text: "Rate limits apply", included: true, detail: "40 msgs/3hrs" },
                { text: "No visual flowcharts", included: false, detail: "Text only" },
                { text: "No full-stack generation", included: false, detail: "Snippets only" },
                { text: "No database design UI", included: false, detail: "Manual SQL" },
                { text: "Requires coding knowledge", included: false, detail: "Technical users" },
                { text: "Per-user pricing", included: false, detail: "$100/mo for 5" },
                { text: "Subscription required", included: false, detail: "Monthly billing" },
                { text: "No team collaboration", included: false, detail: "Individual only" },
                { text: "Annual cost: $240", included: false, detail: "Per person" }
            ],
            highlighted: false,
            savings: null
        },
        {
            name: "Cursor AI",
            price: "$20",
            priceDetail: "Per seat/month",
            description: "AI-powered code editor",
            features: [
                { text: "AI code editor", included: true, detail: "VSCode fork" },
                { text: "Inline code suggestions", included: true, detail: "Real-time" },
                { text: "Composer mode", included: true, detail: "Multi-file edits" },
                { text: "Requires IDE setup", included: true, detail: "Complex install" },
                { text: "No visual workflow builder", included: false, detail: "Code-first" },
                { text: "No architecture planner", included: false, detail: "Manual design" },
                { text: "Limited to text editing", included: false, detail: "No flowcharts" },
                { text: "Steep learning curve", included: false, detail: "IDE knowledge needed" },
                { text: "Per-seat licensing", included: false, detail: "$100/mo for 5" },
                { text: "Monthly subscription", included: false, detail: "Recurring cost" },
                { text: "Team sync limitations", included: false, detail: "No shared state" },
                { text: "Annual cost: $240", included: false, detail: "Per developer" }
            ],
            highlighted: false,
            savings: null
        }
    ],

    // ROI Breakdown (Enhanced)
    roiBreakdown: {
        scenarios: [
            {
                scenario: "Solo Founder - 3 MVPs/Year",
                traditional: {
                    chatgpt: 240,
                    cursor: 240,
                    copilot: 120,
                    developerTime: 12000,
                    total: 12600
                },
                avatarflow: {
                    platform: 0,
                    hosting: 150,
                    total: 150
                }
            },
            {
                scenario: "Small Team (5) - 10 MVPs/Year",
                traditional: {
                    chatgpt: 1200,
                    cursor: 1200,
                    copilot: 600,
                    developerTime: 50000,
                    total: 53000
                },
                avatarflow: {
                    platform: 0,
                    hosting: 500,
                    total: 500
                }
            },
            {
                scenario: "Agency (10) - 30 MVPs/Year",
                traditional: {
                    chatgpt: 2400,
                    cursor: 2400,
                    copilot: 1200,
                    developerTime: 150000,
                    total: 156000
                },
                avatarflow: {
                    platform: 0,
                    hosting: 1200,
                    total: 1200
                }
            }
        ]
    },

    // Hidden Costs Analysis
    hiddenCosts: [
        { item: "Learning Curve", traditional: "40-80 hours", avatarflow: "2-4 hours", savings: "95% time saved" },
        { item: "Context Switching", traditional: "Multiple tools", avatarflow: "One platform", savings: "Unified workflow" },
        { item: "Manual Integration", traditional: "High effort", avatarflow: "Auto-generated", savings: "Zero effort" },
        { item: "Team Onboarding", traditional: "2-4 weeks", avatarflow: "1-2 days", savings: "90% faster" },
        { item: "Maintenance Updates", traditional: "Ongoing cost", avatarflow: "Included free", savings: "$0 extra" },
        { item: "Version Conflicts", traditional: "Common issue", avatarflow: "Non-existent", savings: "No downtime" }
    ]
};

// Animated Counter with hydration fix
function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "" }: { end: number; duration?: number; prefix?: string; suffix?: string }) {
    const [count, setCount] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    // Return plain number on server, formatted on client
    if (!isMounted) {
        return <span suppressHydrationWarning>{prefix}0{suffix}</span>;
    }

    return <span suppressHydrationWarning>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function PricingPage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Navigation */}
            <nav className="border-b border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors group">
                        <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-semibold">Back to Home</span>
                    </Link>
                    <Link
                        href="/builder"
                        className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-md hover:shadow-lg"
                    >
                        Start Building Free
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="py-20 px-6">
                <div className={`max-w-6xl mx-auto space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-200 dark:bg-slate-800 rounded-full border border-slate-400 dark:border-slate-600 shadow-sm">
                        <DollarSign className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Comprehensive Pricing Analysis 2024</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight max-w-5xl">
                        {pricingData.title}
                    </h1>

                    <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-400 font-medium max-w-4xl">
                        {pricingData.subtitle}
                    </p>
                </div>
            </section>

            {/* Market Stats */}
            <section className="py-16 px-6 bg-white dark:bg-slate-900 border-y border-slate-300 dark:border-slate-700">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Premium AI Tool Pricing (2024)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pricingData.marketStats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-850 p-6 rounded-xl border-2 border-slate-300 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        {stat.label}
                                    </p>
                                    <p className="text-4xl font-black text-slate-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        {stat.subtext}
                                    </p>
                                    <div className="pt-2 border-t border-slate-300 dark:border-slate-700">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">{stat.annual}/year</span>
                                            <span className="text-slate-500 dark:text-slate-500">{stat.marketShare} share</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Industry Benchmarks */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Industry Benchmarks & Statistics</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Real-world usage data and cost metrics</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pricingData.industryBenchmarks.map((bench, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                                <div className="space-y-3">
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">{bench.metric}</p>
                                    <p className="text-4xl font-black text-slate-900 dark:text-white">{bench.value}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{bench.context}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Usage-Based Cost Comparison */}
            <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Cost by Usage Tier</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Monthly cost comparison across usage levels</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Object.entries(pricingData.usageBreakdown).map(([tier, data], i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-lg">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 capitalize">{tier.replace('Usage', ' Usage')}</h3>
                                <div className="space-y-3">
                                    <div className="text-sm text-slate-600 dark:text-slate-400">{data.requests} requests/month</div>
                                    <div className="space-y-2 pt-3 border-t border-slate-300 dark:border-slate-700">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">ChatGPT:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">${data.chatgptCost}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">Cursor AI:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">${data.cursorCost}</span>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2 border-t border-slate-300 dark:border-slate-700">
                                            <span className="text-slate-900 dark:text-white font-bold">AvatarFlow:</span>
                                            <span className="text-xl font-black text-slate-900 dark:text-white">${data.avatarflowCost}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Annual Cost Comparison */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                            Detailed Annual Cost Breakdown
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            5-person team — complete first-year analysis
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Premium Tools */}
                        <div className="bg-white dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-600 rounded-2xl p-8 shadow-2xl">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-6 border-b-2 border-slate-300 dark:border-slate-700">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Premium Stack</h3>
                                    <Star className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                                </div>

                                <div className="space-y-4">
                                    {pricingData.annualComparison.competitor.map((item, i) => (
                                        <div key={i} className={`space-y-2 ${item.tool.includes('Total') ? 'pt-4 border-t-2 border-slate-400 dark:border-slate-600' : ''}`}>
                                            <div className="flex justify-between items-center">
                                                <span className={`text-sm ${item.tool.includes('Total') ? 'font-black text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                                                    {item.tool}
                                                </span>
                                                <div className="text-right">
                                                    <span className={`block ${item.tool.includes('Total') ? 'text-2xl font-black text-slate-900 dark:text-white' : 'text-lg font-bold text-slate-900 dark:text-white'}`}>
                                                        ${item.annual.toLocaleString()}
                                                    </span>
                                                    {item.perRequest > 0 && (
                                                        <span className="text-xs text-slate-500 dark:text-slate-500">${item.perRequest}/req</span>
                                                    )}
                                                </div>
                                            </div>
                                            {!item.tool.includes('Total') && (
                                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-slate-500 to-slate-700 dark:from-slate-600 dark:to-slate-500 transition-all duration-1000 rounded-full"
                                                        style={{ width: `${(item.annual / 4200) * 100}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* AvatarFlow */}
                        <div className="bg-slate-900 dark:bg-slate-100 border-2 border-slate-800 dark:border-slate-300 rounded-2xl p-8 shadow-2xl">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-6 border-b-2 border-slate-700 dark:border-slate-300">
                                    <h3 className="text-2xl font-black text-white dark:text-slate-900">AvatarFlow</h3>
                                    <Zap className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                                </div>

                                <div className="space-y-4">
                                    {pricingData.annualComparison.avatarflow.map((item, i) => (
                                        <div key={i} className={`space-y-2 ${item.tool.includes('Total') ? 'pt-4 border-t-2 border-slate-700 dark:border-slate-300' : ''}`}>
                                            <div className="flex justify-between items-center">
                                                <span className={`text-sm ${item.tool.includes('Total') ? 'font-black text-white dark:text-slate-900' : 'font-medium text-slate-300 dark:text-slate-700'}`}>
                                                    {item.tool}
                                                </span>
                                                <div className="text-right">
                                                    <span className={`block ${item.tool.includes('Total') ? 'text-2xl font-black text-white dark:text-slate-900' : 'text-lg font-bold text-white dark:text-slate-900'}`}>
                                                        ${item.annual.toLocaleString()}
                                                    </span>
                                                    {item.perRequest === 0 && !item.tool.includes('Total') && (
                                                        <span className="text-xs text-slate-400 dark:text-slate-600">$0/req</span>
                                                    )}
                                                </div>
                                            </div>
                                            {!item.tool.includes('Total') && (
                                                <div className="h-3 bg-slate-800 dark:bg-slate-300 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-white dark:bg-slate-900 transition-all duration-1000 rounded-full"
                                                        style={{ width: item.annual > 0 ? `${(item.annual / 200) * 100}%` : '0%' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center mt-6">
                                    <p className="text-sm font-black text-white dark:text-slate-900 bg-slate-800 dark:bg-slate-200 px-4 py-2 rounded-lg">
                                        95.2% Cost Reduction
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Savings */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-200 dark:to-slate-100 rounded-2xl p-8 text-center shadow-2xl border-2 border-slate-700 dark:border-slate-300">
                        <p className="text-2xl font-black text-white dark:text-slate-900 mb-2">Annual Savings (5-Person Team)</p>
                        <p className="text-6xl font-black text-white dark:text-slate-900">$<AnimatedCounter end={4000} duration={2000} /></p>
                        <p className="text-sm text-slate-400 dark:text-slate-600 mt-4">Enough to fund marketing, design, or extend runway by 6+ months</p>
                    </div>
                </div>
            </section>

            {/* Model Comparison (Enhanced) */}
            <section className="py-20 px-6 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                            Open-Source vs Premium: Deep Dive
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Performance, cost, and quality comparison across 5 categories
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {pricingData.modelComparison.map((comparison, i) => (
                            <div key={i} className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-850 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{comparison.category}</h3>

                                <div className="grid md:grid-cols-2 gap-8 mb-6">
                                    {/* Open Source */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Check className="w-6 h-6 text-slate-700 dark:text-slate-300" strokeWidth={3} />
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">Open-Source</span>
                                        </div>
                                        <p className="text-xl font-semibold text-slate-800 dark:text-slate-200">{comparison.openSource.name}</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm text-slate-600 dark:text-slate-400 block">Cost:</span>
                                                <span className="text-2xl font-black text-slate-900 dark:text-white">{comparison.openSource.cost}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-slate-600 dark:text-slate-400 block">Performance:</span>
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white">{comparison.openSource.performance}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-slate-600 dark:text-slate-400 block">Speed:</span>
                                                <span className="text-lg font-bold text-slate-900 dark:text-white">{comparison.openSource.speed}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-slate-600 dark:text-slate-400 block">Quality:</span>
                                                <span className="text-lg font-bold text-slate-900 dark:text-white">{comparison.openSource.quality}</span>
                                            </div>
                                        </div>
                                        <div className="pt-3 border-t border-slate-300 dark:border-slate-700">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">Cost per 1000 requests:</span>
                                            <span className="text-lg font-black text-slate-900 dark:text-white ml-2">{comparison.costPer1000.openSource}</span>
                                        </div>
                                    </div>

                                    {/* Premium */}
                                    <div className="space-y-4 opacity-80">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Star className="w-6 h-6 text-slate-500 dark:text-slate-500" />
                                            <span className="text-lg font-bold text-slate-700 dark:text-slate-400">Premium</span>
                                        </div>
                                        <p className="text-xl font-semibold text-slate-700 dark:text-slate-400">{comparison.premium.name}</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-sm text-slate-600 dark:text-slate-500 block">Cost:</span>
                                                <span className="text-2xl font-black text-slate-700 dark:text-slate-400">{comparison.premium.cost}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-slate-600 dark:text-slate-500 block">Performance:</span>
                                                <span className="text-2xl font-bold text-slate-700 dark:text-slate-400">{comparison.premium.performance}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-slate-600 dark:text-slate-500 block">Speed:</span>
                                                <span className="text-lg font-bold text-slate-700 dark:text-slate-400">{comparison.premium.speed}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-slate-600 dark:text-slate-500 block">Quality:</span>
                                                <span className="text-lg font-bold text-slate-700 dark:text-slate-400">{comparison.premium.quality}</span>
                                            </div>
                                        </div>
                                        <div className="pt-3 border-t border-slate-300 dark:border-slate-700">
                                            <span className="text-xs text-slate-600 dark:text-slate-500">Cost per 1000 requests:</span>
                                            <span className="text-lg font-black text-slate-700 dark:text-slate-400 ml-2">{comparison.costPer1000.premium}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t-2 border-slate-300 dark:border-slate-700">
                                    <p className="text-base font-bold text-slate-800 dark:text-slate-300 text-center italic">
                                        ⚖️ {comparison.verdict}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hidden Costs */}
            <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Hidden Costs Analysis</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Beyond subscription fees — the real total cost of ownership</p>
                    </div>

                    <div className="grid gap-4">
                        {pricingData.hiddenCosts.map((cost, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                                <div className="grid md:grid-cols-4 gap-4 items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cost.item}</h3>
                                    </div>
                                    <div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Traditional:</span>
                                        <span className="text-base font-bold text-slate-700 dark:text-slate-300">{cost.traditional}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400 block mb-1">AvatarFlow:</span>
                                        <span className="text-base font-bold text-slate-900 dark:text-white">{cost.avatarflow}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block px-3 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold rounded-full">
                                            {cost.savings}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                            Feature-by-Feature Comparison
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            What you get with each platform — detailed breakdown
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {pricingData.tiers.map((tier, i) => (
                            <div
                                key={i}
                                className={`rounded-2xl p-8 shadow-2xl border-2 transition-all hover:scale-105 ${tier.highlighted
                                    ? 'bg-slate-900 dark:bg-slate-100 border-slate-800 dark:border-slate-200 ring-4 ring-slate-700 dark:ring-slate-300'
                                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                                    }`}
                            >
                                <div className="space-y-6">
                                    {tier.highlighted && (
                                        <div className="mb-4">
                                            <span className="inline-block px-3 py-1 bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900 text-xs font-bold rounded-full uppercase tracking-wider">
                                                Recommended
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className={`text-2xl font-black mb-2 ${tier.highlighted ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>
                                            {tier.name}
                                        </h3>
                                        <p className={`text-5xl font-black mb-1 ${tier.highlighted ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>
                                            {tier.price}
                                        </p>
                                        <p className={`text-sm mb-2 ${tier.highlighted ? 'text-slate-400 dark:text-slate-600' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {tier.priceDetail}
                                        </p>
                                        <p className={`text-sm ${tier.highlighted ? 'text-slate-400 dark:text-slate-600' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {tier.description}
                                        </p>
                                        {tier.savings && (
                                            <p className="text-sm font-bold text-white dark:text-slate-900 mt-2 bg-slate-700 dark:bg-slate-300 px-3 py-1 rounded-lg inline-block">
                                                {tier.savings}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3 pt-6 border-t-2 border-slate-700 dark:border-slate-300">
                                        {tier.features.map((feature, j) => (
                                            <div key={j} className="flex items-start gap-3">
                                                {feature.included ? (
                                                    <Check className={`w-5 h-5 shrink-0 mt-0.5 ${tier.highlighted ? 'text-white dark:text-slate-900' : 'text-slate-700 dark:text-slate-300'}`} strokeWidth={3} />
                                                ) : (
                                                    <X className={`w-5 h-5 shrink-0 mt-0.5 ${tier.highlighted ? 'text-slate-600 dark:text-slate-500' : 'text-slate-400 dark:text-slate-600'}`} strokeWidth={3} />
                                                )}
                                                <div className="flex-1">
                                                    <span className={`text-sm block ${feature.included
                                                        ? (tier.highlighted ? 'text-white dark:text-slate-900 font-medium' : 'text-slate-900 dark:text-white font-medium')
                                                        : 'text-slate-500 dark:text-slate-500 line-through'
                                                        }`}>
                                                        {feature.text}
                                                    </span>
                                                    {feature.detail && (
                                                        <span className={`text-xs ${tier.highlighted ? 'text-slate-500 dark:text-slate-600' : 'text-slate-500 dark:text-slate-500'}`}>
                                                            {feature.detail}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        href={tier.highlighted ? "/builder" : "#"}
                                        className={`block w-full py-4 rounded-lg font-bold text-center transition-all mt-6 ${tier.highlighted
                                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 shadow-lg'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-not-allowed opacity-50'
                                            }`}
                                    >
                                        {tier.highlighted ? 'Start Building Free' : 'External Platform'}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ROI Scenarios */}
            <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                            Real-World ROI Scenarios
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Savings analysis across different team sizes and project volumes
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {pricingData.roiBreakdown.scenarios.map((scenario, i) => {
                            const savings = scenario.traditional.total - scenario.avatarflow.total;
                            const savingsPercent = ((savings / scenario.traditional.total) * 100).toFixed(1);

                            return (
                                <div key={i} className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-8 shadow-xl">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{scenario.scenario}</h3>

                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-3">Traditional Stack:</p>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">AI Tools:</span><span className="font-bold text-slate-900 dark:text-white">${(scenario.traditional.chatgpt + scenario.traditional.cursor + scenario.traditional.copilot).toLocaleString()}</span></div>
                                                <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Dev Time:</span><span className="font-bold text-slate-900 dark:text-white">${scenario.traditional.developerTime.toLocaleString()}</span></div>
                                                <div className="flex justify-between pt-2 border-t border-slate-300 dark:border-slate-700"><span className="font-bold text-slate-900 dark:text-white">Total:</span><span className="text-lg font-black text-slate-900 dark:text-white">${scenario.traditional.total.toLocaleString()}</span></div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t-2 border-slate-300 dark:border-slate-700">
                                            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-3">AvatarFlow:</p>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Platform:</span><span className="font-bold text-slate-900 dark:text-white">${scenario.avatarflow.platform}</span></div>
                                                <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Hosting:</span><span className="font-bold text-slate-900 dark:text-white">${scenario.avatarflow.hosting}</span></div>
                                                <div className="flex justify-between pt-2 border-t border-slate-300 dark:border-slate-700"><span className="font-bold text-slate-900 dark:text-white">Total:</span><span className="text-lg font-black text-slate-900 dark:text-white">${scenario.avatarflow.total.toLocaleString()}</span></div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t-2 border-slate-300 dark:border-slate-700 text-center space-y-2">
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Total Savings</p>
                                            <p className="text-3xl font-black text-slate-900 dark:text-white">${savings.toLocaleString()}</p>
                                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{savingsPercent}% reduction</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 rounded-3xl p-12 md:p-16 text-center shadow-2xl border-2 border-slate-700 dark:border-slate-300">
                        <h2 className="text-3xl md:text-4xl font-black text-white dark:text-slate-900 mb-6">
                            Why Pay When You Can Build for Free?
                        </h2>
                        <p className="text-slate-300 dark:text-slate-600 mb-10 text-xl max-w-2xl mx-auto font-medium">
                            Join 10,000+ entrepreneurs who ditched expensive subscriptions. Start building with open-source AI today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                            <Link
                                href="/builder"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-black text-lg hover:scale-105 transition-all shadow-lg hover:shadow-2xl"
                            >
                                Start Building Free
                                <ArrowRight className="w-6 h-6" />
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-black text-lg hover:scale-105 transition-all border-2 border-slate-700 dark:border-slate-400"
                            >
                                Back to Home
                            </Link>
                        </div>

                        <div className="pt-10 border-t border-slate-700 dark:border-slate-300 space-y-3">
                            <div className="flex items-center justify-center gap-6 text-sm text-slate-400 dark:text-slate-600 font-medium">
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4" />
                                    <span>No credit card</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4" />
                                    <span>No subscriptions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4" />
                                    <span>No limits</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-600">
                                Save $3,000-$150,000+ per year compared to traditional development
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
