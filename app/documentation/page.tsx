"use client";

import Link from "next/link";
import { Check, ArrowRight, Home, BookOpen, PlayCircle, FileText, Code, Layers, Database, MonitorPlay, Zap, Users, Clock, TrendingUp, Award } from "lucide-react";
import { useEffect, useState } from "react";

const documentationData = {
    title: "Complete Documentation & Learning Resources",
    subtitle: "Everything You Need to Go From Idea to Deployed App",

    // Learning Statistics
    learningStats: [
        { label: "Total Resources", value: "150+", subtext: "Guides & tutorials", growth: "+40/month" },
        { label: "Video Content", value: "50hrs", subtext: "Step-by-step videos", growth: "12hrs/month" },
        { label: "Code Examples", value: "200+", subtext: "Working templates", growth: "+25/month" },
        { label: "Avg Learning Time", value: "2-4hrs", subtext: "To first deployment", growth: "-50% YoY" }
    ],

    // Documentation Sections
    sections: [
        {
            title: "Getting Started",
            icon: Zap,
            resources: 25,
            timeToComplete: "30 mins",
            topics: [
                "Platform overview and key concepts",
                "Creating your first flowchart",
                "Understanding the visual builder",
                "Exporting and deploying code",
                "Common workflows and patterns"
            ],
            formats: { guides: 8, videos: 5, examples: 12 }
        },
        {
            title: "Flowchart Builder",
            icon: Layers,
            resources: 35,
            timeToComplete: "2 hours",
            topics: [
                "Creating complex business logic flows",
                "Conditional branching and loops",
                "Data flow and state management",
                "API integration patterns",
                "Error handling best practices"
            ],
            formats: { guides: 12, videos: 8, examples: 15 }
        },
        {
            title: "AI Builder",
            icon: PlayCircle,
            resources: 30,
            timeToComplete: "1.5 hours",
            topics: [
                "Natural language to app conversion",
                "Using AI for architecture design",
                "Iterating on AI-generated code",
                "Customizing AI output",
                "Best prompting practices"
            ],
            formats: { guides: 10, videos: 7, examples: 13 }
        },
        {
            title: "Database Design",
            icon: Database,
            resources: 28,
            timeToComplete: "2 hours",
            topics: [
                "Visual schema creation",
                "Relationships and foreign keys",
                "Indexing strategies",
                "Migration management",
                "Data seeding and testing"
            ],
            formats: { guides: 10, videos: 6, examples: 12 }
        },
        {
            title: "Code Generation",
            icon: Code,
            resources: 32,
            timeToComplete: "1 hour",
            topics: [
                "Understanding generated code structure",
                "Frontend component architecture",
                "Backend API patterns",
                "Authentication implementation",
                "Customizing generated output"
            ],
            formats: { guides: 11, videos: 7, examples: 14 }
        },
        {
            title: "Deployment & Hosting",
            icon: MonitorPlay,
            resources: 20,
            timeToComplete: "45 mins",
            topics: [
                "Deployment options overview",
                "Vercel deployment guide",
                "Docker containerization",
                "Environment variables",
                "Production best practices"
            ],
            formats: { guides: 7, videos: 4, examples: 9 }
        }
    ],

    // Learning Paths
    learningPaths: [
        {
            path: "Complete Beginner",
            duration: "4-6 hours",
            steps: 12,
            description: "Never built an app? Start here with zero assumptions",
            milestones: [
                "Understand flowchart basics",
                "Create first simple app",
                "Deploy to production",
                "Add database functionality"
            ]
        },
        {
            path: "Technical Founder",
            duration: "2-3 hours",
            steps: 8,
            description: "You know code but want faster iteration",
            milestones: [
                "Advanced flowchart patterns",
                "Custom code integration",
                "Optimize generated output",
                "Scale to production"
            ]
        },
        {
            path: "Agency/Freelancer",
            duration: "3-4 hours",
            steps: 10,
            description: "Build client projects efficiently",
            milestones: [
                "Template creation workflow",
                "Client handoff process",
                "Multi-project management",
                "White-label deployment"
            ]
        }
    ],

    // Resource Formats
    formatBreakdown: {
        written: { count: 85, percentage: 57, avgLength: "8 mins read" },
        video: { count: 37, percentage: 25, avgLength: "12 mins watch" },
        interactive: { count: 28, percentage: 18, avgLength: "15 mins practice" }
    },

    // Support Options
    supportOptions: [
        {
            type: "Documentation",
            availability: "24/7",
            responseTime: "Instant",
            features: ["Searchable guides", "Code examples", "Video tutorials", "Interactive demos"],
            recommended: true
        },
        {
            type: "Community Discord",
            availability: "24/7",
            responseTime: "< 30 mins",
            features: ["Peer support", "Share projects", "Weekly office hours", "Expert Q&A"],
            recommended: true
        },
        {
            type: "Email Support",
            availability: "Mon-Fri",
            responseTime: "< 24 hours",
            features: ["Technical issues", "Bug reports", "Feature requests", "Account help"],
            recommended: false
        },
        {
            type: "Premium Support",
            availability: "24/7",
            responseTime: "< 2 hours",
            features: ["Priority assistance", "Dedicated channel", "Architecture review", "Custom training"],
            recommended: false
        }
    ],

    // Success Metrics
    successMetrics: [
        { metric: "First Deployment", avgTime: "1.5 hours", benchmark: "Industry: 40 hours", improvement: "96%" },
        { metric: "Concept to MVP", avgTime: "3 days", benchmark: "Industry: 3 months", improvement: "97%" },
        { metric: "Documentation Usage", avgTime: "45 mins/week", benchmark: "Industry: 8 hours/week", improvement: "91%" },
        { metric: "Learning Curve", avgTime: "2-4 hours", benchmark: "Industry: 200+ hours", improvement: "98%" }
    ],

    // Popular Resources
    popularResources: [
        { title: "Your First App in 30 Minutes", type: "Video", views: "12.5k", rating: 4.9 },
        { title: "E-commerce Flowchart Template", type: "Example", downloads: "8.2k", rating: 4.8 },
        { title: "Database Design Best Practices", type: "Guide", reads: "15.3k", rating: 4.7 },
        { title: "Authentication Implementation", type: "Video", views: "9.8k", rating: 4.9 },
        { title: "API Integration Patterns", type: "Guide", reads: "11.2k", rating: 4.8 },
        { title: "SaaS App Complete Walkthrough", type: "Video", views: "14.1k", rating: 5.0 }
    ]
};

// Animated Counter (same as pricing page)
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

export default function DocumentationPage() {
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
                        <BookOpen className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Complete Learning Hub 2024</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight max-w-5xl">
                        {documentationData.title}
                    </h1>

                    <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-400 font-medium max-w-4xl">
                        {documentationData.subtitle}
                    </p>
                </div>
            </section>

            {/* Learning Stats */}
            <section className="py-16 px-6 bg-white dark:bg-slate-900 border-y border-slate-300 dark:border-slate-700">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Learning Resources Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {documentationData.learningStats.map((stat, index) => (
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

            {/* Documentation Sections */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Documentation Sections</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Comprehensive coverage of every feature and workflow</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documentationData.sections.map((section, i) => {
                            const Icon = section.icon;
                            return (
                                <div key={i} className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                <Icon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{section.resources} resources</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="w-4 h-4 text-slate-500 dark:text-slate-500" />
                                            <span className="text-slate-600 dark:text-slate-400">{section.timeToComplete} to complete</span>
                                        </div>

                                        <ul className="space-y-2">
                                            {section.topics.map((topic, j) => (
                                                <li key={j} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                    <Check className="w-4 h-4 text-slate-500 dark:text-slate-500 shrink-0 mt-0.5" strokeWidth={2} />
                                                    <span>{topic}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
                                            <div className="flex gap-4 text-xs">
                                                <div>
                                                    <span className="text-slate-600 dark:text-slate-400">Guides:</span>
                                                    <span className="ml-1 font-bold text-slate-900 dark:text-white">{section.formats.guides}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 dark:text-slate-400">Videos:</span>
                                                    <span className="ml-1 font-bold text-slate-900 dark:text-white">{section.formats.videos}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 dark:text-slate-400">Examples:</span>
                                                    <span className="ml-1 font-bold text-slate-900 dark:text-white">{section.formats.examples}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Learning Paths */}
            <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Personalized Learning Paths</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Choose your journey based on your experience level</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {documentationData.learningPaths.map((path, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{path.path}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{path.description}</p>
                                    </div>

                                    <div className="flex gap-6 text-sm">
                                        <div>
                                            <p className="text-slate-600 dark:text-slate-400">Duration</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{path.duration}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-600 dark:text-slate-400">Steps</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{path.steps}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t-2 border-slate-300 dark:border-slate-700">
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Key Milestones:</p>
                                        <ul className="space-y-2">
                                            {path.milestones.map((milestone, j) => (
                                                <li key={j} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                    <Award className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                                                    <span>{milestone}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Link
                                        href="/docs"
                                        className="block w-full py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-bold text-center hover:bg-slate-800 dark:hover:bg-slate-200 transition-all"
                                    >
                                        Start This Path
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Format Breakdown */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Resource Format Distribution</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Learn your way — written guides, videos, or interactive demos</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {Object.entries(documentationData.formatBreakdown).map(([format, data], i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-8 shadow-lg">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{format}</h3>
                                        {format === 'written' && <FileText className="w-6 h-6 text-slate-600 dark:text-slate-400" />}
                                        {format === 'video' && <PlayCircle className="w-6 h-6 text-slate-600 dark:text-slate-400" />}
                                        {format === 'interactive' && <Code className="w-6 h-6 text-slate-600 dark:text-slate-400" />}
                                    </div>

                                    <div>
                                        <p className="text-5xl font-black text-slate-900 dark:text-white">{data.count}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">resources</p>
                                    </div>

                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-slate-700 dark:bg-slate-400 transition-all duration-1000 rounded-full"
                                            style={{ width: `${data.percentage}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">{data.percentage}% of total</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{data.avgLength}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Metrics */}
            <section className="py-20 px-6 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Learning Success Metrics</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">How our documentation accelerates your journey</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {documentationData.successMetrics.map((item, i) => (
                            <div key={i} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-850 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.metric}</h3>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">AvatarFlow:</p>
                                        <p className="text-3xl font-black text-slate-900 dark:text-white">{item.avgTime}</p>
                                    </div>
                                    <div className="pt-2 border-t border-slate-300 dark:border-slate-700">
                                        <p className="text-xs text-slate-500 dark:text-slate-500">{item.benchmark}</p>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{item.improvement} improvement</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Resources */}
            <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Most Popular Resources</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Top-rated content from our community</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documentationData.popularResources.map((resource, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex-1">{resource.title}</h3>
                                        <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded">
                                            {resource.type}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1">
                                            {resource.type === 'Video' ? (
                                                <>
                                                    <PlayCircle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                    <span className="text-slate-600 dark:text-slate-400">{resource.views} views</span>
                                                </>
                                            ) : resource.type === 'Example' ? (
                                                <>
                                                    <Code className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                    <span className="text-slate-600 dark:text-slate-400">{resource.downloads} downloads</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                    <span className="text-slate-600 dark:text-slate-400">{resource.reads} reads</span>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">{resource.rating}</span>
                                            <span className="text-slate-600 dark:text-slate-400">★</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Support Options */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Support & Community</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Get help when you need it</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {documentationData.supportOptions.map((option, i) => (
                            <div
                                key={i}
                                className={`rounded-2xl p-6 shadow-lg border-2 transition-all hover:scale-105 ${option.recommended
                                        ? 'bg-slate-900 dark:bg-slate-100 border-slate-800 dark:border-slate-200 ring-2 ring-slate-700 dark:ring-slate-300'
                                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                                    }`}
                            >
                                <div className="space-y-4">
                                    {option.recommended && (
                                        <span className="inline-block px-2 py-1 bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900 text-xs font-bold rounded uppercase">
                                            Recommended
                                        </span>
                                    )}

                                    <div>
                                        <h3 className={`text-xl font-bold mb-2 ${option.recommended ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>
                                            {option.type}
                                        </h3>
                                        <div className="space-y-1 text-sm">
                                            <p className={option.recommended ? 'text-slate-400 dark:text-slate-600' : 'text-slate-600 dark:text-slate-400'}>
                                                {option.availability}
                                            </p>
                                            <p className={`font-bold ${option.recommended ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>
                                                Response: {option.responseTime}
                                            </p>
                                        </div>
                                    </div>

                                    <ul className="space-y-2">
                                        {option.features.map((feature, j) => (
                                            <li key={j} className="flex items-center gap-2 text-sm">
                                                <Check className={`w-4 h-4 shrink-0 ${option.recommended ? 'text-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-400'}`} strokeWidth={2} />
                                                <span className={option.recommended ? 'text-slate-300 dark:text-slate-700' : 'text-slate-700 dark:text-slate-300'}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 rounded-3xl p-12 md:p-16 text-center shadow-2xl border-2 border-slate-700 dark:border-slate-300">
                        <h2 className="text-3xl md:text-4xl font-black text-white dark:text-slate-900 mb-6">
                            Ready to Start Learning?
                        </h2>
                        <p className="text-slate-300 dark:text-slate-600 mb-10 text-xl max-w-2xl mx-auto font-medium">
                            Access 150+ resources, 50 hours of video content, and join our community of 10,000+ builders.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                            <Link
                                href="/docs"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-black text-lg hover:scale-105 transition-all shadow-lg hover:shadow-2xl"
                            >
                                Browse Documentation
                                <BookOpen className="w-6 h-6" />
                            </Link>
                            <Link
                                href="/builder"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-black text-lg hover:scale-105 transition-all border-2 border-slate-700 dark:border-slate-400"
                            >
                                Start Building
                                <ArrowRight className="w-6 h-6" />
                            </Link>
                        </div>

                        <div className="pt-10 border-t border-slate-700 dark:border-slate-300">
                            <p className="text-sm text-slate-400 dark:text-slate-600 font-medium">
                                100% free forever • New content added weekly • Community-driven
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
