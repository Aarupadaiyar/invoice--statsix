import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const PAD_LENGTH = 4;

export function formatDocumentNumber(prefix: string, value: number): string {
  return `${prefix}${String(value).padStart(PAD_LENGTH, "0")}`;
}

/** Non-mutating preview of the next document number for a user/type/prefix. */
export async function peekNextDocumentNumber(
  supabase: SupabaseClient<Database>,
  userId: string,
  type: "invoice" | "receipt",
  prefix: string,
): Promise<string> {
  const { data } = await supabase
    .from("counters")
    .select("value")
    .eq("user_id", userId)
    .eq("type", type)
    .eq("prefix", prefix)
    .maybeSingle();

  const nextValue = (data?.value ?? 0) + 1;
  return formatDocumentNumber(prefix, nextValue);
}

/**
 * After a document is saved, keeps the counter in sync so future previews never
 * suggest a number that's already in use, even if the user typed a custom number.
 */
export async function syncCounterAfterSave(
  supabase: SupabaseClient<Database>,
  userId: string,
  type: "invoice" | "receipt",
  prefix: string,
  documentNumber: string,
): Promise<void> {
  let usedValue = 0;
  if (documentNumber.startsWith(prefix)) {
    const suffix = documentNumber.slice(prefix.length);
    const parsed = parseInt(suffix, 10);
    if (Number.isFinite(parsed) && parsed > 0) usedValue = parsed;
  }
  if (usedValue <= 0) return;

  const { data } = await supabase
    .from("counters")
    .select("id, value")
    .eq("user_id", userId)
    .eq("type", type)
    .eq("prefix", prefix)
    .maybeSingle();

  if (!data) {
    await supabase.from("counters").insert({ user_id: userId, type, prefix, value: usedValue });
    return;
  }

  if (usedValue > data.value) {
    await supabase.from("counters").update({ value: usedValue }).eq("id", data.id);
  }
}
