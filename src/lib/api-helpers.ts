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

/** Turns a Supabase/Postgres error into a response; flags an out-of-date database with an actionable message. */
export function dbError(error: { message: string; code?: string }) {
  const outOfDate =
    error.code === "PGRST204" ||
    error.code === "42703" ||
    /schema cache|does not exist/i.test(error.message);
  if (outOfDate) {
    console.error("Database schema is out of date:", error.message);
    return errorResponse(
      "The database is missing a recent update. Run the latest supabase/schema.sql in the Supabase SQL Editor, then try again.",
      500,
    );
  }
  return errorResponse(error.message, 500);
}
