"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
type Toast = { id: number; kind: ToastKind; message: string };

const ToastContext = createContext<{ show: (kind: ToastKind, message: string) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return {
    success: (message: string) => ctx.show("success", message),
    error: (message: string) => ctx.show("error", message),
    info: (message: string) => ctx.show("info", message),
  };
}

const ICONS: Record<ToastKind, React.ReactNode> = {
  success: <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0" />,
  error: <XCircle className="size-4.5 text-red-600 shrink-0" />,
  info: <Info className="size-4.5 text-accent shrink-0" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const show = useCallback((kind: ToastKind, message: string) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm no-print">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-start gap-2 rounded-lg border border-black/5 bg-white shadow-lg px-4 py-3 text-sm"
          >
            {ICONS[t.kind]}
            <p className="flex-1 leading-snug">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-black/30 hover:text-black/60">
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
