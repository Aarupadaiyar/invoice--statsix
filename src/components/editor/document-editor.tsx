"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Download, Printer, Loader2, Info } from "lucide-react";
import type { DocumentType, ExtraCharge, LineItem } from "@/types/document";
import { emptyLineItem, PAYMENT_METHODS, CURRENCIES } from "@/types/document";
import type { BusinessProfileRecord, CustomerRecord } from "@/lib/data/mappers";
import { documentSchema, type DocumentInput } from "@/lib/validation";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/toast";
import { toDateInputValue } from "@/lib/format";
import { inputClass, labelClass, btnPrimary, btnSecondary, cardClass } from "@/lib/ui";
import { LineItemsEditor } from "@/components/editor/line-items-editor";
import { CustomerPicker } from "@/components/editor/customer-picker";
import { DocumentPreview } from "@/components/document-preview";

const INVOICE_STATUSES = ["draft", "sent", "paid", "overdue", "cancelled"];
const RECEIPT_STATUSES = ["draft", "received"];

function draftKey(type: DocumentType, id: string | null) {
  return `invoicely:draft:${type}:${id ?? "new"}`;
}

/**
 * Order-independent stringify. Postgres jsonb doesn't preserve key insertion
 * order, so a plain JSON.stringify comparison against server-loaded data
 * produces false negatives even when the content is identical.
 */
function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const keys = Object.keys(value as Record<string, unknown>).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify((value as Record<string, unknown>)[k])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function buildInitialValue(opts: {
  type: DocumentType;
  profile: BusinessProfileRecord;
  suggestedNumber: string;
  existing: DocumentInput | null;
}): DocumentInput {
  if (opts.existing) return opts.existing;

  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 14);

  return {
    documentType: opts.type,
    documentNumber: opts.suggestedNumber,
    status: "draft",
    issueDate: today.toISOString().slice(0, 10),
    dueDate: opts.type === "invoice" ? due.toISOString().slice(0, 10) : null,
    paymentDate: opts.type === "receipt" ? today.toISOString().slice(0, 10) : null,
    paymentMethod: opts.type === "receipt" ? "cash" : null,
    currency: opts.profile.defaultCurrency || "USD",
    customerId: null,
    businessDetails: {
      businessName: opts.profile.businessName,
      logoDataUrl: opts.profile.logoDataUrl,
      address: opts.profile.address,
      phone: opts.profile.phone,
      email: opts.profile.email,
      website: opts.profile.website,
      taxId: opts.profile.taxId,
      bankName: opts.profile.bankName,
      accountHolderName: opts.profile.accountHolderName,
      accountNumber: opts.profile.accountNumber,
      ifscCode: opts.profile.ifscCode,
      swiftCode: opts.profile.swiftCode,
      upiId: opts.profile.upiId,
      paymentLink: opts.profile.paymentLink,
    },
    customerDetails: { name: "", company: "", email: "", phone: "", billingAddress: "", shippingAddress: "", taxId: "" },
    lineItems: [emptyLineItem()],
    extraCharge: { discountType: "flat", discountValue: 0, extraTax: 0, shipping: 0 },
    amountPaid: 0,
    notes: opts.profile.defaultNotes,
    terms: opts.profile.defaultTerms || opts.profile.defaultPaymentTerms,
  };
}

export function DocumentEditor({
  type,
  documentId,
  profile,
  customers,
  suggestedNumber,
  existing,
}: {
  type: DocumentType;
  documentId: string | null;
  profile: BusinessProfileRecord;
  customers: CustomerRecord[];
  suggestedNumber: string;
  existing: DocumentInput | null;
}) {
  const router = useRouter();
  const toast = useToast();
  const [id, setId] = useState(documentId);
  const [value, setValue] = useState<DocumentInput>(() => buildInitialValue({ type, profile, suggestedNumber, existing }));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [draftRestored, setDraftRestored] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    try {
      const raw = localStorage.getItem(draftKey(type, id));
      if (!raw) return;
      const parsed = JSON.parse(raw) as DocumentInput;
      if (existing && stableStringify(parsed) === stableStringify(existing)) {
        // Draft matches what's already saved (e.g. a redirect right after save
        // raced the autosave timer) — nothing to actually restore.
        localStorage.removeItem(draftKey(type, id));
        return;
      }
      // Restoring from localStorage (an external system unavailable during SSR) is
      // exactly the documented exception for setState-in-effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(parsed);
      setDraftRestored(true);
    } catch {
      // ignore corrupt draft
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(draftKey(type, id), JSON.stringify(value));
      } catch {
        // storage unavailable/full — non-fatal, autosave is best-effort
      }
    }, 500);
    return () => clearTimeout(t);
  }, [value, type, id]);

  function set<K extends keyof DocumentInput>(key: K, patch: DocumentInput[K]) {
    setValue((prev) => ({ ...prev, [key]: patch }));
  }

  function setLineItems(items: LineItem[]) {
    set("lineItems", items);
  }

  function setExtraCharge(patch: Partial<ExtraCharge>) {
    set("extraCharge", { ...value.extraCharge, ...patch });
  }

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(draftKey(type, id));
    } catch {
      // ignore
    }
  }, [type, id]);

  async function handleSave(): Promise<string | null> {
    const parsed = documentSchema.safeParse(value);
    if (!parsed.success) {
      setErrors(parsed.error.issues[0]?.message ?? "Please check the highlighted fields.");
      toast.error(parsed.error.issues[0]?.message ?? "Please check the highlighted fields.");
      return null;
    }
    setErrors(null);
    setSaving(true);
    try {
      if (id) {
        await api.put<{ document: { id: string } }>(`/api/documents/${id}`, parsed.data);
        toast.success("Changes saved.");
        clearDraft();
        router.refresh();
        return id;
      } else {
        const { document } = await api.post<{ document: { id: string } }>("/api/documents", parsed.data);
        clearDraft();
        toast.success(`${type === "invoice" ? "Invoice" : "Receipt"} saved.`);
        setId(document.id);
        router.replace(`/documents/${document.id}/edit`);
        router.refresh();
        return document.id;
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't save this document. Please try again.";
      setErrors(message);
      toast.error(message);
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function handleDownload() {
    const targetId = id ?? (await ensureSavedForExport());
    if (!targetId) return;
    window.open(`/api/documents/${targetId}/pdf`, "_blank");
  }

  async function handlePrint() {
    const targetId = id ?? (await ensureSavedForExport());
    if (!targetId) return;
    window.open(`/api/documents/${targetId}/pdf`, "_blank");
  }

  async function ensureSavedForExport(): Promise<string | null> {
    const savedId = await handleSave();
    if (!savedId) {
      toast.info("Fix the errors above, then save before exporting.");
      return null;
    }
    return savedId;
  }

  const statusOptions = type === "invoice" ? INVOICE_STATUSES : RECEIPT_STATUSES;
  const currencySymbolList = CURRENCIES.map((c) => c.code);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-white border-b border-black/5 no-print">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-3 max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-black/5 shrink-0">
              <ArrowLeft className="size-4.5" />
            </Link>
            <div className="min-w-0">
              <h1 className="font-semibold truncate">
                {id ? "Edit" : "New"} {type === "invoice" ? "Invoice" : "Receipt"}
              </h1>
              <p className="text-xs text-black/40 truncate">{value.documentNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handlePrint} className={`${btnSecondary} hidden sm:inline-flex`}>
              <Printer className="size-4" /> Print
            </button>
            <button onClick={handleDownload} className={btnSecondary}>
              <Download className="size-4" /> <span className="hidden sm:inline">Download</span> PDF
            </button>
            <button onClick={handleSave} disabled={saving} className={btnPrimary}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save
            </button>
          </div>
        </div>
        <div className="lg:hidden flex border-t border-black/5">
          <button
            onClick={() => setMobileTab("edit")}
            className={`flex-1 py-2.5 text-sm font-medium ${mobileTab === "edit" ? "text-accent border-b-2 border-accent" : "text-black/40"}`}
          >
            Edit
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`flex-1 py-2.5 text-sm font-medium ${mobileTab === "preview" ? "text-accent border-b-2 border-accent" : "text-black/40"}`}
          >
            Preview
          </button>
        </div>
      </header>

      {draftRestored ? (
        <div className="bg-amber-50 text-amber-800 text-sm px-4 sm:px-6 py-2 flex items-center gap-2 no-print">
          <Info className="size-4 shrink-0" />
          Restored unsaved changes from your last session.
          <button
            className="ml-auto underline font-medium"
            onClick={() => {
              clearDraft();
              setDraftRestored(false);
              setValue(buildInitialValue({ type, profile, suggestedNumber, existing }));
            }}
          >
            Discard
          </button>
        </div>
      ) : null}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 max-w-[1600px] mx-auto w-full min-w-0">
        <div className={`min-w-0 p-4 sm:p-6 space-y-5 ${mobileTab === "preview" ? "hidden lg:block" : ""}`}>
          {errors ? <div className="rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3">{errors}</div> : null}

          <section className={`${cardClass} p-5`}>
            <h2 className="font-semibold mb-4">Document Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{type === "invoice" ? "Invoice" : "Receipt"} number</label>
                <input className={inputClass} value={value.documentNumber} onChange={(e) => set("documentNumber", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select className={inputClass} value={value.status} onChange={(e) => set("status", e.target.value)}>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Issue date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={toDateInputValue(value.issueDate)}
                  onChange={(e) => set("issueDate", e.target.value)}
                />
              </div>
              {type === "invoice" ? (
                <div>
                  <label className={labelClass}>Due date</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={toDateInputValue(value.dueDate)}
                    onChange={(e) => set("dueDate", e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className={labelClass}>Payment date</label>
                    <input
                      type="date"
                      className={inputClass}
                      value={toDateInputValue(value.paymentDate)}
                      onChange={(e) => set("paymentDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Payment method</label>
                    <select
                      className={inputClass}
                      value={value.paymentMethod ?? "cash"}
                      onChange={(e) => set("paymentMethod", e.target.value)}
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className={labelClass}>Currency</label>
                <select className={inputClass} value={value.currency} onChange={(e) => set("currency", e.target.value)}>
                  {currencySymbolList.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Business Information</h2>
              <Link href="/settings/business" className="text-xs text-accent hover:underline">
                Edit saved profile
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Business name</label>
                <input
                  className={inputClass}
                  value={value.businessDetails.businessName}
                  onChange={(e) => set("businessDetails", { ...value.businessDetails, businessName: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  className={inputClass}
                  value={value.businessDetails.phone}
                  onChange={(e) => set("businessDetails", { ...value.businessDetails, phone: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  className={inputClass}
                  value={value.businessDetails.email}
                  onChange={(e) => set("businessDetails", { ...value.businessDetails, email: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Address</label>
                <input
                  className={inputClass}
                  value={value.businessDetails.address}
                  onChange={(e) => set("businessDetails", { ...value.businessDetails, address: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section className={`${cardClass} p-5`}>
            <h2 className="font-semibold mb-4">Customer Information</h2>
            <CustomerPicker
              customers={customers}
              customerId={value.customerId ?? null}
              details={value.customerDetails}
              onSelect={(customerId, details) => {
                set("customerId", customerId);
                set("customerDetails", details);
              }}
              onDetailsChange={(details) => set("customerDetails", details)}
            />
          </section>

          <section className={`${cardClass} p-5`}>
            <h2 className="font-semibold mb-4">Line Items</h2>
            <LineItemsEditor items={value.lineItems} currency={value.currency} onChange={setLineItems} />
          </section>

          <section className={`${cardClass} p-5`}>
            <h2 className="font-semibold mb-4">Charges</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Additional discount</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className={inputClass}
                    value={value.extraCharge.discountValue}
                    min={0}
                    step="any"
                    onChange={(e) => setExtraCharge({ discountValue: parseFloat(e.target.value) || 0 })}
                  />
                  <select
                    className={`${inputClass} w-24`}
                    value={value.extraCharge.discountType}
                    onChange={(e) => setExtraCharge({ discountType: e.target.value as "flat" | "percent" })}
                  >
                    <option value="flat">Flat</option>
                    <option value="percent">%</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Extra tax (amount)</label>
                <input
                  type="number"
                  className={inputClass}
                  value={value.extraCharge.extraTax}
                  min={0}
                  step="any"
                  onChange={(e) => setExtraCharge({ extraTax: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className={labelClass}>Shipping / other charges</label>
                <input
                  type="number"
                  className={inputClass}
                  value={value.extraCharge.shipping}
                  min={0}
                  step="any"
                  onChange={(e) => setExtraCharge({ shipping: parseFloat(e.target.value) || 0 })}
                />
              </div>
              {type === "invoice" ? (
                <div>
                  <label className={labelClass}>Amount already paid</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={value.amountPaid}
                    min={0}
                    step="any"
                    onChange={(e) => set("amountPaid", parseFloat(e.target.value) || 0)}
                  />
                </div>
              ) : null}
            </div>
          </section>

          <section className={`${cardClass} p-5`}>
            <h2 className="font-semibold mb-4">Notes &amp; Terms</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Notes</label>
                <textarea className={inputClass} rows={3} value={value.notes} onChange={(e) => set("notes", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Terms &amp; conditions</label>
                <textarea className={inputClass} rows={3} value={value.terms} onChange={(e) => set("terms", e.target.value)} />
              </div>
            </div>
          </section>
        </div>

        <div
          className={`min-w-0 overflow-x-auto bg-black/[0.02] p-4 sm:p-6 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto ${mobileTab === "edit" ? "hidden lg:block" : ""}`}
        >
          <DocumentPreview doc={value} />
        </div>
      </div>
    </div>
  );
}
