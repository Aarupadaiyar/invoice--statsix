export function HeroMockup() {
  return (
    <div className="relative w-full max-w-[420px] mx-auto lg:mx-0">
      <div className="absolute -top-4 -left-4 rounded-2xl bg-white border border-black/5 shadow-lg px-4 py-2.5 z-10 hidden sm:block">
        <p className="text-xs text-black/40">Auto calculated</p>
        <p className="text-sm font-semibold text-accent">$3,214.50</p>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white shadow-[0_24px_64px_rgba(20,20,43,0.12)] p-6 rotate-1">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="h-2 w-20 rounded-full bg-black/10 mb-2" />
            <p className="text-sm font-semibold">Lumen Studio</p>
            <p className="text-[11px] text-black/40">hello@lumenstudio.co</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-accent tracking-wide">INVOICE</p>
            <p className="text-[11px] text-black/40">INV 0847</p>
          </div>
        </div>

        <div className="rounded-lg bg-black/[0.03] px-3 py-2 mb-4">
          <p className="text-[11px] text-black/40 uppercase tracking-wide mb-0.5">Bill to</p>
          <p className="text-sm font-medium">Priya Nair · Northfield Consulting</p>
        </div>

        <div className="space-y-2 mb-4">
          {[
            { label: "Brand identity package", amount: "$1,850.00" },
            { label: "Website copy — 6 pages", amount: "$940.00" },
            { label: "Revisions round", amount: "$424.50" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between text-xs">
              <span className="text-black/60">{row.label}</span>
              <span className="font-medium tabular-nums">{row.amount}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-black/10 pt-3 flex items-center justify-between">
          <span className="text-sm font-semibold">Total due</span>
          <span className="text-lg font-bold text-accent tabular-nums">$3,214.50</span>
        </div>
      </div>

      <div className="absolute -bottom-5 -right-3 rounded-xl bg-emerald-50 border border-emerald-100 shadow-lg px-4 py-2.5 -rotate-2 hidden sm:block">
        <p className="text-[11px] font-semibold text-emerald-700">PDF ready · A4</p>
      </div>
    </div>
  );
}
