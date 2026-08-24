import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-helpers";
import { getDashboardSummary } from "@/lib/data/dashboard";

export async function GET() {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const summary = await getDashboardSummary(supabase, user.id);
  return NextResponse.json(summary);
}
