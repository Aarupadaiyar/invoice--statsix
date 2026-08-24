import { createClient } from "@/lib/supabase/server";
import { getDashboardSummary } from "@/lib/data/dashboard";
import { toBusinessProfileRecord, toDocumentRecord } from "@/lib/data/mappers";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { DocumentsExplorer } from "@/components/dashboard/documents-explorer";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [summary, { data: documentRows }, { data: profileRow }] = await Promise.all([
    getDashboardSummary(supabase, user.id),
    supabase.from("documents").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
    supabase.from("business_profiles").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  const documents = (documentRows ?? []).map(toDocumentRecord);
  const profile = toBusinessProfileRecord(profileRow);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-black/50 mt-1">Overview of your invoices, receipts, and recent activity.</p>
      </div>

      <OverviewCards {...summary} currency={profile.defaultCurrency} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Recent Documents</h2>
        <DocumentsExplorer initialDocuments={documents} />
      </div>
    </div>
  );
}
