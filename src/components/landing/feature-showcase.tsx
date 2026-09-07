import { Reveal } from "@/components/landing/reveal";

function LivePreviewVisual() {
  return (
    <div className="rounded-2xl border border-black/5 bg-white shadow-[0_24px_64px_rgba(20,20,43,0.10)] p-5 grid grid-cols-2 gap-3">
      <div className="rounded-lg bg-black/[0.03] p-3 space-y-2">
        <div className="h-2 w-14 rounded-full bg-black/15" />
        <div className="h-6 rounded-md bg-white border border-black/10" />
        <div className="h-2 w-10 rounded-full bg-black/15 mt-3" />
        <div className="h-6 rounded-md bg-white border border-black/10" />
      </div>
      <div className="rounded-lg bg-white border border-black/10 p-3 space-y-2">
        <div className="h-2 w-16 rounded-full bg-accent/40" />
        <div className="h-2 w-20 rounded-full bg-black/10" />
        <div className="h-2 w-12 rounded-full bg-black/10" />
        <div className="h-px bg-black/10 my-2" />
        <div className="flex justify-between">
          <div className="h-2 w-10 rounded-full bg-black/10" />
          <div className="h-2 w-10 rounded-full bg-accent/50" />
        </div>
      </div>
    </div>
  );
}

function PdfExportVisual() {
  return (
    <div className="flex items-center justify-center rounded-2xl border border-black/5 bg-white shadow-[0_24px_64px_rgba(20,20,43,0.10)] p-10">
      <div className="w-40 aspect-[210/297] rounded-md bg-white border border-black/10 shadow-sm p-3 -rotate-2 relative">
        <div className="h-2 w-10 rounded-full bg-black/15 mb-2" />
        <div className="h-1.5 w-16 rounded-full bg-black/10 mb-4" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-1.5 w-full rounded-full bg-black/[0.06] mb-1.5" />
        ))}
        <div className="absolute bottom-3 right-3 rounded bg-accent/10 text-accent text-[9px] font-semibold px-1.5 py-0.5">
          A4
        </div>
      </div>
    </div>
  );
}

function ProfileVisual() {
  return (
    <div className="rounded-2xl border border-black/5 bg-white shadow-[0_24px_64px_rgba(20,20,43,0.10)] p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-12 rounded-xl bg-accent/10" />
        <div className="space-y-1.5">
          <div className="h-2 w-24 rounded-full bg-black/15" />
          <div className="h-2 w-16 rounded-full bg-black/10" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {["Bank name", "Account no.", "IFSC", "UPI ID"].map((label) => (
          <div key={label} className="rounded-lg bg-black/[0.03] px-2.5 py-2">
            <p className="text-[9px] text-black/40 mb-1">{label}</p>
            <div className="h-1.5 w-3/4 rounded-full bg-black/15" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityVisual() {
  return (
    <div className="rounded-2xl border border-black/5 bg-white shadow-[0_24px_64px_rgba(20,20,43,0.10)] p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-black/40 uppercase tracking-wide">Your account</p>
        <span className="rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-1">Isolated</span>
      </div>
      <div className="space-y-2">
        {["Invoices", "Receipts", "Customers", "Bank details"].map((row) => (
          <div key={row} className="flex items-center justify-between rounded-lg bg-black/[0.03] px-3 py-2">
            <span className="text-xs text-black/60">{row}</span>
            <span className="text-[10px] text-black/30">Only visible to you</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const FEATURES = [
  {
    eyebrow: "Live preview",
    title: "Watch the document take shape as you type",
    body: "The editor and preview sit side by side. Add a line item, change a tax rate, or swap a currency, and the total on the right updates instantly, with the exact layout your client will see.",
    Visual: LivePreviewVisual,
  },
  {
    eyebrow: "PDF export",
    title: "A real PDF, not a screenshot of a webpage",
    body: "Downloads are generated as proper A4 documents with correct margins, page breaks for long line item lists, and typography that holds up when printed.",
    Visual: PdfExportVisual,
  },
  {
    eyebrow: "Business profile",
    title: "Enter your payment details once",
    body: "Bank name, account number, IFSC, UPI ID, or a payment link: save them to your profile and they show up automatically on every invoice and receipt you create.",
    Visual: ProfileVisual,
  },
  {
    eyebrow: "Security",
    title: "Nobody else can see your documents",
    body: "Every invoice, receipt, and customer record is scoped to your account with row level access control enforced at the database, not just hidden in the interface.",
    Visual: SecurityVisual,
  },
];

export function FeatureShowcase() {
  return (
    <section className="py-20 sm:py-28 px-4">
      <div className="mx-auto max-w-6xl space-y-24">
        {FEATURES.map((f, i) => (
          <Reveal key={f.eyebrow}>
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <p className="text-sm font-semibold text-accent mb-3">{f.eyebrow}</p>
                <h3 className="text-2xl sm:text-3xl font-semibold text-balance mb-4">{f.title}</h3>
                <p className="text-black/60 leading-relaxed text-pretty">{f.body}</p>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <f.Visual />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
