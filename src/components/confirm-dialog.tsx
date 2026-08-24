"use client";

import { AlertTriangle } from "lucide-react";
import { btnDanger, btnSecondary } from "@/lib/ui";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-4 no-print" onClick={onCancel}>
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-3">
          <div className="size-10 shrink-0 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="size-5 text-red-600" />
          </div>
          <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-black/60">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button className={btnSecondary} onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            className={`${btnDanger} bg-red-600 !text-white hover:bg-red-700 hover:!text-white px-4 py-2`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
