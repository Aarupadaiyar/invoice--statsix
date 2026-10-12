import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { NON_BILLING_TITLES } from "@/types/document";

export type DashboardSummary = {
  totalInvoices: number;
  totalReceipts: number;
  draftDocuments: number;
  paidInvoices: number;
  outstandingAmount: number;
};

export async function getDashboardSummary(supabase: SupabaseClient<Database>, userId: string): Promise<DashboardSummary> {
  const { data } = await supabase.from("documents").select("document_type, document_title, status, total, amount_paid").eq("user_id", userId);

  const rows = data ?? [];
  // Quotations, sales orders, delivery challans etc. share the "invoice" type but are not billable invoices.
  const isBillable = (r: { document_type: string; document_title: string | null }) =>
    r.document_type === "invoice" && !NON_BILLING_TITLES.has(r.document_title ?? "");
  const totalInvoices = rows.filter(isBillable).length;
  const totalReceipts = rows.filter((r) => r.document_type === "receipt").length;
  const draftDocuments = rows.filter((r) => r.status === "draft").length;
  const paidInvoices = rows.filter((r) => isBillable(r) && r.status === "paid").length;
  const outstandingAmount = rows
    .filter((r) => isBillable(r) && (r.status === "sent" || r.status === "overdue"))
    .reduce((sum, r) => sum + (Number(r.total) - Number(r.amount_paid)), 0);

  return {
    totalInvoices,
    totalReceipts,
    draftDocuments,
    paidInvoices,
    outstandingAmount: Math.round(outstandingAmount * 100) / 100,
  };
}
