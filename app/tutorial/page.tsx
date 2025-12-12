"use client";

import Link from "next/link";
import { Check, ArrowRight, Home, GraduationCap, PlayCircle, Trophy, Target, Zap, Clock, Users, BarChart3, CheckCircle2, Circle, Star, Award, TrendingUp, Rocket } from "lucide-react";
import { useEffect, useState } from "react";

const tutorialData = {
    title: "Hand-Holding Tutorial: Zero to Deployed App",
    subtitle: "Never Built an App Before? We'll Guide You Through Every Single Step",

    // Tutorial Statistics
    stats: [
        { label: "Completion Rate", value: "94%", subtext: "Of users finish tutorial", change: "+8% vs industry" },
        { label: "Average Time", value: "90min", subtext: "To first deployment", change: "3x faster than docs" },
        { label: "Success Rate", value: "98%", subtext: "Deploy successfully", change: "Industry: 12%" },
        { label: "Total Enrollments", value: "25k+", subtext: "Builders started here", change: "+2k/month" }
    ],

    // Tutorial Modules
    modules: [
        {
            number: 1,
            title: "Platform Introduction",
            duration: "5 mins",
            steps: 4,
            description: "Understand the interface and core concepts",
            topics: [
                "What is AvatarFlow and how does it work?",
                "Understanding flowcharts vs traditional coding",
                "Interface tour: Builder, AI, and Visual modes",
                "Your first look at the dashboard"
            ],
            skillLevel: "Absolute Beginner",
            completionRate: 99
        },
        {
            number: 2,
            title: "Your First Flowchart",
            duration: "15 mins",
            steps: 8,
            description: "Create a simple todo app from scratch",
            topics: [
                "Creating a new project",
                "Adding your first node (User Input)",
                "Connecting nodes to create flow",
                "Adding logic: if/else conditions",
                "Storing data in variables",
                "Displaying results to users",
                "Testing your flowchart",
                "Understanding the preview"
            ],
            skillLevel: "Beginner",
            completionRate: 96
        },
        {
            number: 3,
            title: "Adding a Database",
            duration: "20 mins",
            steps: 10,
            description: "Store and retrieve data with visual database design",
            topics: [
                "Creating your first table (Tasks)",
                "Defining fields: text, number, date",
                "Adding relationships between tables",
                "Creating a 'User' table",
                "Linking Tasks to Users (foreign key)",
                "Visual query builder introduction",
                "CRUD operations: Create, Read, Update, Delete",
                "Testing database operations",
                "Viewing data in real-time",
                "Understanding database preview"
            ],
            skillLevel: "Beginner",
            completionRate: 92
        },
        {
            number: 4,
            title: "Building the UI",
            duration: "25 mins",
            steps: 12,
            description: "Design your app's interface visually",
            topics: [
                "Understanding the Visual Builder",
                "Adding components: buttons, inputs, cards",
                "Styling with the property panel",
                "Responsive design basics",
                "Connecting UI to your flowchart",
                "Button click events",
                "Form submission handling",
                "Displaying database data in lists",
                "Adding navigation between pages",
                "Using pre-built templates",
                "Customizing colors and fonts",
                "Mobile preview testing"
            ],
            skillLevel: "Intermediate",
            completionRate: 89
        },
        {
            number: 5,
            title: "Code Generation & Review",
            duration: "10 mins",
            steps: 6,
            description: "See your visual work transformed into production code",
            topics: [
                "Generating your full-stack code",
                "Understanding the file structure",
                "Frontend code walkthrough (React)",
                "Backend API routes (Next.js)",
                "Database schema review (Prisma)",
                "Making manual code adjustments (optional)"
            ],
            skillLevel: "Intermediate",
            completionRate: 94
        },
        {
            number: 6,
            title: "Deployment to Production",
            duration: "15 mins",
            steps: 7,
            description: "Deploy your app live to the internet",
            topics: [
                "Choosing a hosting provider (Vercel/Netlify)",
                "Connecting your GitHub account",
                "Environment variable setup",
                "One-click deployment process",
                "Custom domain configuration (optional)",
                "Testing your live app",
                "Celebrating your first deployment! 🎉"
            ],
            skillLevel: "Beginner",
            completionRate: 97
        }
    ],

    // Learning Objectives
    learningObjectives: {
        beforeTutorial: [
            "Zero coding knowledge",
            "No understanding of databases",
            "Never deployed an app",
            "Confused by technical jargon",
            "Intimidated by development"
        ],
        afterTutorial: [
            "Built a working full-stack app",
            "Understand database relationships",
            "Deployed app to production",
            "Confident with technical concepts",
            "Ready to build real projects"
        ]
    },

    // Tutorial Features
    features: [
        {
            title: "Interactive Walkthroughs",
            description: "Every step includes visual demonstrations and real-time feedback",
            icon: PlayCircle,
            details: ["Screen recordings", "Highlighted UI elements", "Click-by-click guidance", "Undo/redo support"]
        },
        {
            title: "Progress Tracking",
            description: "See exactly where you are and what's coming next",
            icon: BarChart3,
            details: ["Visual progress bars", "Checkpoints & milestones", "Time estimates", "Achievement badges"]
        },
        {
            title: "Built-in Hints",
            description: "Get help exactly when you need it without searching",
            icon: Target,
            details: ["Context-aware tips", "Common mistake warnings", "Best practice suggestions", "Quick reference cards"]
        },
        {
            title: "Live Practice Environment",
            description: "Learn by doing in a safe, guided sandbox",
            icon: Zap,
            details: ["Pre-configured workspace", "Auto-save progress", "Reset anytime", "No setup required"]
        }
    ],

    // Success Stories
    successStories: [
        {
            name: "Sarah M.",
            role: "First-time Founder",
            timeToComplete: "85 mins",
            quote: "I went from 'What's an API?' to deploying my SaaS MVP in under 2 hours. This tutorial is incredible.",
            appsBuilt: 3,
            previousExperience: "None"
        },
        {
            name: "James K.",
            role: "Marketing Manager",
            timeToComplete: "92 mins",
            quote: "Finally understand how apps work. Built our internal tool without hiring a developer.",
            appsBuilt: 5,
            previousExperience: "Excel macros"
        },
        {
            name: "Maya P.",
            role: "Product Designer",
            timeToComplete: "78 mins",
            quote: "As a designer, I could always envision the product. Now I can actually build it myself.",
            appsBuilt: 7,
            previousExperience: "Figma, no code"
        }
    ],

    // Tutorial Metrics
    metrics: [
        { metric: "Student-to-Deployed Ratio", value: "98%", comparison: "Bootcamps: 12%", improvement: "717%" },
        { metric: "Time to First App", value: "90 minutes", comparison: "Bootcamps: 3 months", improvement: "99.7%" },
        { metric: "Cost Per Student", value: "$0", comparison: "Bootcamps: $12,000", improvement: "100%" },
        { metric: "Completion Rate", value: "94%", comparison: "Online courses: 8%", improvement: "1075%" },
        { metric: "Retention After 30 Days", value: "87%", comparison: "Industry: 25%", improvement: "248%" },
        { metric: "Jobs/Projects Created", value: "14,000+", comparison: "N/A", improvement: "N/A" }
    ],

    // Tutorial Difficulty Curve
    difficultyCurve: [
        { module: "Module 1", difficulty: 1, supportLevel: 10 },
        { module: "Module 2", difficulty: 2, supportLevel: 9 },
        { module: "Module 3", difficulty: 4, supportLevel: 8 },
        { module: "Module 4", difficulty: 5, supportLevel: 7 },
        { module: "Module 5", difficulty: 3, supportLevel: 8 },
        { module: "Module 6", difficulty: 2, supportLevel: 9 }
    ]
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

export default function TutorialPage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const totalDuration = tutorialData.modules.reduce((acc, m) => {
        const mins = parseInt(m.duration);
        return acc + mins;
    }, 0);

    const totalSteps = tutorialData.modules.reduce((acc, m) => acc + m.steps, 0);
    const avgCompletion = Math.round(tutorialData.modules.reduce((acc, m) => acc + m.completionRate, 0) / tutorialData.modules.length);

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
                        Start Tutorial
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="py-20 px-6">
                <div className={`max-w-6xl mx-auto space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-200 dark:bg-slate-800 rounded-full border border-slate-400 dark:border-slate-600 shadow-sm">
                        <GraduationCap className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Interactive Tutorial 2024</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight max-w-5xl">
                        {tutorialData.title}
                    </h1>

                    <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-400 font-medium max-w-4xl">
                        {tutorialData.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            <span className="font-bold">{totalDuration} minutes total</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            <span className="font-bold">{totalSteps} guided steps</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <Trophy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            <span className="font-bold">{avgCompletion}% completion rate</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-6 bg-white dark:bg-slate-900 border-y border-slate-300 dark:border-slate-700">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Tutorial Performance Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tutorialData.stats.map((stat, index) => (
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
                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stat.change}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tutorial Modules */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">6-Module Curriculum</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">From absolute beginner to deployed app in {totalDuration} minutes</p>
                    </div>

                    <div className="space-y-6">
                        {tutorialData.modules.map((module, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                                <div className="space-y-6">
                                    {/* Module Header */}
                                    <div className="flex items-start gap-4">
                                        <div className="shrink-0">
                                            <div className="w-16 h-16 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center border-4 border-slate-300 dark:border-slate-700">
                                                <span className="text-2xl font-black text-white dark:text-slate-900">{module.number}</span>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{module.title}</h3>
                                                <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-full">
                                                    {module.skillLevel}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 mb-3">{module.description}</p>

                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                    <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                    <span className="font-bold">{module.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                    <CheckCircle2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                    <span className="font-bold">{module.steps} steps</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                    <Trophy className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                    <span className="font-bold">{module.completionRate}% complete it</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Topics List */}
                                    <div className="pl-20">
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">What you'll learn:</p>
                                        <ul className="grid md:grid-cols-2 gap-2">
                                            {module.topics.map((topic, j) => (
                                                <li key={j} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                    <Check className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" strokeWidth={2} />
                                                    <span>{topic}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="pl-20">
                                        <div className="flex items-center justify-between text-xs mb-2">
                                            <span className="text-slate-600 dark:text-slate-400">Typical completion rate</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{module.completionRate}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-slate-700 dark:bg-slate-400 transition-all duration-1000 rounded-full"
                                                style={{ width: `${module.completionRate}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Before/After Comparison */}
            <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Your Transformation</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Before vs After completing the tutorial</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Before */}
                        <div className="bg-white dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-600 rounded-2xl p-8 shadow-xl">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Circle className="w-8 h-8 text-slate-500 dark:text-slate-500" strokeWidth={2} />
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Before Tutorial</h3>
                                </div>

                                <ul className="space-y-3">
                                    {tutorialData.learningObjectives.beforeTutorial.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                            <span className="text-slate-500 dark:text-slate-500 font-bold mt-1">✗</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* After */}
                        <div className="bg-slate-900 dark:bg-slate-100 border-2 border-slate-800 dark:border-slate-300 rounded-2xl p-8 shadow-2xl">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-8 h-8 text-white dark:text-slate-900" strokeWidth={2} />
                                    <h3 className="text-2xl font-black text-white dark:text-slate-900">After Tutorial</h3>
                                </div>

                                <ul className="space-y-3">
                                    {tutorialData.learningObjectives.afterTutorial.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-300 dark:text-slate-700">
                                            <Check className="w-5 h-5 text-white dark:text-slate-900 shrink-0 mt-0.5" strokeWidth={3} />
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tutorial Features */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">What Makes This Tutorial Different</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Features designed for absolute beginners</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {tutorialData.features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <div key={i} className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                <Icon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                                        </div>

                                        <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>

                                        <ul className="space-y-2">
                                            {feature.details.map((detail, j) => (
                                                <li key={j} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                    <Check className="w-4 h-4 text-slate-600 dark:text-slate-400" strokeWidth={2} />
                                                    <span>{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Success Stories</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Real people who started with zero experience</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {tutorialData.successStories.map((story, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} className="w-4 h-4 fill-slate-700 text-slate-700 dark:fill-slate-300 dark:text-slate-300" />
                                        ))}
                                    </div>

                                    <p className="text-slate-700 dark:text-slate-300 italic">"{story.quote}"</p>

                                    <div className="pt-4 border-t border-slate-300 dark:border-slate-700 space-y-2">
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{story.name}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{story.role}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <p className="text-slate-600 dark:text-slate-400">Completed in:</p>
                                                <p className="font-bold text-slate-900 dark:text-white">{story.timeToComplete}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-600 dark:text-slate-400">Apps built:</p>
                                                <p className="font-bold text-slate-900 dark:text-white">{story.appsBuilt}</p>
                                            </div>
                                        </div>

                                        <div className="text-xs">
                                            <p className="text-slate-600 dark:text-slate-400">Previous experience:</p>
                                            <p className="font-bold text-slate-900 dark:text-white">{story.previousExperience}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Metrics */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">vs Traditional Learning</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">How we compare to coding bootcamps and online courses</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tutorialData.metrics.map((item, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.metric}</h3>

                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">AvatarFlow:</p>
                                        <p className="text-3xl font-black text-slate-900 dark:text-white">{item.value}</p>
                                    </div>

                                    <div className="pt-3 border-t border-slate-300 dark:border-slate-700 space-y-1">
                                        <p className="text-xs text-slate-500 dark:text-slate-500">{item.comparison}</p>
                                        {item.improvement !== 'N/A' && (
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.improvement} better</p>
                                        )}
                                    </div>
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-200 rounded-full mb-6">
                            <Rocket className="w-5 h-5 text-white dark:text-slate-900" />
                            <span className="text-sm font-bold text-white dark:text-slate-900">100% Free • No Credit Card</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black text-white dark:text-slate-900 mb-6">
                            Ready to Build Your First App?
                        </h2>
                        <p className="text-slate-300 dark:text-slate-600 mb-10 text-xl max-w-2xl mx-auto font-medium">
                            Join 25,000+ absolute beginners who deployed their first app with our hand-holding tutorial.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                            <Link
                                href="/builder"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-black text-lg hover:scale-105 transition-all shadow-lg hover:shadow-2xl"
                            >
                                Start Tutorial Now
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
                            <div className="flex items-center justify-center gap-6 flex-wrap text-sm text-slate-400 dark:text-slate-600 font-medium">
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4" />
                                    <span>94% completion rate</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>90 minutes average</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>25k+ students</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-600">
                                From absolute beginner to deployed app in one sitting
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
