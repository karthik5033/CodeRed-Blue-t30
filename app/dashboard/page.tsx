"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard() {
    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-900">
            <header className="px-6 py-4 border-b bg-white dark:bg-zinc-950 flex items-center justify-between">
                <h1 className="text-xl font-bold">AvatarFlowX Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Welcome, User</span>
                    <Button variant="outline" asChild>
                        <Link href="/">Sign Out</Link>
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Placeholder for future apps */}
                    <div className="border rounded-xl p-6 bg-card text-card-foreground shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">My Todo App</h3>
                        <p className="text-sm text-muted-foreground mb-4">A simple task manager.</p>
                        <Button className="w-full">Open App</Button>
                    </div>

                    <div className="border rounded-xl p-6 bg-card text-card-foreground shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">Create New App</h3>
                        <p className="text-sm text-muted-foreground mb-4">Build something new with AI.</p>
                        <Button variant="secondary" className="w-full">Generate</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
