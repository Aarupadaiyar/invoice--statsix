import { Zap, RefreshCw, FileCheck2, Calculator, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";

const BENEFITS = [
  {
    icon: Zap,
    title: "Get paid faster",
    body: "Polished, branded invoices that make it obvious what's owed and by when, so there's no more chasing clarifications.",
  },
  {
    icon: RefreshCw,
    title: "Stop re-typing the same details",
    body: "Save your business profile, bank details, and customer list once. Reuse them on every invoice and receipt.",
  },
  {
    icon: FileCheck2,
    title: "Real, print ready PDFs",
    body: "Every document exports as an actual A4 PDF with proper margins and pagination, not a screenshot of a webpage.",
  },
  {
    icon: Calculator,
    title: "Your numbers, verified",
    body: "Totals, tax, and discounts calculate with exact decimal math, so a total is never off by a cent.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Every document is scoped to your account with database level access control. Nobody else can see it.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="py-20 sm:py-28 px-4 bg-black/[0.02]">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold text-accent mb-3">Why teams switch</p>
          <h2 className="max-w-[680px] text-3xl sm:text-4xl font-semibold text-balance">
            Everything a freelancer or small business needs to bill with confidence
          </h2>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delayMs={i * 80}>
              <div className="h-full rounded-2xl border border-black/5 bg-white p-6">
                <div className="size-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <b.icon className="size-5" strokeWidth={2} />
                </div>
                <h3 className="font-semibold mb-1.5">{b.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
