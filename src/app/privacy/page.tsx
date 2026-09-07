import Link from "next/link";
import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Privacy Policy — Statsix Invoice",
  description: "How Statsix Invoice collects, stores, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BrandLogo size={24} />
            Statsix Invoice
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold mb-2">Privacy policy</h1>
        <p className="text-sm text-black/40 mb-10">Last updated September 2026</p>

        <div className="space-y-8 text-black/70 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-black mb-2">What we collect</h2>
            <p>
              When you create an account we store your email address and the business, customer, and document data
              you enter — business name, logo, tax and payment details, customer contacts, and the invoices and
              receipts you build. We do not collect this information for any purpose beyond running the product for
              you.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">How your data is isolated</h2>
            <p>
              Every record you create is tied to your account and enforced with row level security at the database.
              Other accounts cannot read, edit, or delete your invoices, receipts, customers, or business profile,
              regardless of how they access the system.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">Where data is stored</h2>
            <p>
              Account and document data is stored with our database provider, Supabase, on infrastructure they
              operate. Passwords are never stored in plain text and authentication is handled by Supabase Auth.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">Logos and files you upload</h2>
            <p>
              A logo you upload for your business or a customer is converted to an embedded image and stored
              alongside the related record. We do not use uploaded images for any purpose other than displaying them
              on your own documents.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">Deleting your data</h2>
            <p>
              Deleting a document, customer, or your account removes the underlying record. If you would like your
              account and all associated data permanently removed, contact us and we will process the request.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">Changes</h2>
            <p>
              If this policy changes in a way that affects how your data is handled, we will update this page and
              change the date above.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
