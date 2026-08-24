import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type DashboardSummary = {
  totalInvoices: number;
  totalReceipts: number;
  draftDocuments: number;
  paidInvoices: number;
  outstandingAmount: number;
};

export async function getDashboardSummary(supabase: SupabaseClient<Database>, userId: string): Promise<DashboardSummary> {
  const { data } = await supabase.from("documents").select("document_type, status, total, amount_paid").eq("user_id", userId);

  const rows = data ?? [];
  const totalInvoices = rows.filter((r) => r.document_type === "invoice").length;
  const totalReceipts = rows.filter((r) => r.document_type === "receipt").length;
  const draftDocuments = rows.filter((r) => r.status === "draft").length;
  const paidInvoices = rows.filter((r) => r.document_type === "invoice" && r.status === "paid").length;
  const outstandingAmount = rows
    .filter((r) => r.document_type === "invoice" && (r.status === "sent" || r.status === "overdue"))
    .reduce((sum, r) => sum + (Number(r.total) - Number(r.amount_paid)), 0);

  return {
    totalInvoices,
    totalReceipts,
    draftDocuments,
    paidInvoices,
    outstandingAmount: Math.round(outstandingAmount * 100) / 100,
  };
}
