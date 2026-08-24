import { NextRequest, NextResponse } from "next/server";
import { requireUser, errorResponse } from "@/lib/api-helpers";
import { customerSchema } from "@/lib/validation";
import { toCustomerRecord } from "@/lib/data/mappers";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;
  const { id } = await params;

  const { data, error } = await supabase.from("customers").select("*").eq("user_id", user.id).eq("id", id).maybeSingle();
  if (error) return errorResponse(error.message, 500);
  if (!data) return errorResponse("Customer not found", 404);

  return NextResponse.json({ customer: toCustomerRecord(data) });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;
  const { id } = await params;

  const body = await req.json().catch(() => null);
  const parsed = customerSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid customer data", 422);
  }
  const v = parsed.data;

  const { data, error } = await supabase
    .from("customers")
    .update({
      name: v.name,
      company: v.company,
      email: v.email,
      phone: v.phone,
      billing_address: v.billingAddress,
      shipping_address: v.shippingAddress,
      tax_id: v.taxId,
    })
    .eq("user_id", user.id)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) return errorResponse(error.message, 500);
  if (!data) return errorResponse("Customer not found", 404);

  return NextResponse.json({ customer: toCustomerRecord(data) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;
  const { id } = await params;

  const { error, count } = await supabase
    .from("customers")
    .delete({ count: "exact" })
    .eq("user_id", user.id)
    .eq("id", id);

  if (error) return errorResponse(error.message, 500);
  if (!count) return errorResponse("Customer not found", 404);

  return NextResponse.json({ ok: true });
}
