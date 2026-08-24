"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import type { BusinessProfileRecord } from "@/lib/data/mappers";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/toast";
import { LogoUpload } from "@/components/logo-upload";
import { inputClass, labelClass, btnPrimary, cardClass } from "@/lib/ui";
import { CURRENCIES } from "@/types/document";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className={`${cardClass} p-6`}>
      <h2 className="font-semibold">{title}</h2>
      {description ? <p className="text-sm text-black/40 mt-0.5 mb-5">{description}</p> : <div className="mb-5" />}
      <div className="grid sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

export function BusinessProfileForm({ initialProfile }: { initialProfile: BusinessProfileRecord }) {
  const [profile, setProfile] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  function set<K extends keyof BusinessProfileRecord>(key: K, value: BusinessProfileRecord[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { profile: saved } = await api.put<{ profile: BusinessProfileRecord }>("/api/business-profile", profile);
      setProfile(saved);
      toast.success("Business profile saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save your business profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className={`${cardClass} p-6`}>
        <h2 className="font-semibold mb-1">Company Details</h2>
        <p className="text-sm text-black/40 mb-5">Shown on every invoice and receipt you create.</p>
        <div className="mb-5">
          <label className={labelClass}>Logo</label>
          <LogoUpload value={profile.logoDataUrl} onChange={(v) => set("logoDataUrl", v)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Business name">
            <input className={inputClass} value={profile.businessName} onChange={(e) => set("businessName", e.target.value)} />
          </Field>
          <Field label="Tax / GST / VAT number">
            <input className={inputClass} value={profile.taxId} onChange={(e) => set("taxId", e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className={inputClass} value={profile.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="Email">
            <input type="email" className={inputClass} value={profile.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Website">
            <input className={inputClass} value={profile.website} onChange={(e) => set("website", e.target.value)} />
          </Field>
          <Field label="Address">
            <input className={inputClass} value={profile.address} onChange={(e) => set("address", e.target.value)} />
          </Field>
        </div>
      </div>

      <Section title="Payment Details" description="Bank and online payment info shown on invoices for easy payment.">
        <Field label="Bank name">
          <input className={inputClass} value={profile.bankName} onChange={(e) => set("bankName", e.target.value)} />
        </Field>
        <Field label="Account holder name">
          <input
            className={inputClass}
            value={profile.accountHolderName}
            onChange={(e) => set("accountHolderName", e.target.value)}
          />
        </Field>
        <Field label="Account number">
          <input className={inputClass} value={profile.accountNumber} onChange={(e) => set("accountNumber", e.target.value)} />
        </Field>
        <Field label="IFSC code">
          <input className={inputClass} value={profile.ifscCode} onChange={(e) => set("ifscCode", e.target.value)} />
        </Field>
        <Field label="SWIFT / BIC code">
          <input className={inputClass} value={profile.swiftCode} onChange={(e) => set("swiftCode", e.target.value)} />
        </Field>
        <Field label="UPI ID">
          <input className={inputClass} value={profile.upiId} onChange={(e) => set("upiId", e.target.value)} />
        </Field>
        <Field label="Payment link (Razorpay, PayPal, Stripe, etc.)">
          <input className={inputClass} value={profile.paymentLink} onChange={(e) => set("paymentLink", e.target.value)} />
        </Field>
      </Section>

      <Section title="Defaults" description="Applied automatically to every new document — you can still edit per-document.">
        <Field label="Default currency">
          <select className={inputClass} value={profile.defaultCurrency} onChange={(e) => set("defaultCurrency", e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Default payment terms">
          <input
            className={inputClass}
            value={profile.defaultPaymentTerms}
            onChange={(e) => set("defaultPaymentTerms", e.target.value)}
          />
        </Field>
        <Field label="Invoice number prefix">
          <input className={inputClass} value={profile.invoicePrefix} onChange={(e) => set("invoicePrefix", e.target.value)} />
        </Field>
        <Field label="Receipt number prefix">
          <input className={inputClass} value={profile.receiptPrefix} onChange={(e) => set("receiptPrefix", e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Default notes">
            <textarea
              className={inputClass}
              rows={3}
              value={profile.defaultNotes}
              onChange={(e) => set("defaultNotes", e.target.value)}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Default terms & conditions">
            <textarea
              className={inputClass}
              rows={3}
              value={profile.defaultTerms}
              onChange={(e) => set("defaultTerms", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save business profile
        </button>
      </div>
    </form>
  );
}
