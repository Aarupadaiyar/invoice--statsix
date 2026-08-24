"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Eye, Pencil, Copy, Download, Trash2, FileText, Loader2 } from "lucide-react";
import type { DocumentRecord, DocumentType } from "@/types/document";
import { formatCurrency } from "@/lib/calc";
import { formatDate } from "@/lib/format";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/toast";
import { StatusBadge } from "@/components/status-badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { inputClass } from "@/lib/ui";

const STATUS_OPTIONS = ["draft", "sent", "paid", "overdue", "cancelled", "received"];

export function DocumentsExplorer({ initialDocuments }: { initialDocuments: DocumentRecord[] }) {
  const router = useRouter();
  const toast = useToast();
  const [documents, setDocuments] = useState(initialDocuments);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"all" | DocumentType>("all");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pendingDelete, setPendingDelete] = useState<DocumentRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      if (type !== "all") params.set("type", type);
      if (status !== "all") params.set("status", status);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      const data = await api.get<{ documents: DocumentRecord[] }>(`/api/documents?${params.toString()}`);
      setDocuments(data.documents);
    } catch {
      toast.error("Couldn't load documents. Please try again.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, type, status, dateFrom, dateTo]);

  useEffect(() => {
    const t = setTimeout(fetchDocuments, 300);
    return () => clearTimeout(t);
  }, [fetchDocuments]);

  const hasFilters = useMemo(
    () => search || type !== "all" || status !== "all" || dateFrom || dateTo,
    [search, type, status, dateFrom, dateTo],
  );

  async function handleDuplicate(doc: DocumentRecord) {
    setDuplicatingId(doc.id);
    try {
      const { document } = await api.post<{ document: DocumentRecord }>(`/api/documents/${doc.id}/duplicate`);
      toast.success(`Duplicated as ${document.documentNumber}`);
      router.push(`/documents/${document.id}/edit`);
    } catch {
      toast.error("Couldn't duplicate this document.");
    } finally {
      setDuplicatingId(null);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/documents/${pendingDelete.id}`);
      setDocuments((prev) => prev.filter((d) => d.id !== pendingDelete.id));
      toast.success("Document deleted.");
      setPendingDelete(null);
    } catch {
      toast.error("Couldn't delete this document.");
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
            placeholder="Search by document # or customer…"
            className={`${inputClass} pl-9`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className={inputClass + " sm:w-40"} value={type} onChange={(e) => setType(e.target.value as "all" | DocumentType)}>
          <option value="all">All types</option>
          <option value="invoice">Invoices</option>
          <option value="receipt">Receipts</option>
        </select>
        <select className={inputClass + " sm:w-40"} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <input type="date" className={inputClass + " sm:w-40"} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <input type="date" className={inputClass + " sm:w-40"} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      </div>

      <div className="rounded-xl border border-black/5 bg-white overflow-hidden">
        {loading ? (
          <div className="p-10 flex items-center justify-center text-black/40">
            <Loader2 className="size-5 animate-spin mr-2" /> Loading documents…
          </div>
        ) : documents.length === 0 ? (
          <div className="p-14 text-center">
            <FileText className="size-10 mx-auto text-black/15 mb-3" />
            <p className="font-medium">{hasFilters ? "No documents match your filters" : "No documents yet"}</p>
            <p className="text-sm text-black/40 mt-1">
              {hasFilters ? "Try adjusting your search or filters." : "Create your first invoice or receipt to get started."}
            </p>
            {!hasFilters ? (
              <Link href="/documents/new/invoice" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
                Create an invoice →
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 text-left text-black/40 text-xs uppercase tracking-wide">
                  <th className="px-4 py-3 font-medium">Document #</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{doc.documentNumber}</td>
                    <td className="px-4 py-3 capitalize text-black/60">{doc.documentType}</td>
                    <td className="px-4 py-3 max-w-[180px] truncate">{doc.customerDetails.name || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-black/60">{formatDate(doc.issueDate)}</td>
                    <td className="px-4 py-3 text-right font-medium whitespace-nowrap">
                      {formatCurrency(doc.total, doc.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/documents/${doc.id}`} title="View" className="p-1.5 rounded hover:bg-black/5 text-black/50">
                          <Eye className="size-4" />
                        </Link>
                        <Link
                          href={`/documents/${doc.id}/edit`}
                          title="Edit"
                          className="p-1.5 rounded hover:bg-black/5 text-black/50"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <button
                          title="Duplicate"
                          disabled={duplicatingId === doc.id}
                          onClick={() => handleDuplicate(doc)}
                          className="p-1.5 rounded hover:bg-black/5 text-black/50 disabled:opacity-40"
                        >
                          {duplicatingId === doc.id ? <Loader2 className="size-4 animate-spin" /> : <Copy className="size-4" />}
                        </button>
                        <a
                          href={`/api/documents/${doc.id}/pdf`}
                          title="Download PDF"
                          className="p-1.5 rounded hover:bg-black/5 text-black/50"
                        >
                          <Download className="size-4" />
                        </a>
                        <button
                          title="Delete"
                          onClick={() => setPendingDelete(doc)}
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

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete document?"
        message={`This will permanently delete ${pendingDelete?.documentNumber ?? "this document"}. This can't be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
