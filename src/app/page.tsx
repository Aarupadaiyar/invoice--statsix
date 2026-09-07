import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import { TaglineSection } from "@/components/landing/tagline-section";
import { Benefits } from "@/components/landing/benefits";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeatureShowcase } from "@/components/landing/feature-showcase";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Statsix Invoice — Create Professional Invoices & Receipts",
  description:
    "Build polished invoices and receipts in minutes, save your business details once, and download real, print ready PDFs every time.",
  openGraph: {
    title: "Statsix Invoice — Create Professional Invoices & Receipts",
    description:
      "Build polished invoices and receipts in minutes, save your business details once, and download real, print ready PDFs every time.",
    type: "website",
  },
};

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex-1 flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <LandingNav />
      <main id="main" className="flex-1">
        <Hero />
        <TaglineSection />
        <Benefits />
        <HowItWorks />
        <FeatureShowcase />
        <Faq />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
