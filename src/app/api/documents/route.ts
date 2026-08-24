import { NextRequest, NextResponse } from "next/server";
import { requireUser, errorResponse } from "@/lib/api-helpers";
import { documentSchema } from "@/lib/validation";
import { toDocumentRecord } from "@/lib/data/mappers";
import { calcDocumentTotals } from "@/lib/calc";
import { syncCounterAfterSave } from "@/lib/data/document-number";

export async function GET(req: NextRequest) {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const params = req.nextUrl.searchParams;
  const type = params.get("type");
  const status = params.get("status");
  const customerId = params.get("customerId");
  const dateFrom = params.get("dateFrom");
  const dateTo = params.get("dateTo");
  const rawSearch = params.get("q")?.trim();
  const search = rawSearch?.replace(/[,()%*]/g, "");
  const limit = Math.min(parseInt(params.get("limit") ?? "50", 10) || 50, 200);

  let query = supabase.from("documents").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(limit);

  if (type === "invoice" || type === "receipt") query = query.eq("document_type", type);
  if (status) query = query.eq("status", status);
  if (customerId) query = query.eq("customer_id", customerId);
  if (dateFrom) query = query.gte("issue_date", dateFrom);
  if (dateTo) query = query.lte("issue_date", dateTo);
  if (search) {
    query = query.or(
      `document_number.ilike.%${search}%,customer_details->>name.ilike.%${search}%,customer_details->>company.ilike.%${search}%`,
    );
  }

  const { data, error } = await query;
  if (error) return errorResponse(error.message, 500);

  return NextResponse.json({ documents: (data ?? []).map(toDocumentRecord) });
}

export async function POST(req: NextRequest) {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = documentSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid document data", 422);
  }
  const v = parsed.data;
  const totals = calcDocumentTotals(v.lineItems, v.extraCharge);

  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      customer_id: v.customerId || null,
      document_type: v.documentType,
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
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return errorResponse(`Document number "${v.documentNumber}" is already in use. Please choose a different number.`, 409);
    }
    return errorResponse(error.message, 500);
  }

  const inferredPrefix = v.documentNumber.match(/^\D+/)?.[0] ?? "";
  if (inferredPrefix) {
    await syncCounterAfterSave(supabase, user.id, v.documentType, inferredPrefix, v.documentNumber);
  }

  return NextResponse.json({ document: toDocumentRecord(data) }, { status: 201 });
}
