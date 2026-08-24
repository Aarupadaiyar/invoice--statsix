import { NextRequest, NextResponse } from "next/server";
import { requireUser, errorResponse } from "@/lib/api-helpers";
import { documentSchema } from "@/lib/validation";
import { toDocumentRecord } from "@/lib/data/mappers";
import { calcDocumentTotals } from "@/lib/calc";
import { syncCounterAfterSave } from "@/lib/data/document-number";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;
  const { id } = await params;

  const { data, error } = await supabase.from("documents").select("*").eq("user_id", user.id).eq("id", id).maybeSingle();
  if (error) return errorResponse(error.message, 500);
  if (!data) return errorResponse("Document not found", 404);

  return NextResponse.json({ document: toDocumentRecord(data) });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;
  const { id } = await params;

  const body = await req.json().catch(() => null);
  const parsed = documentSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid document data", 422);
  }
  const v = parsed.data;
  const totals = calcDocumentTotals(v.lineItems, v.extraCharge);

  const { data, error } = await supabase
    .from("documents")
    .update({
      customer_id: v.customerId || null,
      document_number: v.documentNumber,
      status: v.status,
      issue_date: v.issueDate,
      due_date: v.dueDate || null,
      payment_date: v.paymentDate || null,
      payment_method: v.paymentMethod || null,
      currency: v.currency,
      business_details: v.businessDetails,
      customer_details: v.customerDetails,
      line_items: v.lineItems,
      extra_charge: v.extraCharge,
      subtotal: totals.subtotal,
      discount_total: totals.discountTotal,
      tax_total: totals.taxTotal,
      shipping_total: totals.shippingTotal,
      total: totals.total,
      amount_paid: v.amountPaid,
      notes: v.notes,
      terms: v.terms,
    })
    .eq("user_id", user.id)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return errorResponse(`Document number "${v.documentNumber}" is already in use. Please choose a different number.`, 409);
    }
    return errorResponse(error.message, 500);
  }
  if (!data) return errorResponse("Document not found", 404);

  const inferredPrefix = v.documentNumber.match(/^\D+/)?.[0] ?? "";
  if (inferredPrefix) {
    await syncCounterAfterSave(supabase, user.id, v.documentType, inferredPrefix, v.documentNumber);
  }

  return NextResponse.json({ document: toDocumentRecord(data) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;
  const { id } = await params;

  const { error, count } = await supabase
    .from("documents")
    .delete({ count: "exact" })
    .eq("user_id", user.id)
    .eq("id", id);

  if (error) return errorResponse(error.message, 500);
  if (!count) return errorResponse("Document not found", 404);

  return NextResponse.json({ ok: true });
}
