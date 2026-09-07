import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "#benefits", label: "Benefits" },
      { href: "#how-it-works", label: "How it works" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Sign up" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-black/5 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold mb-3">
              <BrandLogo height={22} />
            </Link>
            <p className="text-sm text-black/50 max-w-xs">
              Professional invoices and receipts for freelancers and small businesses, with real PDF exports every
              time.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold mb-3">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-black/50 hover:text-black transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-black/40">© {new Date().getFullYear()} Statsix Invoice. All rights reserved.</p>
          <p className="text-xs text-black/30">Made for freelancers and small businesses.</p>
        </div>
      </div>
    </footer>
  );
}
