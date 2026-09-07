import Link from "next/link";
import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Statsix Invoice Terms of Service",
  description: "The terms that apply when you use Statsix Invoice.",
};

export default function TermsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BrandLogo height={22} />
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold mb-2">Terms of service</h1>
        <p className="text-sm text-black/40 mb-10">Last updated September 2026</p>

        <div className="space-y-8 text-black/70 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-black mb-2">Using the service</h2>
            <p>
              Statsix Invoice lets you create, save, and export invoices and receipts. You are responsible for the
              accuracy of the business, tax, and payment information you enter, and for the documents you send to
              your customers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">Your account</h2>
            <p>
              You are responsible for keeping your login credentials secure and for the activity that happens under
              your account. Let us know immediately if you believe your account has been accessed without
              authorization.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">Your content</h2>
            <p>
              You retain ownership of the business details, customer information, and documents you create. We only
              use that data to operate the product for you, as described in our{" "}
              <Link href="/privacy" className="text-accent hover:underline">
                privacy policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">Acceptable use</h2>
            <p>
              Do not use Statsix Invoice to generate fraudulent, deceptive, or illegal documents, or to attempt to
              access another account&apos;s data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">Availability</h2>
            <p>
              We aim to keep the service available and your data intact, but Statsix Invoice is provided as is,
              without a guarantee of uninterrupted availability. Keep your own copies of downloaded PDFs for your
              records.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-2">Changes to these terms</h2>
            <p>
              If we make a material change to these terms, we will update this page and change the date above.
              Continuing to use the service after a change means you accept the updated terms.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
