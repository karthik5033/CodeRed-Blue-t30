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
            "bg-black/20 backdrop-blur-xl border border-white/10",
            scrolled && "bg-black/40 border-white/20"
          )}
        >
          <motion.div
            className={cn(
              "flex items-center justify-between py-4 lg:py-5 transition-all",
              scrolled && "py-3"
            )}
          >
            {/* LEFT: Logo + Menu */}
            <div className="flex items-center gap-10 flex-none">
              <Link href="/" aria-label="home" className="flex items-center">
                <Logo className="h-7 w-auto" />
              </Link>

              {/* Desktop Menu */}
              <ul className="hidden lg:flex gap-8 text-sm whitespace-nowrap">
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

            {/* RIGHT: Buttons (desktop) */}
            <div className="hidden lg:flex items-center gap-4 flex-none">
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="bg-white text-black hover:bg-neutral-200 shadow"
              >
                <Link href="/login">Login</Link>
              </Button>

              <Button
                asChild
                size="sm"
                className="bg-black/80 text-white hover:bg-black shadow-lg"
              >
                <Link href="/flow">Launch Editor</Link>
              </Button>
            </div>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMenuState(!menuState)}
              aria-label={menuState ? "Close Menu" : "Open Menu"}
              className="lg:hidden p-2.5"
            >
              {menuState ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </motion.div>

          {/* MOBILE DROPDOWN */}
          {menuState && (
            <div className="lg:hidden mt-3 pb-4 border-t border-white/10 pt-4">
              <ul className="flex flex-col gap-4 text-white/90 text-lg">
                {menuItems.map((item, i) => (
                  <li key={i}>
                    <Link href={item.href}>{item.name}</Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 mt-4">
                <Button
                  asChild
                  variant="secondary"
                  className="bg-white text-black"
                >
                  <Link href="/login">Login</Link>
                </Button>

                <Button asChild className="bg-black/80 text-white">
                  <Link href="/flow">Launch Editor</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
