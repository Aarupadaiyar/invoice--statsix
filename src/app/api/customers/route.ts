import { NextRequest, NextResponse } from "next/server";
import { requireUser, errorResponse } from "@/lib/api-helpers";
import { customerSchema } from "@/lib/validation";
import { toCustomerRecord } from "@/lib/data/mappers";

export async function GET(req: NextRequest) {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const rawSearch = req.nextUrl.searchParams.get("q")?.trim();
  const search = rawSearch?.replace(/[,()%*]/g, "");

  let query = supabase.from("customers").select("*").eq("user_id", user.id).order("name", { ascending: true });
  if (search) {
    query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) return errorResponse(error.message, 500);

  return NextResponse.json({ customers: (data ?? []).map(toCustomerRecord) });
}

export async function POST(req: NextRequest) {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = customerSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid customer data", 422);
  }
  const v = parsed.data;

  const { data, error } = await supabase
    .from("customers")
    .insert({
      user_id: user.id,
      name: v.name,
      company: v.company,
      email: v.email,
      phone: v.phone,
      billing_address: v.billingAddress,
      shipping_address: v.shippingAddress,
      tax_id: v.taxId,
    })
    .select("*")
    .single();

  if (error) return errorResponse(error.message, 500);

  return NextResponse.json({ customer: toCustomerRecord(data) }, { status: 201 });
}
