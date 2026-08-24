import { createClient } from "@/lib/supabase/server";
import { toCustomerRecord } from "@/lib/data/mappers";
import { CustomersManager } from "@/components/customers/customers-manager";

export default async function CustomersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("customers").select("*").eq("user_id", user.id).order("name", { ascending: true });
  const customers = (data ?? []).map(toCustomerRecord);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <p className="text-sm text-black/50 mt-1">Manage your customer list — select any of them when creating a document.</p>
      </div>
      <CustomersManager initialCustomers={customers} />
    </div>
  );
}
