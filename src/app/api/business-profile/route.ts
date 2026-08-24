import { NextRequest, NextResponse } from "next/server";
import { requireUser, errorResponse } from "@/lib/api-helpers";
import { businessProfileSchema } from "@/lib/validation";
import { toBusinessProfileRecord } from "@/lib/data/mappers";

export async function GET() {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return errorResponse(error.message, 500);

  return NextResponse.json({ profile: toBusinessProfileRecord(data) });
}

export async function PUT(req: NextRequest) {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = businessProfileSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid business profile data", 422);
  }
  const v = parsed.data;

  const { data, error } = await supabase
    .from("business_profiles")
    .upsert(
      {
        user_id: user.id,
        business_name: v.businessName,
        logo_data_url: v.logoDataUrl,
        address: v.address,
        phone: v.phone,
        email: v.email,
        website: v.website,
        tax_id: v.taxId,
        default_currency: v.defaultCurrency,
        default_payment_terms: v.defaultPaymentTerms,
        invoice_prefix: v.invoicePrefix,
        receipt_prefix: v.receiptPrefix,
        default_notes: v.defaultNotes,
        default_terms: v.defaultTerms,
        bank_name: v.bankName,
        account_holder_name: v.accountHolderName,
        account_number: v.accountNumber,
        ifsc_code: v.ifscCode,
        swift_code: v.swiftCode,
        upi_id: v.upiId,
        payment_link: v.paymentLink,
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();

  if (error) return errorResponse(error.message, 500);

  return NextResponse.json({ profile: toBusinessProfileRecord(data) });
}
