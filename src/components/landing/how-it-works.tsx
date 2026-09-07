import { Reveal } from "@/components/landing/reveal";

const STEPS = [
  {
    step: "01",
    title: "Set up your business profile",
    body: "Add your logo, address, tax number, and bank or UPI details once. They auto fill on every new document.",
  },
  {
    step: "02",
    title: "Build the invoice or receipt",
    body: "Add line items and pick a customer from your saved list. The live preview and totals update as you type.",
  },
  {
    step: "03",
    title: "Save and send",
    body: "Download a real A4 PDF or print it directly, then track its status (draft, sent, or paid) from your dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold text-accent mb-3">How it works</p>
          <h2 className="max-w-[680px] text-3xl sm:text-4xl font-semibold text-balance">From blank page to a paid invoice in three steps</h2>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <Reveal key={s.step} delayMs={i * 100}>
              <div>
                <p className="text-5xl font-semibold text-black/10 mb-4">{s.step}</p>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
