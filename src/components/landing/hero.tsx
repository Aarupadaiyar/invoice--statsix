import Link from "next/link";
import { HeroMockup } from "@/components/landing/hero-mockup";

export function Hero() {
  return (
    <section className="pt-28 pb-20 sm:pt-36 sm:pb-28 px-4">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1
            className="max-w-[680px] text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-balance bg-clip-text text-transparent bg-gradient-to-r from-black to-[#666666]"
          >
            Invoicing that looks sharp,
            <br />
            and gets you paid faster
          </h1>
          <p className="mt-6 max-w-[680px] text-lg text-black/60 text-pretty">
            Build polished invoices and receipts in minutes, save your business details once, and download real,
            print ready PDFs every time.
          </p>

          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-flex rounded-full bg-accent px-6 py-3 text-base font-semibold text-white hover:opacity-90 active:scale-[0.98] transition-all duration-300"
            >
              Start free
            </Link>
          </div>

          <p className="mt-5 text-sm text-black/40">No credit card required. Create your first invoice in under 2 minutes.</p>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}
