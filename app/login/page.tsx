// components/login/LoginForm.tsx
"use client";
import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form onSubmit={onSubmit} className="bg-card m-auto w-full max-w-sm rounded-xl border shadow-md p-0.5">
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
            <Input id="email" required type="email" disabled={isLoading} />
          </div>

          {/* Password */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" size="sm" asChild>
                <Link href="#">Forgot password?</Link>
              </Button>
            </div>
            <Input id="password" type="password" required disabled={isLoading} />
          </div>

          {error && (
            <div className="mt-4 p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <Button className="w-full mt-6" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
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
