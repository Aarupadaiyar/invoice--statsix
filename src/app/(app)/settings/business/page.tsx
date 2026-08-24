import { createClient } from "@/lib/supabase/server";
import { toBusinessProfileRecord } from "@/lib/data/mappers";
import { BusinessProfileForm } from "@/components/settings/business-profile-form";

export default async function BusinessSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("business_profiles").select("*").eq("user_id", user.id).maybeSingle();
  const profile = toBusinessProfileRecord(data);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Business Profile</h1>
        <p className="text-sm text-black/50 mt-1">
          Save your company details once — they&apos;ll auto-fill every new invoice and receipt.
        </p>
      </div>
      <BusinessProfileForm initialProfile={profile} />
    </div>
  );
}
