"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import type { CustomerRecord } from "@/lib/data/mappers";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/toast";
import { inputClass, labelClass, btnPrimary, btnSecondary } from "@/lib/ui";

export type CustomerFormValues = Omit<CustomerRecord, "id" | "createdAt" | "updatedAt">;

const EMPTY: CustomerFormValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  billingAddress: "",
  shippingAddress: "",
  taxId: "",
};

export function CustomerFormDialog({
  open,
  customer,
  onClose,
  onSaved,
}: {
  open: boolean;
  customer: CustomerRecord | null;
  onClose: () => void;
  onSaved: (customer: CustomerRecord) => void;
}) {
  const [values, setValues] = useState<CustomerFormValues>(customer ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  if (!open) return null;

  function set<K extends keyof CustomerFormValues>(key: K, value: CustomerFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.name.trim()) {
      setError("Customer name is required.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const result = customer
        ? await api.put<{ customer: CustomerRecord }>(`/api/customers/${customer.id}`, values)
        : await api.post<{ customer: CustomerRecord }>("/api/customers", values);
      toast.success(customer ? "Customer updated." : "Customer added.");
      onSaved(result.customer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save customer.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto no-print" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          <h2 className="font-semibold">{customer ? "Edit customer" : "Add customer"}</h2>
          <button onClick={onClose} className="text-black/30 hover:text-black/60">
            <X className="size-4.5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name *</label>
              <input className={inputClass} value={values.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Company</label>
              <input className={inputClass} value={values.company} onChange={(e) => set("company", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" className={inputClass} value={values.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={values.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Tax / GST / VAT number</label>
              <input className={inputClass} value={values.taxId} onChange={(e) => set("taxId", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Billing address</label>
            <textarea
              className={inputClass}
              rows={2}
              value={values.billingAddress}
              onChange={(e) => set("billingAddress", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Shipping address</label>
            <textarea
              className={inputClass}
              rows={2}
              value={values.shippingAddress}
              onChange={(e) => set("shippingAddress", e.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className={btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {customer ? "Save changes" : "Add customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
