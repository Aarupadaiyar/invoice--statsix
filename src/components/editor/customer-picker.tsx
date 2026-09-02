"use client";

import { useState } from "react";
import { UserSearch } from "lucide-react";
import type { CustomerRecord } from "@/lib/data/mappers";
import type { CustomerDetails } from "@/types/document";
import { inputClass, labelClass } from "@/lib/ui";
import { LogoUpload } from "@/components/logo-upload";

export function CustomerPicker({
  customers,
  customerId,
  details,
  onSelect,
  onDetailsChange,
}: {
  customers: CustomerRecord[];
  customerId: string | null;
  details: CustomerDetails;
  onSelect: (customerId: string | null, details: CustomerDetails) => void;
  onDetailsChange: (details: CustomerDetails) => void;
}) {
  const [mode, setMode] = useState<"existing" | "new">(customers.length > 0 && customerId ? "existing" : customers.length > 0 ? "existing" : "new");

  function set<K extends keyof CustomerDetails>(key: K, value: CustomerDetails[K]) {
    onDetailsChange({ ...details, [key]: value });
  }

  return (
    <div>
      {customers.length > 0 ? (
        <div className="flex gap-1 mb-4 rounded-lg bg-black/5 p-1 w-fit text-sm">
          <button
            type="button"
            onClick={() => setMode("existing")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${mode === "existing" ? "bg-white shadow-sm" : "text-black/50"}`}
          >
            Existing customer
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("new");
              onSelect(null, details);
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition ${mode === "new" ? "bg-white shadow-sm" : "text-black/50"}`}
          >
            New customer
          </button>
        </div>
      ) : null}

      {mode === "existing" && customers.length > 0 ? (
        <div className="mb-4">
          <label className={labelClass}>Select customer</label>
          <div className="relative">
            <UserSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-black/30" />
            <select
              className={`${inputClass} pl-9`}
              value={customerId ?? ""}
              onChange={(e) => {
                const selected = customers.find((c) => c.id === e.target.value);
                if (!selected) {
                  onSelect(null, details);
                  return;
                }
                onSelect(selected.id, {
                  name: selected.name,
                  company: selected.company,
                  email: selected.email,
                  phone: selected.phone,
                  billingAddress: selected.billingAddress,
                  shippingAddress: selected.shippingAddress,
                  taxId: selected.taxId,
                  logoDataUrl: selected.logoDataUrl,
                });
              }}
            >
              <option value="">Choose a customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.company ? `(${c.company})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <div className="mb-4">
        <label className={labelClass}>Logo (optional)</label>
        <LogoUpload value={details.logoDataUrl} onChange={(v) => set("logoDataUrl", v)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Customer name</label>
          <input className={inputClass} value={details.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Company name</label>
          <input className={inputClass} value={details.company} onChange={(e) => set("company", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" className={inputClass} value={details.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input className={inputClass} value={details.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Tax / GST / VAT number</label>
          <input className={inputClass} value={details.taxId} onChange={(e) => set("taxId", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Billing address</label>
          <textarea
            className={inputClass}
            rows={2}
            value={details.billingAddress}
            onChange={(e) => set("billingAddress", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Shipping address</label>
          <textarea
            className={inputClass}
            rows={2}
            value={details.shippingAddress}
            onChange={(e) => set("shippingAddress", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
