"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Copy, Download, Printer, Trash2, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/toast";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { btnPrimary, btnSecondary } from "@/lib/ui";
import type { DocumentRecord } from "@/types/document";

export function DocumentViewActions({ doc }: { doc: DocumentRecord }) {
  const router = useRouter();
  const toast = useToast();
  const [duplicating, setDuplicating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleDuplicate() {
    setDuplicating(true);
    try {
      const { document } = await api.post<{ document: { id: string; documentNumber: string } }>(
        `/api/documents/${doc.id}/duplicate`,
      );
      toast.success(`Duplicated as ${document.documentNumber}`);
      router.push(`/documents/${document.id}/edit`);
    } catch {
      toast.error("Couldn't duplicate this document.");
    } finally {
      setDuplicating(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/api/documents/${doc.id}`);
      toast.success("Document deleted.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Couldn't delete this document.");
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap no-print">
      <Link href="/dashboard" className={`${btnSecondary} !px-3`}>
        <ArrowLeft className="size-4" />
      </Link>
      <Link href={`/documents/${doc.id}/edit`} className={btnSecondary}>
        <Pencil className="size-4" /> Edit
      </Link>
      <button onClick={handleDuplicate} disabled={duplicating} className={btnSecondary}>
        {duplicating ? <Loader2 className="size-4 animate-spin" /> : <Copy className="size-4" />} Duplicate
      </button>
      <a href={`/api/documents/${doc.id}/pdf`} target="_blank" rel="noreferrer" className={btnSecondary}>
        <Printer className="size-4" /> Print
      </a>
      <a href={`/api/documents/${doc.id}/pdf`} className={btnPrimary}>
        <Download className="size-4" /> Download PDF
      </a>
      <button onClick={() => setConfirmOpen(true)} className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
        <Trash2 className="size-4" /> Delete
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete document?"
        message={`This will permanently delete ${doc.documentNumber}. This can't be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
