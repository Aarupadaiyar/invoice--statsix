"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";

const FAQ_ITEMS = [
  {
    q: "Is Statsix Invoice free to use?",
    a: "Yes. Creating an account, saving your business profile, and creating invoices and receipts does not require a credit card.",
  },
  {
    q: "Can I use it for receipts as well as invoices?",
    a: "Both are first class document types. A receipt uses payment date and payment method instead of a due date, and shows a payment received confirmation on the PDF.",
  },
  {
    q: "What currencies are supported?",
    a: "USD, EUR, GBP, INR, AUD, CAD, JPY, SGD, and AED are built in, with a default currency you can set on your business profile.",
  },
  {
    q: "Does my client need an account to receive an invoice?",
    a: "No. You download or print a standard PDF and send it however you already do, by email, chat, or in person.",
  },
  {
    q: "Can I add my bank details or a UPI ID?",
    a: "Yes. Bank name, account number, IFSC, SWIFT, UPI ID, and a payment link all live on your business profile and appear automatically on documents.",
  },
  {
    q: "Is my data private from other users?",
    a: "Every invoice, receipt, customer, and business profile is scoped to your account with row level security enforced at the database. Other accounts cannot read or write your records.",
  },
  {
    q: "Can I reuse a customer's details across documents?",
    a: "Save a customer once from the editor or the customers page, then select them from a dropdown on any future invoice or receipt to fill in their details instantly.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. The dashboard, editor, and preview are all responsive, and the generated PDF is always formatted as standard A4 regardless of the device you created it on.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28 px-4">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-sm font-semibold text-accent mb-3 text-center">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-balance text-center">Questions, answered</h2>
        </Reveal>

        <div className="mt-12 divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-medium text-sm sm:text-base">{item.q}</span>
                  <Plus
                    className={`size-4 shrink-0 text-black/40 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm text-black/60 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
