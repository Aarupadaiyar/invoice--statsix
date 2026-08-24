import Decimal from "decimal.js";
import type { DocumentTotals, ExtraCharge, LineItem } from "@/types/document";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

function d(value: number | string | undefined | null): Decimal {
  if (value === undefined || value === null || value === "" || Number.isNaN(value)) return new Decimal(0);
  const dec = new Decimal(value);
  return dec.isFinite() ? dec : new Decimal(0);
}

function round2(value: Decimal): number {
  return value.toDecimalPlaces(2).toNumber();
}

/** Line Total = Quantity x Rate - Line Discount (clamped to zero minimum). */
export function calcLineTotal(item: Pick<LineItem, "quantity" | "rate" | "discount">): number {
  const base = d(item.quantity).mul(d(item.rate));
  const total = base.minus(d(item.discount));
  return round2(total.isNegative() ? new Decimal(0) : total);
}

export function calcLineTax(item: Pick<LineItem, "quantity" | "rate" | "discount" | "taxRate">): number {
  const lineTotal = d(calcLineTotal(item));
  return round2(lineTotal.mul(d(item.taxRate)).div(100));
}

/**
 * Centralized calculation engine used identically by the live preview and the PDF renderer.
 * Order: line totals -> subtotal (line discounts already netted in) -> document-level discount
 * -> tax (sum of line taxes + extra tax) -> shipping -> grand total.
 */
export function calcDocumentTotals(lineItems: LineItem[], extra: ExtraCharge): DocumentTotals {
  let subtotal = new Decimal(0);
  let lineDiscountTotal = new Decimal(0);
  let lineTaxTotal = new Decimal(0);

  for (const item of lineItems) {
    subtotal = subtotal.plus(d(calcLineTotal(item)));
    lineDiscountTotal = lineDiscountTotal.plus(d(item.quantity).mul(d(item.rate)).minus(d(calcLineTotal(item))));
    lineTaxTotal = lineTaxTotal.plus(d(calcLineTax(item)));
  }

  const extraDiscountAmount =
    extra.discountType === "percent" ? subtotal.mul(d(extra.discountValue)).div(100) : d(extra.discountValue);

  const discountTotal = extraDiscountAmount.isNegative() ? new Decimal(0) : extraDiscountAmount;
  const taxTotal = lineTaxTotal.plus(d(extra.extraTax));
  const shippingTotal = d(extra.shipping);

  const grandTotal = subtotal.minus(discountTotal).plus(taxTotal).plus(shippingTotal);

  return {
    subtotal: round2(subtotal),
    lineDiscountTotal: round2(lineDiscountTotal),
    discountTotal: round2(discountTotal),
    taxTotal: round2(taxTotal),
    shippingTotal: round2(shippingTotal),
    total: round2(grandTotal.isNegative() ? new Decimal(0) : grandTotal),
  };
}

export function formatCurrency(amount: number, currency: string): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      currencyDisplay: "symbol",
    }).format(safeAmount);
  } catch {
    return `${currency} ${safeAmount.toFixed(2)}`;
  }
}

export function sanitizeNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : fallback;
}
