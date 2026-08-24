import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toDocumentInput, toDocumentRecord } from "@/lib/data/mappers";
import { DocumentPreview } from "@/components/document-preview";
import { DocumentViewActions } from "@/components/document-view-actions";

export default async function ViewDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: docRow } = await supabase.from("documents").select("*").eq("user_id", user.id).eq("id", id).maybeSingle();
  if (!docRow) notFound();

  const doc = toDocumentRecord(docRow);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-5">
      <DocumentViewActions doc={doc} />
      <DocumentPreview doc={toDocumentInput(doc)} />
    </div>
  );
}
