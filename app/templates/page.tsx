"use client";

import Link from "next/link";
import { Check, ArrowRight, Home, LayoutTemplate, ShoppingCart, Briefcase, BarChart3, Users, FileLock, Calendar, MessageSquare, Zap, Download, Eye, Star, TrendingUp, Award, Layers } from "lucide-react";
import { useEffect, useState } from "react";

const templatesData = {
    title: "Ready-Made Templates: Start Building in Minutes",
    subtitle: "Pre-Built Flowchart Templates for Every Business Need",

    // Template Statistics
    stats: [
        { label: "Total Templates", value: "85+", subtext: "Production-ready", growth: "+12/month" },
        { label: "Categories", value: "12", subtext: "Business verticals", growth: "Expanding" },
        { label: "Total Downloads", value: "45k+", subtext: "Templates deployed", growth: "+3k/month" },
        { label: "Avg Customization", value: "15min", subtext: "To production", growth: "From idea" }
    ],

    // Template Categories
    categories: [
        {
            name: "E-Commerce",
            icon: ShoppingCart,
            count: 15,
            description: "Online stores, marketplaces, and retail platforms",
            templates: [
                { name: "Basic Online Store", complexity: "Simple", uses: 8200, rating: 4.9 },
                { name: "Marketplace Platform", complexity: "Advanced", uses: 3400, rating: 4.8 },
                { name: "Subscription Box Service", complexity: "Medium", uses: 2100, rating: 4.7 },
                { name: "Digital Downloads Store", complexity: "Simple", uses: 5600, rating: 4.9 },
                { name: "Multi-Vendor Marketplace", complexity: "Advanced", uses: 1800, rating: 4.6 }
            ],
            features: ["Product catalog", "Shopping cart", "Payment integration", "Order management", "Inventory tracking"]
        },
        {
            name: "SaaS Applications",
            icon: Layers,
            count: 12,
            description: "Software-as-a-Service and subscription platforms",
            templates: [
                { name: "Project Management Tool", complexity: "Advanced", uses: 4500, rating: 4.9 },
                { name: "CRM System", complexity: "Advanced", uses: 3800, rating: 4.8 },
                { name: "Analytics Dashboard", complexity: "Medium", uses: 6200, rating: 4.9 },
                { name: "Team Collaboration", complexity: "Medium", uses: 5100, rating: 4.7 },
                { name: "Email Marketing Platform", complexity: "Advanced", uses: 2900, rating: 4.8 }
            ],
            features: ["User authentication", "Subscription billing", "Team management", "API access", "Admin dashboard"]
        },
        {
            name: "Social Platforms",
            icon: Users,
            count: 8,
            description: "Community, networking, and social apps",
            templates: [
                { name: "Social Network", complexity: "Advanced", uses: 2400, rating: 4.7 },
                { name: "Forum & Discussion Board", complexity: "Medium", uses: 3600, rating: 4.8 },
                { name: "Content Sharing Platform", complexity: "Medium", uses: 2800, rating: 4.6 },
                { name: "Professional Network", complexity: "Advanced", uses: 1900, rating: 4.7 }
            ],
            features: ["User profiles", "Follow/friend system", "Feed algorithm", "Notifications", "Messaging"]
        },
        {
            name: "Business Tools",
            icon: Briefcase,
            count: 10,
            description: "Internal tools and business automation",
            templates: [
                { name: "Invoice Generator", complexity: "Simple", uses: 7100, rating: 4.9 },
                { name: "Inventory Manager", complexity: "Medium", uses: 4200, rating: 4.8 },
                { name: "HR Management System", complexity: "Advanced", uses: 2300, rating: 4.7 },
                { name: "Expense Tracker", complexity: "Simple", uses: 5800, rating: 4.9 },
                { name: "Client Portal", complexity: "Medium", uses: 3500, rating: 4.8 }
            ],
            features: ["Workflow automation", "PDF generation", "Email notifications", "Reporting", "Multi-user access"]
        },
        {
            name: "Educational",
            icon: Award,
            count: 7,
            description: "Learning platforms and course management",
            templates: [
                { name: "Online Course Platform", complexity: "Advanced", uses: 3200, rating: 4.8 },
                { name: "Quiz & Assessment Tool", complexity: "Medium", uses: 4100, rating: 4.9 },
                { name: "Student Portal", complexity: "Medium", uses: 2900, rating: 4.7 },
                { name: "Tutoring Marketplace", complexity: "Advanced", uses: 1600, rating: 4.6 }
            ],
            features: ["Course management", "Progress tracking", "Certificates", "Video hosting", "Payment processing"]
        },
        {
            name: "Booking & Scheduling",
            icon: Calendar,
            count: 9,
            description: "Appointment and reservation systems",
            templates: [
                { name: "Appointment Scheduler", complexity: "Medium", uses: 5400, rating: 4.9 },
                { name: "Hotel Booking System", complexity: "Advanced", uses: 2100, rating: 4.7 },
                { name: "Restaurant Reservations", complexity: "Medium", uses: 3800, rating: 4.8 },
                { name: "Event Management", complexity: "Advanced", uses: 2600, rating: 4.8 },
                { name: "Service Booking", complexity: "Simple", uses: 4900, rating: 4.9 }
            ],
            features: ["Calendar integration", "Availability management", "Reminders", "Payment", "Cancellation handling"]
        },
        {
            name: "Dashboards & Analytics",
            icon: BarChart3,
            count: 11,
            description: "Data visualization and reporting tools",
            templates: [
                { name: "Business Intelligence Dashboard", complexity: "Advanced", uses: 3700, rating: 4.8 },
                { name: "Sales Analytics", complexity: "Medium", uses: 4800, rating: 4.9 },
                { name: "Marketing Metrics", complexity: "Medium", uses: 3200, rating: 4.7 },
                { name: "Financial Dashboard", complexity: "Advanced", uses: 2500, rating: 4.8 },
                { name: "Real-time Monitoring", complexity: "Advanced", uses: 2200, rating: 4.7 }
            ],
            features: ["Chart visualizations", "Real-time data", "Export reports", "Custom filters", "API integration"]
        },
        {
            name: "Messaging & Chat",
            icon: MessageSquare,
            count: 6,
            description: "Communication and chat applications",
            templates: [
                { name: "Real-time Chat App", complexity: "Advanced", uses: 2800, rating: 4.8 },
                { name: "Customer Support Chat", complexity: "Medium", uses: 4300, rating: 4.9 },
                { name: "Team Messaging", complexity: "Advanced", uses: 2100, rating: 4.7 },
                { name: "Chatbot Platform", complexity: "Advanced", uses: 1900, rating: 4.6 }
            ],
            features: ["Real-time messaging", "File sharing", "Typing indicators", "Read receipts", "Group chats"]
        }
    ],

    // Popular Templates (Top 10)
    popularTemplates: [
        { rank: 1, name: "Basic Online Store", category: "E-Commerce", downloads: 8200, rating: 4.9, buildTime: "10 mins" },
        { rank: 2, name: "Invoice Generator", category: "Business Tools", downloads: 7100, rating: 4.9, buildTime: "8 mins" },
        { rank: 3, name: "Analytics Dashboard", category: "SaaS", downloads: 6200, rating: 4.9, buildTime: "15 mins" },
        { rank: 4, name: "Expense Tracker", category: "Business Tools", downloads: 5800, rating: 4.9, buildTime: "7 mins" },
        { rank: 5, name: "Digital Downloads Store", category: "E-Commerce", downloads: 5600, rating: 4.9, buildTime: "12 mins" },
        { rank: 6, name: "Appointment Scheduler", category: "Booking", downloads: 5400, rating: 4.9, buildTime: "14 mins" },
        { rank: 7, name: "Team Collaboration", category: "SaaS", downloads: 5100, rating: 4.7, buildTime: "18 mins" },
        { rank: 8, name: "Service Booking", category: "Booking", downloads: 4900, rating: 4.9, buildTime: "11 mins" },
        { rank: 9, name: "Sales Analytics", category: "Dashboards", downloads: 4800, rating: 4.9, buildTime: "13 mins" },
        { rank: 10, name: "Project Management Tool", category: "SaaS", downloads: 4500, rating: 4.9, buildTime: "22 mins" }
    ],

    // Template Benefits
    benefits: [
        {
            title: "Save 40-80 Hours",
            description: "Pre-built architecture and logic means you skip the planning phase",
            stat: "Average time saved per project"
        },
        {
            title: "Best Practices Built-In",
            description: "Follow industry-standard patterns and security measures",
            stat: "Professionally architected"
        },
        {
            title: "Fully Customizable",
            description: "Modify every aspect to match your exact requirements",
            stat: "100% your own"
        },
        {
            title: "Production-Ready",
            description: "Deploy immediately or customize first — it's up to you",
            stat: "Zero bugs found"
        }
    ],

    // Use Case Examples
    useCases: [
        {
            title: "Agency/Freelancer",
            scenario: "Build client projects 10x faster",
            example: "Use 'Client Portal' template, customize branding in 20 mins, deploy same day",
            savings: "$5,000+ per project",
            timeReduction: "From 2 weeks to 2 days"
        },
        {
            title: "Startup Founder",
            scenario: "Validate ideas without hiring",
            example: "Launch 'SaaS Dashboard' MVP, get users, iterate based on feedback",
            savings: "$80,000 dev costs",
            timeReduction: "From 6 months to 1 week"
        },
        {
            title: "Corporate Team",
            scenario: "Internal tools without IT bottleneck",
            example: "Deploy 'Inventory Manager' for warehouse team in 1 afternoon",
            savings: "6-month IT backlog",
            timeReduction: "From never to tomorrow"
        }
    ],

    // Template Features
    features: {
        included: [
            "Complete flowchart logic",
            "Database schema design",
            "UI components & layouts",
            "API routes & endpoints",
            "Authentication system",
            "Payment integration ready",
            "Admin dashboard",
            "Mobile responsive",
            "Dark mode support",
            "Email notifications",
            "File upload handling",
            "Search & filtering"
        ],
        customizable: [
            "Brand colors & fonts",
            "UI component styles",
            "Business logic flows",
            "Database fields",
            "User roles & permissions",
            "Email templates",
            "Workflow automation",
            "Integration endpoints"
        ]
    }
};

// Animated Counter
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

    if (!isMounted) {
        return <span suppressHydrationWarning>{prefix}0{suffix}</span>;
    }

    return <span suppressHydrationWarning>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function TemplatesPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const filteredCategory = selectedCategory
        ? templatesData.categories.find(c => c.name === selectedCategory)
        : null;

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
                        Browse Templates
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="py-20 px-6">
                <div className={`max-w-6xl mx-auto space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-200 dark:bg-slate-800 rounded-full border border-slate-400 dark:border-slate-600 shadow-sm">
                        <LayoutTemplate className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Template Library 2024</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight max-w-5xl">
                        {templatesData.title}
                    </h1>

                    <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-400 font-medium max-w-4xl">
                        {templatesData.subtitle}
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-6 bg-white dark:bg-slate-900 border-y border-slate-300 dark:border-slate-700">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Template Library Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {templatesData.stats.map((stat, index) => (
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
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stat.growth}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Template Categories */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">12 Business Categories</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">85+ production-ready templates across all industries</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {templatesData.categories.map((category, i) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedCategory(category.name === selectedCategory ? null : category.name)}
                                    className={`text-left bg-white dark:bg-slate-900 border-2 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 ${selectedCategory === category.name
                                            ? 'border-slate-700 dark:border-slate-300 ring-2 ring-slate-600 dark:ring-slate-400'
                                            : 'border-slate-300 dark:border-slate-700'
                                        }`}
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                <Icon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{category.name}</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{category.count} templates</p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-slate-700 dark:text-slate-300">{category.description}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Category Details */}
                    {filteredCategory && (
                        <div className="mt-12 bg-slate-900 dark:bg-slate-100 border-2 border-slate-800 dark:border-slate-200 rounded-2xl p-8 shadow-2xl">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-3xl font-black text-white dark:text-slate-900">{filteredCategory.name} Templates</h3>
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className="text-slate-400 dark:text-slate-600 hover:text-white dark:hover:text-slate-900 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <p className="text-slate-300 dark:text-slate-700">{filteredCategory.description}</p>

                                {/* Template List */}
                                <div className="space-y-3">
                                    {filteredCategory.templates.map((template, j) => (
                                        <div key={j} className="flex items-center justify-between p-4 bg-slate-800 dark:bg-slate-200 rounded-lg border border-slate-700 dark:border-slate-300">
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-white dark:text-slate-900">{template.name}</h4>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-xs px-2 py-1 bg-slate-700 dark:bg-slate-300 text-slate-300 dark:text-slate-700 rounded">{template.complexity}</span>
                                                    <span className="text-sm text-slate-400 dark:text-slate-600">{template.uses.toLocaleString()} uses</span>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-white text-white dark:fill-slate-900 dark:text-slate-900" />
                                                        <span className="text-sm font-bold text-white dark:text-slate-900">{template.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link
                                                href="/builder"
                                                className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                            >
                                                Use Template
                                            </Link>
                                        </div>
                                    ))}
                                </div>

                                {/* Features */}
                                <div className="pt-6 border-t border-slate-700 dark:border-slate-300">
                                    <p className="text-sm font-bold text-white dark:text-slate-900 mb-3">Included Features:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {filteredCategory.features.map((feature, k) => (
                                            <span key={k} className="px-3 py-1 bg-slate-700 dark:bg-slate-300 text-slate-300 dark:text-slate-700 text-xs font-bold rounded-full">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Popular Templates */}
            <section className="py-20 px-6 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Top 10 Most Popular Templates</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Most downloaded and highest rated</p>
                    </div>

                    <div className="grid gap-4">
                        {templatesData.popularTemplates.map((template, i) => (
                            <div key={i} className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-850 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
                                            <span className="text-xl font-black text-white dark:text-slate-900">#{template.rank}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{template.name}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{template.category}</p>
                                    </div>

                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-right">
                                            <div className="flex items-center gap-1">
                                                <Download className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                <span className="font-bold text-slate-900 dark:text-white">{template.downloads.toLocaleString()}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-500">downloads</p>
                                        </div>

                                        <div className="text-right">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-slate-700 text-slate-700 dark:fill-slate-300 dark:text-slate-300" />
                                                <span className="font-bold text-slate-900 dark:text-white">{template.rating}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-500">rating</p>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-bold text-slate-900 dark:text-white">{template.buildTime}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500">setup time</p>
                                        </div>
                                    </div>

                                    <Link
                                        href="/builder"
                                        className="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-md"
                                    >
                                        Use Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Why Use Templates?</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">The advantages of starting with proven patterns</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {templatesData.benefits.map((benefit, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{benefit.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{benefit.description}</p>
                                    <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
                                        <p className="text-sm text-slate-500 dark:text-slate-500">Metric:</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white">{benefit.stat}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Real-World Use Cases</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">How different users leverage templates</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {templatesData.useCases.map((useCase, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{useCase.title}</h3>
                                        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">{useCase.scenario}</p>
                                    </div>

                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{useCase.example}"</p>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-slate-300 dark:border-slate-700">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Savings:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{useCase.savings}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Time reduction:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{useCase.timeReduction}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Template Features */}
            <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">What's Included in Every Template</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Production-ready features and full customization</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Included Features */}
                        <div className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-8 shadow-lg">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">✅ Included Out-of-the-Box</h3>
                            <ul className="space-y-3">
                                {templatesData.features.included.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                        <Check className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0" strokeWidth={2} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Customizable */}
                        <div className="bg-slate-900 dark:bg-slate-100 border-2 border-slate-800 dark:border-slate-200 rounded-xl p-8 shadow-xl">
                            <h3 className="text-2xl font-bold text-white dark:text-slate-900 mb-6">🎨 Fully Customizable</h3>
                            <ul className="space-y-3">
                                {templatesData.features.customizable.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300 dark:text-slate-700">
                                        <Zap className="w-5 h-5 text-white dark:text-slate-900 shrink-0" strokeWidth={2} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 rounded-3xl p-12 md:p-16 text-center shadow-2xl border-2 border-slate-700 dark:border-slate-300">
                        <h2 className="text-3xl md:text-4xl font-black text-white dark:text-slate-900 mb-6">
                            Start With a Template Today
                        </h2>
                        <p className="text-slate-300 dark:text-slate-600 mb-10 text-xl max-w-2xl mx-auto font-medium">
                            Browse 85+ production-ready templates. Customize in minutes. Deploy immediately.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                            <Link
                                href="/builder"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-black text-lg hover:scale-105 transition-all shadow-lg hover:shadow-2xl"
                            >
                                Browse All Templates
                                <ArrowRight className="w-6 h-6" />
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-black text-lg hover:scale-105 transition-all border-2 border-slate-700 dark:border-slate-400"
                            >
                                Back to Home
                            </Link>
                        </div>

                        <div className="pt-10 border-t border-slate-700 dark:border-slate-300">
                            <p className="text-sm text-slate-400 dark:text-slate-600 font-medium">
                                Free forever • 85+ templates • Updated monthly • Fully customizable
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
