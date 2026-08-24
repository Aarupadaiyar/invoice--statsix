import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toBusinessProfileRecord, toCustomerRecord } from "@/lib/data/mappers";
import { peekNextDocumentNumber } from "@/lib/data/document-number";
import { DocumentEditor } from "@/components/editor/document-editor";
import type { DocumentType } from "@/types/document";

export default async function NewDocumentPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (type !== "invoice" && type !== "receipt") notFound();
  const documentType = type as DocumentType;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profileRow }, { data: customerRows }] = await Promise.all([
    supabase.from("business_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("customers").select("*").eq("user_id", user.id).order("name", { ascending: true }),
  ]);

  const profile = toBusinessProfileRecord(profileRow);
  const customers = (customerRows ?? []).map(toCustomerRecord);
  const prefix = documentType === "invoice" ? profile.invoicePrefix || "INV-" : profile.receiptPrefix || "REC-";
  const suggestedNumber = await peekNextDocumentNumber(supabase, user.id, documentType, prefix);

  return (
    <DocumentEditor
      type={documentType}
      documentId={null}
      profile={profile}
      customers={customers}
      suggestedNumber={suggestedNumber}
      existing={null}
    />
  );
}
