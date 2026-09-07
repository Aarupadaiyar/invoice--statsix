import { Heart } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";

export function Mission() {
  return (
    <section className="py-20 sm:py-28 px-4 bg-accent/5">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <div className="size-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
            <Heart className="size-5" strokeWidth={2} />
          </div>
          <p className="text-sm font-semibold text-accent mb-3">Our mission</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
            Free invoicing for every business, no matter how small
          </h2>
          <p className="mt-5 text-black/60 leading-relaxed text-pretty">
            Professional invoicing should not be locked behind a paywall for a freelancer sending their first
            invoice or a small team taking on their first client. That is why creating, saving, and downloading
            invoices and receipts with Statsix Invoice is free. If it helps you get paid a little faster, we are
            glad to be a small part of your success.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
