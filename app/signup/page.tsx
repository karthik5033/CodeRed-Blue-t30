"use client";

import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string; // We need to match the input IDs
    // The default Input components don't have name props in the original code, we need to ensure they are picked up.
    // Or simpler, just access by ID if they don't have name props, but FormData is better.
    // Wait, the previous code didn't have 'name' attributes on Inputs. 
    // I should fix that in the replace_content or just use event.target elements.
    // Let's assume I'll add 'name' attributes in the replace_content above or here.
    // Actually, the replace_content above preserved 'id' but didn't add 'name'.
    // Let's use simple ID access or state for reliability given the partial edits.

    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const confirm = (document.getElementById('confirm') as HTMLInputElement).value;
    const fullName = (document.getElementById('name') as HTMLInputElement).value;

    if (password !== confirm) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: fullName }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Something went wrong");
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
            <Input id="name" required disabled={isLoading} />
          </div>

          {/* Email */}
          <div className="mt-4 space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required disabled={isLoading} />
          </div>

          {/* Password */}
          <div className="mt-4 space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required disabled={isLoading} />
          </div>

          {/* Confirm Password */}
          <div className="mt-4 space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" type="password" required disabled={isLoading} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button className="w-full mt-6" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
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
