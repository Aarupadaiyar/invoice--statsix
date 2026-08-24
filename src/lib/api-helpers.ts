import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Resolves the authenticated Supabase client + user, or returns a 401 response to send back immediately. */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase, user: null, unauthorized: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return { supabase, user, unauthorized: null };
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
