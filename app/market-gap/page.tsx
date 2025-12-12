"use client";

import Link from "next/link";
import { Check, ArrowRight, TrendingUp, DollarSign, Clock, Users, Home, BarChart3, Zap, Target, Award, Brain, Code, Rocket } from "lucide-react";
import { useEffect, useState } from "react";

const marketGapData = {
    title: "Turn Non-Technical Founders Into \"Instant Tech Founders\" Without Hiring Anyone",
    subtitle: "Discover the Market Gap: Build Full-Stack Apps Through Flowcharts",

    // Key Statistics
    stats: [
        { label: "Average Developer Salary", value: "$120k", subtext: "Per year in the US (2024)", change: "+12% YoY" },
        { label: "Traditional MVP Timeline", value: "6-12", subtext: "Months to build", change: "Industry avg" },
        { label: "Startup Failure Rate", value: "90%", subtext: "Due to cash burn", change: "CB Insights" },
        { label: "Average Series A Raise", value: "$15M", subtext: "Required validation", change: "+8% YoY" }
    ],

    // Market Size Data
    marketSize: [
        { year: "2020", value: 23 },
        { year: "2021", value: 31 },
        { year: "2022", value: 42 },
        { year: "2023", value: 58 },
        { year: "2024", value: 76 }
    ],

    // ROI Metrics
    roiMetrics: {
        timeToMVP: {
            traditional: 240, // days
            avatarflow: 3 // days
        },
        costPerFeature: {
            traditional: 5000,
            avatarflow: 50
        },
        iterationSpeed: {
            traditional: 14, // days
            avatarflow: 1 // days
        },
        totalCost: {
            traditional: 178000,
            avatarflow: 280
        }
    },

    // Detailed Cost Breakdown
    costBreakdown: {
        traditional: {
            total: 178000,
            items: [
                { label: "Lead Developer", cost: 120000, percentage: 67 },
                { label: "ChatGPT Pro (team of 5)", cost: 480, percentage: 0.3 },
                { label: "Cursor AI Subscription", cost: 240, percentage: 0.1 },
                { label: "Cloud Infrastructure", cost: 12000, percentage: 7 },
                { label: "Recruiting Fees (15%)", cost: 15000, percentage: 8 },
                { label: "Project Delays & Overhead", cost: 30000, percentage: 17 }
            ]
        },
        avatarflow: {
            total: 280,
            items: [
                { label: "AvatarFlow Platform", cost: 0, percentage: 0 },
                { label: "Cloud Hosting (Basic)", cost: 200, percentage: 71 },
                { label: "Domain Registration", cost: 80, percentage: 29 },
                { label: "Developer Hiring", cost: 0, percentage: 0 },
                { label: "AI Subscriptions", cost: 0, percentage: 0 },
                { label: "Project Delays", cost: 0, percentage: 0 }
            ]
        }
    },

    // Timeline Comparison
    timeline: [
        {
            phase: "Planning & Design",
            traditional: 30,
            avatarflow: 2
        },
        {
            phase: "Development",
            traditional: 120,
            avatarflow: 1
        },
        {
            phase: "Testing & QA",
            traditional: 45,
            avatarflow: 0.5
        },
        {
            phase: "Deployment",
            traditional: 15,
            avatarflow: 0.5
        }
    ],

    // Success Metrics
    successMetrics: [
        { metric: "Ideas Validated", traditional: "1-2", avatarflow: "10-15", improvement: "800%" },
        { metric: "Time to Market", traditional: "8 months", avatarflow: "3 days", improvement: "99%" },
        { metric: "Capital Efficiency", traditional: "$150k+", avatarflow: "$300", improvement: "99.8%" },
        { metric: "Iteration Cycles", traditional: "2-3/year", avatarflow: "50+/year", improvement: "2000%" },
        { metric: "Technical Debt", traditional: "High", avatarflow: "Zero", improvement: "100%" },
        { metric: "Team Size Needed", traditional: "3-5", avatarflow: "Just You", improvement: "100%" }
    ],

    benefits: [
        {
            text: "No coding required — just map your business logic visually",
            subtext: "If you can draw a flowchart, you can build an app",
            metric: "0 hours coding",
            stat: "100% visual"
        },
        {
            text: "Zero developer costs for MVP validation",
            subtext: "Test your idea without burning $50k-$100k on developers",
            metric: "$0 hiring",
            stat: "99.8% savings"
        },
        {
            text: "Full-stack output: frontend, backend, database, APIs",
            subtext: "Production-ready code you can deploy immediately",
            metric: "4 layers auto",
            stat: "Complete stack"
        },
        {
            text: "Open-source AI models = no premium subscriptions",
            subtext: "Save thousands vs ChatGPT Pro, Cursor, or Anthropic",
            metric: "$480/yr saved",
            stat: "Free forever"
        },
        {
            text: "From idea to working prototype in hours, not months",
            subtext: "Move at startup speed without the startup capital",
            metric: "99% faster",
            stat: "3 days avg"
        },
        {
            text: "Own your code — export, modify, scale as you grow",
            subtext: "No vendor lock-in, no platform fees, complete control",
            metric: "100% yours",
            stat: "Full ownership"
        }
    ]
};

// Animated Counter
function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "" }: { end: number; duration?: number; prefix?: string; suffix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
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

    return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// Bar Chart Component
function BarChart({ data, maxValue }: { data: { label: string; value: number }[]; maxValue: number }) {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-4">
            {data.map((item, i) => {
                const percentage = (item.value / maxValue) * 100;
                return (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                            <span className="text-slate-900 dark:text-white font-bold">{item.value}B+</span>
                        </div>
                        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-600 dark:to-slate-400 transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                                style={{ width: animated ? `${percentage}%` : '0%' }}
                            >
                                <span className="text-white text-xs font-bold">{percentage.toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function MarketGapPage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const maxMarketSize = Math.max(...marketGapData.marketSize.map(m => m.value));

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

            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className={`max-w-6xl mx-auto space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-200 dark:bg-slate-800 rounded-full border border-slate-400 dark:border-slate-600 shadow-sm">
                        <BarChart3 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Market Gap Analysis 2024</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight max-w-5xl">
                        {marketGapData.title}
                    </h1>

                    <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-400 font-medium max-w-4xl">
                        {marketGapData.subtitle}
                    </p>
                </div>
            </section>

            {/* Key Stats Grid */}
            <section className="py-16 px-6 bg-white dark:bg-slate-900 border-y border-slate-300 dark:border-slate-700">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Industry Benchmarks & Market Reality</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {marketGapData.stats.map((stat, index) => (
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
                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Market Size Growth */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                            No-Code/Low-Code Market Growth
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                            Global market size in billions (USD) — projected to reach $187B by 2030
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-8 shadow-xl">
                        <BarChart
                            data={marketGapData.marketSize.map(m => ({ label: m.year, value: m.value }))}
                            maxValue={maxMarketSize}
                        />
                        <div className="mt-6 pt-6 border-t-2 border-slate-300 dark:border-slate-700">
                            <p className="text-sm text-slate-600 dark:text-slate-400 text-center italic">
                                Source: Gartner Market Analysis, 2024 | CAGR: 23.2%
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ROI Comparison Matrix */}
            <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                            ROI Comparison Matrix
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Side-by-side analysis of key performance indicators
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {marketGapData.successMetrics.map((item, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{item.metric}</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Traditional:</span>
                                        <span className="text-lg font-bold text-slate-700 dark:text-slate-300">{item.traditional}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">AvatarFlow:</span>
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">{item.avatarflow}</span>
                                    </div>
                                    <div className="pt-3 border-t border-slate-300 dark:border-slate-700">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider">Improvement</span>
                                            <span className="text-sm font-black text-slate-900 dark:text-white">{item.improvement}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Comparison */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                            Development Timeline Comparison
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Days required per phase (industry averages)
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-8 shadow-xl space-y-8">
                        {marketGapData.timeline.map((phase, i) => (
                            <div key={i} className="space-y-3">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{phase.phase}</h3>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-4">
                                        <span className="w-32 text-sm text-slate-600 dark:text-slate-400">Traditional:</span>
                                        <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                                            <div
                                                className="h-full bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-600 dark:to-slate-400 transition-all duration-1000 flex items-center justify-end pr-4"
                                                style={{ width: `${(phase.traditional / 120) * 100}%` }}
                                            >
                                                <span className="text-white text-sm font-bold">{phase.traditional} days</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="w-32 text-sm text-slate-600 dark:text-slate-400">AvatarFlow:</span>
                                        <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                                            <div
                                                className="h-full bg-slate-900 dark:bg-slate-100 transition-all duration-1000 flex items-center justify-end pr-4"
                                                style={{ width: `${(phase.avatarflow / 120) * 100}%`, minWidth: '60px' }}
                                            >
                                                <span className="text-white dark:text-slate-900 text-sm font-bold">{phase.avatarflow} days</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        {Math.round((phase.traditional / phase.avatarflow))}x faster
                                    </span>
                                </div>
                            </div>
                        ))}

                        <div className="pt-6 border-t-2 border-slate-300 dark:border-slate-700 flex justify-between items-center">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">Total Timeline:</span>
                            <div className="text-right space-y-1">
                                <div className="text-sm text-slate-600 dark:text-slate-400">Traditional: <span className="font-bold text-slate-700 dark:text-slate-300">210 days</span></div>
                                <div className="text-sm text-slate-900 dark:text-white">AvatarFlow: <span className="font-black">4 days</span></div>
                                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">98% time reduction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cost Breakdown */}
            <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                            First Year Cost Analysis
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Detailed breakdown of expenses for MVP development
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Traditional */}
                        <div className="bg-white dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-600 rounded-2xl p-8 shadow-2xl">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-6 border-b-2 border-slate-300 dark:border-slate-700">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Traditional Path</h3>
                                    <Users className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                                </div>

                                <div className="space-y-4">
                                    {marketGapData.costBreakdown.traditional.items.map((item, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                                                <span className="text-slate-900 dark:text-white font-bold">${item.cost.toLocaleString()}</span>
                                            </div>
                                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-slate-500 to-slate-700 dark:from-slate-600 dark:to-slate-500 transition-all duration-1000 rounded-full"
                                                    style={{ width: `${item.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t-2 border-slate-400 dark:border-slate-600">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-lg font-bold text-slate-700 dark:text-slate-300">Total Cost:</span>
                                        <span className="text-4xl font-black text-slate-900 dark:text-white">
                                            $<AnimatedCounter end={marketGapData.costBreakdown.traditional.total} />
                                        </span>
                                    </div>
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
                                    {marketGapData.costBreakdown.avatarflow.items.map((item, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-300 dark:text-slate-700 font-medium">{item.label}</span>
                                                <span className="text-white dark:text-slate-900 font-bold">${item.cost.toLocaleString()}</span>
                                            </div>
                                            <div className="h-3 bg-slate-800 dark:bg-slate-300 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-white dark:bg-slate-900 transition-all duration-1000 rounded-full"
                                                    style={{ width: item.percentage > 0 ? `${item.percentage}%` : '2%' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t-2 border-slate-700 dark:border-slate-300">
                                    <div className="flex justify-between items-baseline mb-4">
                                        <span className="text-lg font-bold text-slate-300 dark:text-slate-700">Total Cost:</span>
                                        <span className="text-4xl font-black text-white dark:text-slate-900">
                                            $<AnimatedCounter end={marketGapData.costBreakdown.avatarflow.total} />
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-black text-white dark:text-slate-900 bg-slate-800 dark:bg-slate-200 px-4 py-2 rounded-lg">
                                            99.84% Cost Reduction
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Savings Highlight */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-200 dark:to-slate-100 rounded-2xl p-8 text-center shadow-2xl border-2 border-slate-700 dark:border-slate-300">
                        <p className="text-2xl font-black text-white dark:text-slate-900 mb-2">
                            Total Savings in Year 1
                        </p>
                        <p className="text-6xl font-black text-white dark:text-slate-900">
                            $<AnimatedCounter end={177720} duration={3000} />
                        </p>
                        <p className="text-sm text-slate-400 dark:text-slate-600 mt-4">
                            Enough capital to fund 2-3 additional startup ideas or extend your runway by 2+ years
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-6 bg-white dark:bg-slate-900">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                            Six Core Advantages
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                            How AvatarFlow eliminates traditional development barriers
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {marketGapData.benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex gap-6 p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-850 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:shadow-xl transition-all duration-300 group hover:scale-[1.02]"
                            >
                                <div className="shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center border-2 border-slate-400 dark:border-slate-600 group-hover:scale-110 transition-transform">
                                        <Check className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={3} />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <p className="text-lg text-slate-900 dark:text-white font-bold leading-relaxed">
                                        {benefit.text}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {benefit.subtext}
                                    </p>
                                    <div className="flex gap-3 pt-2">
                                        <span className="inline-block px-3 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-full">
                                            {benefit.metric}
                                        </span>
                                        <span className="inline-block px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold rounded-full">
                                            {benefit.stat}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 rounded-3xl p-12 md:p-16 text-center shadow-2xl border-2 border-slate-700 dark:border-slate-300">
                        <h2 className="text-3xl md:text-4xl font-black text-white dark:text-slate-900 mb-6">
                            Ready to Exploit This Market Gap?
                        </h2>
                        <p className="text-slate-300 dark:text-slate-600 mb-10 text-xl max-w-2xl mx-auto font-medium">
                            Join the 10,000+ non-technical founders who are shipping products without hiring developers or burning capital.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
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

                        <div className="mt-10 pt-10 border-t border-slate-700 dark:border-slate-300">
                            <p className="text-sm text-slate-400 dark:text-slate-600 font-medium">
                                No credit card required • Free forever • Export your code anytime
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badge */}
            <section className="py-12 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-slate-500 dark:text-slate-500 italic text-base">
                        "This is a creative game-changer for non-technical founders — they keep calling it 'the unfair advantage.'"
                    </p>
                </div>
            </section>
        </div>
    );
}
