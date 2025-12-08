"use client";

import React from "react";

// your customized header + hero
import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-4";

// (optional future sections)
// import FeaturesSection from '@/components/sections/features-section'
// import HowItWorksSection from '@/components/sections/how-it-works-section'
// import PricingSection from '@/components/sections/pricing-section'
// import Footer from '@/components/footer'

export default function Home() {
  return (
    <>
      {/* Header (sticky, animated) */}
      <HeroHeader />

      <main className="flex flex-col">
        {/* Hero Section */}
        <HeroSection />

        {/* Enable these when ready */}
        <FeaturesSection />
        {/* <HowItWorksSection /> */}
        {/* <PricingSection /> */}
        {/* <Footer /> */}
      </main>
    </>
  );
}
