"use client";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { useScroll, motion } from "motion/react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how" },
  { name: "Editor", href: "#editor" },
  { name: "Docs", href: "#docs" },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const unsub = scrollYProgress.on("change", (val) => {
      setScrolled(val > 0.05);
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed top-0 z-40 w-full pt-2 transition-all"
      >
        <div
          className={cn(
            "mx-auto max-w-7xl rounded-3xl px-6 lg:px-12 transition-all duration-300",
            // Always glass on hero, slightly stronger when scrolled
            "bg-black/20 backdrop-blur-xl border border-white/10",
            scrolled && "bg-black/40 border-white/20"
          )}
        >
          <motion.div
            className={cn(
              "relative flex flex-wrap items-center justify-between gap-6 py-4 lg:py-5 lg:gap-0 transition-all",
              scrolled && "py-3"
            )}
          >
            {/* Left: logo + mobile */}
            <div className="flex w-full items-center justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo className="h-7 w-auto" />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="size-6 transition-all data-[state=active]:scale-0 data-[state=active]:opacity-0" />
                <X className="absolute inset-0 size-6 scale-0 opacity-0 transition-all data-[state=active]:scale-100 data-[state=active]:opacity-100" />
              </button>

              {/* Desktop Menu */}
              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, i) => (
                    <li key={i}>
                      <Link
                        href={item.href}
                        className="text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] hover:text-white transition"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mobile dropdown + right buttons */}
            <div
              className="hidden w-full flex-wrap justify-end rounded-3xl p-6 shadow-xl shadow-black/10
                         lg:flex lg:w-fit lg:p-0 lg:shadow-none
                         bg-black/30 backdrop-blur-xl border border-white/10
                         data-[state=active]:block"
            >
              {/* Mobile menu */}
              <div className="lg:hidden w-full mb-6">
                <ul className="space-y-6 text-lg">
                  {menuItems.map((item, i) => (
                    <li key={i}>
                      <Link
                        href={item.href}
                        className="text-white/90 hover:text-white transition drop-shadow"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:space-y-0 sm:gap-3 lg:w-fit">
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="bg-white text-black font-medium hover:bg-neutral-200 shadow"
                >
                  <Link href="/login">Login</Link>
                </Button>

                <Button
                  asChild
                  size="sm"
                  className="bg-black/80 text-white font-medium hover:bg-black shadow-lg"
                >
                  <Link href="/flow">Launch Editor</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </nav>
    </header>
  );
};
