"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const LINKS = [
  { href: "#benefits", label: "Benefits" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6">
        <nav className="mx-auto mt-4 max-w-6xl h-16 rounded-full border border-black/5 bg-white/80 backdrop-blur-xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] px-4 sm:px-6 flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
          <Link href="/" className="flex items-center shrink-0">
            <BrandLogo height={26} />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-black/60 hover:text-black hover:bg-black/5 transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          <Link
            href="/login"
            className="hidden md:inline-flex rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] transition-all duration-300"
          >
            Log in
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden relative size-9 shrink-0 rounded-full hover:bg-black/5 transition-colors duration-300"
          >
            <span
              className={`absolute left-1/2 top-1/2 h-[1.5px] w-4 bg-black transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                open ? "-translate-x-1/2 -translate-y-1/2 rotate-45" : "-translate-x-1/2 -translate-y-[5px] rotate-0"
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 h-[1.5px] w-4 bg-black transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                open ? "-translate-x-1/2 -translate-y-1/2 -rotate-45" : "-translate-x-1/2 translate-y-[3px] rotate-0"
              }`}
            />
          </button>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 md:hidden bg-white/90 backdrop-blur-3xl transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-2">
          {LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-2xl font-semibold py-3 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                open ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${100 + i * 50}ms` : "0ms" }}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className={`mt-6 rounded-full bg-accent px-6 py-2.5 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              open ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
            style={{ transitionDelay: open ? "260ms" : "0ms" }}
          >
            Log in
          </Link>
        </div>
      </div>
    </>
  );
}
