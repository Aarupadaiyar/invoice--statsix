import { NextRequest, NextResponse } from "next/server";
import { requireUser, errorResponse } from "@/lib/api-helpers";
import { peekNextDocumentNumber } from "@/lib/data/document-number";

export async function GET(req: NextRequest) {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const type = req.nextUrl.searchParams.get("type");
  const prefix = req.nextUrl.searchParams.get("prefix");
  if (type !== "invoice" && type !== "receipt") return errorResponse("type must be 'invoice' or 'receipt'");
  if (!prefix) return errorResponse("prefix is required");

  const documentNumber = await peekNextDocumentNumber(supabase, user.id, type, prefix);
  return NextResponse.json({ documentNumber });
}
