import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toBusinessProfileRecord, toCustomerRecord, toDocumentInput, toDocumentRecord } from "@/lib/data/mappers";
import { DocumentEditor } from "@/components/editor/document-editor";

export default async function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: docRow }, { data: profileRow }, { data: customerRows }] = await Promise.all([
    supabase.from("documents").select("*").eq("user_id", user.id).eq("id", id).maybeSingle(),
    supabase.from("business_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("customers").select("*").eq("user_id", user.id).order("name", { ascending: true }),
  ]);

  if (!docRow) notFound();

  const doc = toDocumentRecord(docRow);
  const profile = toBusinessProfileRecord(profileRow);
  const customers = (customerRows ?? []).map(toCustomerRecord);

  return (
    <DocumentEditor
      type={doc.documentType}
      documentId={doc.id}
      profile={profile}
      customers={customers}
      suggestedNumber={doc.documentNumber}
      existing={toDocumentInput(doc)}
    />
  );
}
