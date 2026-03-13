"use client";

import { Header } from "@/app/components/ui/header-1";
import { HeroSection, LogosSection } from "@/app/components/ui/hero-1";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <Header />
      <main className="flex-1 px-4">
        <HeroSection />
        <LogosSection />
      </main>
    </div>
  );
}

