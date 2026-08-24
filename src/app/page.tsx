import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Zap, ShieldCheck, Download } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <BrandLogo />
            Statsix Invoice
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-black/5">
              Log in
            </Link>
            <Link href="/signup" className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-white hover:opacity-90">
              Get started free
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
            Professional invoices and receipts, done in minutes.
          </h1>
          <p className="mt-5 text-lg text-black/60 max-w-2xl mx-auto">
            Build, preview, and send polished invoices and receipts. Save your business profile and customers once —
            reuse them forever. Download real, print-ready PDFs every time.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/signup" className="px-6 py-3 rounded-lg bg-accent text-white font-medium hover:opacity-90">
              Create your first invoice
            </Link>
            <Link href="/login" className="px-6 py-3 rounded-lg border border-black/10 font-medium hover:bg-black/5">
              I already have an account
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24 grid sm:grid-cols-3 gap-6">
          <Feature
            icon={<Zap className="size-5" />}
            title="Live preview"
            body="Watch your document update instantly as you type — totals, taxes, and discounts calculate automatically."
          />
          <Feature
            icon={<Download className="size-5" />}
            title="Real PDF exports"
            body="Download properly formatted, print-ready A4 PDFs suitable for emailing or printing — never just a screenshot."
          />
          <Feature
            icon={<ShieldCheck className="size-5" />}
            title="Private by default"
            body="Every document, customer, and business profile is scoped to your account and never visible to anyone else."
          />
        </section>
      </main>

      <footer className="border-t border-black/5 py-6 text-center text-sm text-black/40">
        Statsix Invoice — built for freelancers and small businesses.
      </footer>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-6 text-left">
      <div className="size-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">{icon}</div>
      <h3 className="font-semibold mb-1.5">{title}</h3>
      <p className="text-sm text-black/60 leading-relaxed">{body}</p>
    </div>
  );
}
