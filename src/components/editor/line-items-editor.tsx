"use client";

import { Plus, Trash2 } from "lucide-react";
import { emptyLineItem, type LineItem } from "@/types/document";
import { calcLineTotal, formatCurrency } from "@/lib/calc";
import { inputClass, labelClass } from "@/lib/ui";

export function LineItemsEditor({
  items,
  currency,
  onChange,
}: {
  items: LineItem[];
  currency: string;
  onChange: (items: LineItem[]) => void;
}) {
  function update(id: string, patch: Partial<LineItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function remove(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function add() {
    onChange([...items, emptyLineItem()]);
  }

  function numberField(raw: string): number {
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : 0;
  }

  return (
    <div>
      <div className="hidden md:grid grid-cols-[1fr_70px_90px_90px_70px_100px_32px] gap-2 px-1 pb-2 text-xs font-medium uppercase tracking-wide text-black/40">
        <span>Item &amp; description</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Rate</span>
        <span className="text-right">Discount</span>
        <span className="text-right">Tax %</span>
        <span className="text-right">Amount</span>
        <span />
      </div>

      <div className="space-y-3 md:space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-2 md:grid-cols-[1fr_70px_90px_90px_70px_100px_32px] gap-x-2 gap-y-2 md:items-center rounded-lg border border-black/5 md:border-0 p-3 md:p-0"
          >
            <div className="col-span-2 md:col-span-1 md:self-start space-y-1.5">
              <input
                className={inputClass}
                placeholder="Item or service name"
                value={item.name}
                onChange={(e) => update(item.id, { name: e.target.value })}
              />
              <textarea
                className={`${inputClass} resize-y`}
                placeholder="Description (optional)"
                rows={2}
                value={item.description}
                onChange={(e) => update(item.id, { description: e.target.value })}
              />
            </div>

            <div className="col-span-2 md:contents grid grid-cols-2 gap-2 md:gap-0">
              <div>
                <label className={`md:hidden ${labelClass}`}>Qty</label>
                <input
                  type="number"
                  className={`${inputClass} text-right`}
                  value={item.quantity}
                  min={0}
                  step="any"
                  onChange={(e) => update(item.id, { quantity: numberField(e.target.value) })}
                />
              </div>
              <div>
                <label className={`md:hidden ${labelClass}`}>Rate</label>
                <input
                  type="number"
                  className={`${inputClass} text-right`}
                  value={item.rate}
                  min={0}
                  step="any"
                  onChange={(e) => update(item.id, { rate: numberField(e.target.value) })}
                />
              </div>
              <div>
                <label className={`md:hidden ${labelClass}`}>Discount</label>
                <input
                  type="number"
                  className={`${inputClass} text-right`}
                  value={item.discount}
                  min={0}
                  step="any"
                  onChange={(e) => update(item.id, { discount: numberField(e.target.value) })}
                />
              </div>
              <div>
                <label className={`md:hidden ${labelClass}`}>Tax %</label>
                <input
                  type="number"
                  className={`${inputClass} text-right`}
                  value={item.taxRate}
                  min={0}
                  step="any"
                  onChange={(e) => update(item.id, { taxRate: numberField(e.target.value) })}
                />
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 md:contents flex items-center justify-between md:justify-end gap-3">
              <span className="md:hidden text-xs font-medium uppercase tracking-wide text-black/40">Amount</span>
              <div className="font-medium text-sm tabular-nums text-right">{formatCurrency(calcLineTotal(item), currency)}</div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                title="Remove item"
                className="flex items-center justify-center text-black/30 hover:text-red-600"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        <Plus className="size-4" /> Add line item
      </button>
    </div>
  );
}
