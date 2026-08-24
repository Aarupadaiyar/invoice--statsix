"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Users } from "lucide-react";
import type { CustomerRecord } from "@/lib/data/mappers";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/toast";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CustomerFormDialog } from "@/components/customers/customer-form-dialog";
import { inputClass, btnPrimary } from "@/lib/ui";

export function CustomersManager({ initialCustomers }: { initialCustomers: CustomerRecord[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [dialogState, setDialogState] = useState<{ open: boolean; customer: CustomerRecord | null }>({
    open: false,
    customer: null,
  });
  const [pendingDelete, setPendingDelete] = useState<CustomerRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  function handleSaved(customer: CustomerRecord) {
    setCustomers((prev) => {
      const exists = prev.some((c) => c.id === customer.id);
      return exists ? prev.map((c) => (c.id === customer.id ? customer : c)) : [customer, ...prev];
    });
    setDialogState({ open: false, customer: null });
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/customers/${pendingDelete.id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== pendingDelete.id));
      toast.success("Customer deleted.");
      setPendingDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete customer.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-black/30" />
          <input
            placeholder="Search customers…"
            className={`${inputClass} pl-9`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className={btnPrimary} onClick={() => setDialogState({ open: true, customer: null })}>
          <Plus className="size-4" /> Add customer
        </button>
      </div>

      <div className="rounded-xl border border-black/5 bg-white overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-14 text-center">
            <Users className="size-10 mx-auto text-black/15 mb-3" />
            <p className="font-medium">{search ? "No customers match your search" : "No customers yet"}</p>
            <p className="text-sm text-black/40 mt-1">
              {search ? "Try a different search term." : "Add a customer to reuse their details on future documents."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 text-left text-black/40 text-xs uppercase tracking-wide">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-black/60">{c.company || "—"}</td>
                    <td className="px-4 py-3 text-black/60">{c.email || "—"}</td>
                    <td className="px-4 py-3 text-black/60">{c.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="Edit"
                          onClick={() => setDialogState({ open: true, customer: c })}
                          className="p-1.5 rounded hover:bg-black/5 text-black/50"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => setPendingDelete(c)}
                          className="p-1.5 rounded hover:bg-red-50 text-black/50 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CustomerFormDialog
        key={dialogState.customer?.id ?? "new"}
        open={dialogState.open}
        customer={dialogState.customer}
        onClose={() => setDialogState({ open: false, customer: null })}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete customer?"
        message={`This will permanently delete ${pendingDelete?.name ?? "this customer"}. Existing documents will keep a snapshot of their details.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
