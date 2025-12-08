// components/login/LoginForm.tsx
"use client";
import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginForm() {
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form className="bg-card m-auto w-full max-w-sm rounded-xl border shadow-md p-0.5">
        <div className="p-8 pb-6">
          <Link href="/" aria-label="go home">
            <LogoIcon />
          </Link>

          <h1 className="mb-1 mt-4 text-xl font-semibold">
            Sign In to AvatarFlowX
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Log in to continue
          </p>

          {/* Social Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" type="button">
              Google
            </Button>
            <Button variant="outline" type="button">
              Microsoft
            </Button>
          </div>

          <hr className="my-4 border-dashed" />

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Username</Label>
            <Input id="email" required type="email" />
          </div>

          {/* Password */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" size="sm" asChild>
                <Link href="#">Forgot password?</Link>
              </Button>
            </div>
            <Input id="password" type="password" required />
          </div>

          <Button className="w-full mt-6">Sign In</Button>
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted rounded-b-xl text-center">
          <p className="text-sm">
            Don’t have an account?{" "}
            <Button asChild variant="link" size="sm" className="px-1">
              <Link href="/signup">Create one</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
