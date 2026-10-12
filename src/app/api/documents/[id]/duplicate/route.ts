import { NextRequest, NextResponse } from "next/server";
import { requireUser, errorResponse, dbError } from "@/lib/api-helpers";
import { toDocumentRecord } from "@/lib/data/mappers";
import { formatDocumentNumber, peekNextDocumentNumber, syncCounterAfterSave } from "@/lib/data/document-number";

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

  if (fetchError) return dbError(fetchError);
  if (!source) return errorResponse("Document not found", 404);

  const type = source.document_type as "invoice" | "receipt";
  const prefix = source.document_number.match(/^\D+/)?.[0] ?? (type === "invoice" ? "INV-" : "REC-");
  const today = new Date().toISOString().slice(0, 10);

  // Keep the same gap between issue and due date instead of copying a due date that may now be in the past.
  let dueDate: string | null = null;
  if (source.due_date) {
    const gapMs = new Date(source.due_date).getTime() - new Date(source.issue_date).getTime();
    dueDate = Number.isFinite(gapMs) && gapMs >= 0 ? new Date(Date.now() + gapMs).toISOString().slice(0, 10) : today;
  }

  // The suggested number can already be taken (e.g. a custom number or a concurrent save), so retry a few times.
  let newNumber = await peekNextDocumentNumber(supabase, user.id, type, prefix);
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        customer_id: source.customer_id,
        document_type: source.document_type,
        document_title: source.document_title,
        document_number: newNumber,
        status: "draft",
        issue_date: today,
        due_date: dueDate,
        payment_date: null,
        payment_method: source.payment_method,
        currency: source.currency,
        place_of_supply: source.place_of_supply,
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

    if (!error) {
      await syncCounterAfterSave(supabase, user.id, type, prefix, newNumber);
      return NextResponse.json({ document: toDocumentRecord(data) }, { status: 201 });
    }
    if (error.code !== "23505") return dbError(error);

    const current = parseInt(newNumber.slice(prefix.length), 10);
    newNumber = formatDocumentNumber(prefix, (Number.isFinite(current) ? current : 0) + 1);
  }

  return errorResponse("Could not find a free document number. Please try again.", 409);
}
