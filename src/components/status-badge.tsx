import { statusLabel } from "@/lib/format";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-black/5 text-black/60",
  sent: "bg-blue-50 text-blue-700",
  paid: "bg-emerald-50 text-emerald-700",
  received: "bg-emerald-50 text-emerald-700",
  overdue: "bg-red-50 text-red-700",
  cancelled: "bg-black/5 text-black/40 line-through",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? "bg-black/5 text-black/60";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {statusLabel(status)}
    </span>
  );
}
