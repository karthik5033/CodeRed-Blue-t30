"use client";

import Link from "next/link";
import { Check, ArrowRight, Home, GitBranch, Code2, Database, Globe, Server, Layers, FileCode, Package, Shield, Zap, TrendingUp, Award, CheckCircle2, Terminal, Rocket } from "lucide-react";
import { useEffect, useState } from "react";

const codeGenerationData = {
    title: "Flowchart to Production Code: The Magic Explained",
    subtitle: "From Visual Logic to Deployment-Ready Full-Stack Application",

    // Generation Statistics
    stats: [
        { label: "Code Quality Score", value: "98%", subtext: "Industry standard", change: "vs 94% hand-written" },
        { label: "Generation Speed", value: "< 10s", subtext: "Full-stack app", change: "vs 400+ hours manual" },
        { label: "Lines Generated", value: "12k+", subtext: "Average per app", change: "Production-ready" },
        { label: "Zero Bugs", value: "100%", subtext: "Clean generation", change: "Pre-tested patterns" }
    ],

    // Tech Stack Generated
    techStack: {
        frontend: {
            title: "Frontend",
            icon: Globe,
            technologies: [
                { name: "React 18", purpose: "UI framework", linesOfCode: 3500 },
                { name: "TypeScript", purpose: "Type safety", linesOfCode: 0 },
                { name: "Tailwind CSS", purpose: "Styling system", linesOfCode: 800 },
                { name: "React Hook Form", purpose: "Form handling", linesOfCode: 400 },
                { name: "Zustand/Redux", purpose: "State management", linesOfCode: 600 }
            ],
            features: ["Responsive design", "Dark mode ready", "Accessibility (WCAG)", "SEO optimized", "Progressive Web App"]
        },
        backend: {
            title: "Backend",
            icon: Server,
            technologies: [
                { name: "Next.js 14", purpose: "API routes", linesOfCode: 2800 },
                { name: "Node.js", purpose: "Runtime", linesOfCode: 0 },
                { name: "Authentication", purpose: "NextAuth/JWT", linesOfCode: 900 },
                { name: "File Upload", purpose: "AWS S3/Cloudinary", linesOfCode: 500 },
                { name: "Email Service", purpose: "SendGrid/Resend", linesOfCode: 300 }
            ],
            features: ["RESTful APIs", "Authentication & authorization", "Rate limiting", "Error handling", "Logging system"]
        },
        database: {
            title: "Database",
            icon: Database,
            technologies: [
                { name: "Prisma ORM", purpose: "Database toolkit", linesOfCode: 1200 },
                { name: "PostgreSQL", purpose: "Primary database", linesOfCode: 0 },
                { name: "Migrations", purpose: "Schema versioning", linesOfCode: 400 },
                { name: "Seed Data", purpose: "Test data", linesOfCode: 200 },
                { name: "Connection Pool", purpose: "Performance", linesOfCode: 150 }
            ],
            features: ["Optimized queries", "Indexes on foreign keys", "Transaction support", "Cascade deletes", "Data validation"]
        },
        infrastructure: {
            title: "Infrastructure",
            icon: Rocket,
            technologies: [
                { name: "Docker", purpose: "Containerization", linesOfCode: 300 },
                { name: "Environment Config", purpose: "Multi-env support", linesOfCode: 150 },
                { name: "CI/CD Pipeline", purpose: "GitHub Actions", linesOfCode: 400 },
                { name: "Testing Setup", purpose: "Jest/Vitest", linesOfCode: 800 },
                { name: "Monitoring", purpose: "Error tracking", linesOfCode: 250 }
            ],
            features: ["One-click deployment", "Auto-scaling ready", "Environment variables", "Health checks", "Rollback support"]
        }
    },

    // Code Quality Metrics
    qualityMetrics: [
        { metric: "Type Safety", score: "100%", description: "Full TypeScript coverage", standard: "Industry: 60%" },
        { metric: "Code Coverage", score: "95%", description: "Unit & integration tests", standard: "Industry: 40%" },
        { metric: "Performance Score", score: "98/100", description: "Lighthouse audit", standard: "Industry: 75/100" },
        { metric: "Security Rating", score: "A+", description: "OWASP compliance", standard: "Industry: B" },
        { metric: "Maintainability", score: "A", description: "CodeClimate analysis", standard: "Industry: C" },
        { metric: "Documentation", score: "100%", description: "All functions documented", standard: "Industry: 20%" }
    ],

    // Code Generation Process
    generationProcess: [
        {
            step: 1,
            title: "Flowchart Analysis",
            duration: "< 1s",
            description: "Parse visual logic and business rules",
            outputs: ["Abstract syntax tree", "Dependency graph", "Data flow mapping"]
        },
        {
            step: 2,
            title: "Architecture Design",
            duration: "< 2s",
            description: "Design optimal file structure and component hierarchy",
            outputs: ["Component tree", "API endpoint mapping", "Database schema"]
        },
        {
            step: 3,
            title: "Code Generation",
            duration: "< 5s",
            description: "Generate production-ready code across all layers",
            outputs: ["React components", "API routes", "Database models", "Type definitions"]
        },
        {
            step: 4,
            title: "Optimization",
            duration: "< 2s",
            description: "Apply performance optimizations and best practices",
            outputs: ["Code splitting", "Lazy loading", "Caching strategies", "Database indexes"]
        },
        {
            step: 5,
            title: "Quality Assurance",
            duration: "< 1s",
            description: "Validate code quality and run automated tests",
            outputs: ["Type checking", "Linting passes", "Unit tests", "Integration tests"]
        }
    ],

    // File Structure Generated
    fileStructure: {
        totalFiles: 87,
        totalDirectories: 24,
        structure: [
            { path: "/app", files: 15, description: "Next.js pages and layouts" },
            { path: "/components", files: 28, description: "Reusable React components" },
            { path: "/lib", files: 12, description: "Utility functions and helpers" },
            { path: "/prisma", files: 4, description: "Database schema and migrations" },
            { path: "/api", files: 18, description: "API routes and endpoints" },
            { path: "/types", files: 8, description: "TypeScript type definitions" },
            { path: "/public", files: 2, description: "Static assets" }
        ]
    },

    // Features Generated
    featuresGenerated: [
        {
            category: "Authentication",
            features: ["User registration", "Login/logout", "Password reset", "Email verification", "Social OAuth", "Session management"],
            complexity: "Advanced"
        },
        {
            category: "Authorization",
            features: ["Role-based access", "Permission system", "Protected routes", "API guards", "Row-level security"],
            complexity: "Advanced"
        },
        {
            category: "CRUD Operations",
            features: ["Create records", "Read with pagination", "Update records", "Delete with cascade", "Bulk operations", "Search & filter"],
            complexity: "Medium"
        },
        {
            category: "File Management",
            features: ["Upload to cloud", "Image optimization", "File validation", "Storage management", "CDN delivery"],
            complexity: "Medium"
        },
        {
            category: "Real-time Features",
            features: ["WebSocket setup", "Live notifications", "Real-time updates", "Presence indicators", "Chat functionality"],
            complexity: "Advanced"
        },
        {
            category: "Payment Integration",
            features: ["Stripe setup", "Subscription billing", "Invoice generation", "Webhook handling", "Payment history"],
            complexity: "Advanced"
        }
    ],

    // Comparison with Manual Coding
    comparison: {
        metrics: [
            { aspect: "Development Time", manual: "400+ hours", generated: "< 10 seconds", improvement: "99.999%" },
            { aspect: "Code Quality", manual: "Variable (60-90%)", generated: "Consistent (98%)", improvement: "Standardized" },
            { aspect: "Bugs on Deploy", manual: "15-30 bugs", generated: "0 bugs", improvement: "100%" },
            { aspect: "Best Practices", manual: "Hit or miss", generated: "100% coverage", improvement: "Guaranteed" },
            { aspect: "Documentation", manual: "20% documented", generated: "100% documented", improvement: "400%" },
            { aspect: "Testing Coverage", manual: "40% average", generated: "95% average", improvement: "137%" }
        ]
    },

    // Production-Ready Checklist
    productionChecklist: [
        { item: "Environment Configuration", included: true, effort: "Auto-configured" },
        { item: "Database Migrations", included: true, effort: "Pre-generated" },
        { item: "Error Handling", included: true, effort: "Built-in" },
        { item: "Logging System", included: true, effort: "Configured" },
        { item: "Security Headers", included: true, effort: "Set by default" },
        { item: "CORS Configuration", included: true, effort: "Handled" },
        { item: "Rate Limiting", included: true, effort: "Implemented" },
        { item: "Input Validation", included: true, effort: "All endpoints" },
        { item: "SQL Injection Prevention", included: true, effort: "ORM-protected" },
        { item: "XSS Protection", included: true, effort: "Sanitized" },
        { item: "CSRF Protection", included: true, effort: "Token-based" },
        { item: "Performance Monitoring", included: true, effort: "Integrated" }
    ],

    // Technology Choices
    whyThisStack: [
        {
            choice: "Next.js 14",
            reason: "Best-in-class React framework with built-in optimizations",
            benefits: ["Server-side rendering", "API routes", "File-based routing", "Image optimization", "Font optimization"]
        },
        {
            choice: "TypeScript",
            reason: "Catch errors before runtime with type safety",
            benefits: ["IntelliSense", "Refactoring safety", "Self-documenting", "Enterprise-grade", "Better DX"]
        },
        {
            choice: "Prisma ORM",
            reason: "Type-safe database access with excellent dev experience",
            benefits: ["Auto-completion", "Migration system", "Visual schema", "Multi-database", "Built-in types"]
        },
        {
            choice: "Tailwind CSS",
            reason: "Utility-first CSS for rapid UI development",
            benefits: ["Small bundle size", "Consistent design", "Responsive utilities", "Dark mode", "JIT compiler"]
        }
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

export default function CodeGenerationPage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const totalLinesOfCode = Object.values(codeGenerationData.techStack).reduce((acc, stack) => {
        return acc + stack.technologies.reduce((sum, tech) => sum + tech.linesOfCode, 0);
    }, 0);

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
                        Try Code Generation
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="py-20 px-6">
                <div className={`max-w-6xl mx-auto space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-200 dark:bg-slate-800 rounded-full border border-slate-400 dark:border-slate-600 shadow-sm">
                        <Code2 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Code Generation Engine 2024</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight max-w-5xl">
                        {codeGenerationData.title}
                    </h1>

                    <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-400 font-medium max-w-4xl">
                        {codeGenerationData.subtitle}
                    </p>

                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 pt-4">
                        <Terminal className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <span className="font-bold"><AnimatedCounter end={totalLinesOfCode} duration={2000} /> lines of production-ready code generated automatically</span>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-6 bg-white dark:bg-slate-900 border-y border-slate-300 dark:border-slate-700">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Code Generation Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {codeGenerationData.stats.map((stat, index) => (
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

            {/* Tech Stack Generated */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Complete Tech Stack Generated</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Every layer of your application, automatically</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {Object.entries(codeGenerationData.techStack).map(([key, stack], i) => {
                            const Icon = stack.icon;
                            const totalLines = stack.technologies.reduce((sum, tech) => sum + tech.linesOfCode, 0);

                            return (
                                <div key={i} className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                <Icon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stack.title}</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{totalLines.toLocaleString()} lines generated</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {stack.technologies.map((tech, j) => (
                                                <div key={j} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">{tech.name}</p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">{tech.purpose}</p>
                                                    </div>
                                                    {tech.linesOfCode > 0 && (
                                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{tech.linesOfCode} LOC</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Features:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {stack.features.map((feature, k) => (
                                                    <span key={k} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded">
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Generation Process */}
            <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">5-Step Generation Process</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Completed in under 10 seconds</p>
                    </div>

                    <div className="space-y-4">
                        {codeGenerationData.generationProcess.map((step, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-lg">
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
                                            <span className="text-xl font-black text-white dark:text-slate-900">{step.step}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
                                            <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-full">
                                                {step.duration}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 mb-3">{step.description}</p>

                                        <div className="flex flex-wrap gap-2">
                                            {step.outputs.map((output, j) => (
                                                <span key={j} className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    {output}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quality Metrics */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Code Quality Metrics</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Industry-leading standards across all measures</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {codeGenerationData.qualityMetrics.map((metric, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{metric.metric}</h3>
                                    <p className="text-4xl font-black text-slate-900 dark:text-white">{metric.score}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{metric.description}</p>
                                    <div className="pt-3 border-t border-slate-300 dark:border-slate-700">
                                        <p className="text-xs text-slate-500 dark:text-slate-500">{metric.standard}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Generated */}
            <section className="py-20 px-6 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Advanced Features Generated</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Enterprise-grade functionality out of the box</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {codeGenerationData.featuresGenerated.map((category, i) => (
                            <div key={i} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-850 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-lg">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{category.category}</h3>
                                        <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded">
                                            {category.complexity}
                                        </span>
                                    </div>

                                    <ul className="space-y-2">
                                        {category.features.map((feature, j) => (
                                            <li key={j} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                <Check className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" strokeWidth={2} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">vs Manual Coding</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Why generation beats hand-writing code</p>
                    </div>

                    <div className="space-y-4">
                        {codeGenerationData.comparison.metrics.map((item, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-6 shadow-lg">
                                <div className="grid md:grid-cols-4 gap-4 items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.aspect}</h3>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Manual:</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-300">{item.manual}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Generated:</p>
                                        <p className="font-bold text-slate-900 dark:text-white">{item.generated}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block px-3 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold rounded-full">
                                            {item.improvement}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Production Checklist */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Production-Ready Checklist</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Everything you need to deploy with confidence</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {codeGenerationData.productionChecklist.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-lg shadow-md">
                                <div className="flex items-center gap-3 flex-1">
                                    <CheckCircle2 className="w-5 h-5 text-slate-700 dark:text-slate-300 shrink-0" strokeWidth={2} />
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{item.item}</span>
                                </div>
                                <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                                    {item.effort}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why This Stack */}
            <section className="py-20 px-6 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Why These Technologies?</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Carefully chosen for performance, developer experience, and scalability</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {codeGenerationData.whyThisStack.map((tech, i) => (
                            <div key={i} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-850 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-8 shadow-lg">
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{tech.choice}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{tech.reason}</p>

                                    <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Key Benefits:</p>
                                        <ul className="space-y-2">
                                            {tech.benefits.map((benefit, j) => (
                                                <li key={j} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                    <Award className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
                                                    <span>{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
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
                        <h2 className="text-3xl md:text-4xl font-black text-white dark:text-slate-900 mb-6">
                            Experience the Magic of Code Generation
                        </h2>
                        <p className="text-slate-300 dark:text-slate-600 mb-10 text-xl max-w-2xl mx-auto font-medium">
                            Create a flowchart, click generate, and watch 12,000+ lines of production-ready code appear in under 10 seconds.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                            <Link
                                href="/builder"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-black text-lg hover:scale-105 transition-all shadow-lg hover:shadow-2xl"
                            >
                                Generate Code Now
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
                                98% code quality • 100% type-safe • Zero bugs • Production-ready
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
