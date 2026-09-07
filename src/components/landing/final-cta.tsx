import Link from "next/link";
import { Reveal } from "@/components/landing/reveal";

export function FinalCta() {
  return (
    <section className="py-20 sm:py-28 px-4">
      <Reveal>
        <div className="mx-auto max-w-4xl rounded-3xl bg-accent px-8 py-16 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white text-balance max-w-[560px] mx-auto">
            Send your next invoice in the next five minutes
          </h2>
          <p className="mt-4 text-white/80 max-w-md mx-auto text-pretty">
            No credit card, no setup call. Just your business details and your first customer.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-white px-6 py-3 text-base font-semibold text-accent hover:opacity-90 active:scale-[0.98] transition-all duration-300"
            >
              Start free
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white hover:bg-white/10 active:scale-[0.98] transition-all duration-300"
            >
              Log in
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
