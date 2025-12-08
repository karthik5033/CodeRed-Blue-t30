"use client";

import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignupForm() {
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form className="bg-card m-auto w-full max-w-sm rounded-xl border shadow-md p-0.5">
        <div className="p-8 pb-6">
          {/* Logo */}
          <Link href="/" aria-label="home">
            <LogoIcon />
          </Link>

          <h1 className="mb-1 mt-4 text-xl font-semibold">
            Create Your AvatarFlowX Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Start building apps visually — in seconds.
          </p>

          {/* Social Signup */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button type="button" variant="outline">
              Google
            </Button>
            <Button type="button" variant="outline">
              Microsoft
            </Button>
          </div>

          <hr className="my-4 border-dashed" />

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" required />
          </div>

          {/* Email */}
          <div className="mt-4 space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>

          {/* Password */}
          <div className="mt-4 space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>

          {/* Confirm Password */}
          <div className="mt-4 space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" type="password" required />
          </div>

          {/* Submit */}
          <Button className="w-full mt-6">Create Account</Button>
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted rounded-b-xl text-center">
          <p className="text-sm">
            Already have an account?
            <Button asChild variant="link" size="sm" className="px-1">
              <Link href="/login">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
