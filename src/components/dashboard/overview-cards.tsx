import { FileText, Receipt, FileClock, BadgeCheck, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/calc";

export function OverviewCards({
  totalInvoices,
  totalReceipts,
  draftDocuments,
  paidInvoices,
  outstandingAmount,
  currency,
}: {
  totalInvoices: number;
  totalReceipts: number;
  draftDocuments: number;
  paidInvoices: number;
  outstandingAmount: number;
  currency: string;
}) {
  const cards = [
    { label: "Total Invoices", value: totalInvoices, icon: FileText, color: "text-accent bg-accent/10" },
    { label: "Total Receipts", value: totalReceipts, icon: Receipt, color: "text-emerald-600 bg-emerald-50" },
    { label: "Draft Documents", value: draftDocuments, icon: FileClock, color: "text-amber-600 bg-amber-50" },
    { label: "Paid Invoices", value: paidInvoices, icon: BadgeCheck, color: "text-emerald-600 bg-emerald-50" },
    {
      label: "Outstanding",
      value: formatCurrency(outstandingAmount, currency),
      icon: Wallet,
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="rounded-xl border border-black/5 bg-white p-4">
          <div className={`size-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
            <Icon className="size-4.5" />
          </div>
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
          <p className="text-xs text-black/40 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}
