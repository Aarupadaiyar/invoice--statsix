import { NextRequest, NextResponse } from "next/server";
import { requireUser, errorResponse } from "@/lib/api-helpers";
import { toDocumentRecord } from "@/lib/data/mappers";
import { peekNextDocumentNumber, syncCounterAfterSave } from "@/lib/data/document-number";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;
  const { id } = await params;

  const { data: source, error: fetchError } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .eq("id", id)
    .maybeSingle();

  if (fetchError) return errorResponse(fetchError.message, 500);
  if (!source) return errorResponse("Document not found", 404);

  const prefix = source.document_number.match(/^\D+/)?.[0] ?? (source.document_type === "invoice" ? "INV-" : "REC-");
  const newNumber = await peekNextDocumentNumber(supabase, user.id, source.document_type as "invoice" | "receipt", prefix);
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      customer_id: source.customer_id,
      document_type: source.document_type,
      document_number: newNumber,
      status: "draft",
      issue_date: today,
      due_date: source.due_date,
      payment_date: null,
      payment_method: source.payment_method,
      currency: source.currency,
      business_details: source.business_details,
      customer_details: source.customer_details,
      line_items: source.line_items,
      extra_charge: source.extra_charge,
      subtotal: source.subtotal,
      discount_total: source.discount_total,
      tax_total: source.tax_total,
      shipping_total: source.shipping_total,
      total: source.total,
      amount_paid: 0,
      notes: source.notes,
      terms: source.terms,
    })
    .select("*")
    .single();

  if (error) return errorResponse(error.message, 500);

  await syncCounterAfterSave(supabase, user.id, source.document_type as "invoice" | "receipt", prefix, newNumber);

  return NextResponse.json({ document: toDocumentRecord(data) }, { status: 201 });
}
