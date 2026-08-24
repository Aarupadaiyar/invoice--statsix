import type { DocumentInput } from "@/lib/validation";
import { calcDocumentTotals, calcLineTotal, formatCurrency } from "@/lib/calc";
import { formatDate, statusLabel } from "@/lib/format";

export function DocumentPreview({ doc }: { doc: DocumentInput }) {
  const totals = calcDocumentTotals(doc.lineItems, doc.extraCharge);
  const isInvoice = doc.documentType === "invoice";
  const b = doc.businessDetails;
  const c = doc.customerDetails;
  const balanceDue = Math.max(0, totals.total - (doc.amountPaid || 0));
  const hasPaymentInfo = Boolean(b.bankName || b.accountNumber || b.upiId || b.paymentLink);

  return (
    <div className="w-full max-w-[794px] mx-auto bg-white shadow-sm border border-black/5 text-[13px] text-[#1a1d23]">
      <div className="p-8 sm:p-12">
        <div className="flex flex-wrap justify-between gap-6 mb-8">
          <div className="max-w-[280px]">
            {b.logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.logoDataUrl} alt="Logo" className="h-16 max-w-[160px] object-contain mb-2" />
            ) : null}
            <p className="text-lg font-bold break-words">{b.businessName || "Your Business"}</p>
            {b.address ? <p className="text-black/50 text-xs mt-1 whitespace-pre-line">{b.address}</p> : null}
            {b.phone || b.email ? (
              <p className="text-black/50 text-xs mt-1">{[b.phone, b.email].filter(Boolean).join("  •  ")}</p>
            ) : null}
            {b.website ? <p className="text-black/50 text-xs">{b.website}</p> : null}
            {b.taxId ? <p className="text-black/50 text-xs">Tax ID: {b.taxId}</p> : null}
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold tracking-wide text-accent">
              {(doc.documentTitle || (isInvoice ? "Invoice" : "Receipt")).toUpperCase()}
            </p>
            <p className="font-semibold mt-1">{doc.documentNumber || "—"}</p>
            <div className="mt-2 text-xs space-y-0.5">
              <p>
                <span className="text-black/40">Issue Date: </span>
                {formatDate(doc.issueDate) || "—"}
              </p>
              {isInvoice && doc.dueDate ? (
                <p>
                  <span className="text-black/40">Due Date: </span>
                  {formatDate(doc.dueDate)}
                </p>
              ) : null}
              {!isInvoice && doc.paymentDate ? (
                <p>
                  <span className="text-black/40">Payment Date: </span>
                  {formatDate(doc.paymentDate)}
                </p>
              ) : null}
              {!isInvoice && doc.paymentMethod ? (
                <p>
                  <span className="text-black/40">Method: </span>
                  {statusLabel(doc.paymentMethod)}
                </p>
              ) : null}
            </div>
            <span className="inline-block mt-2 rounded-full bg-accent/10 text-accent text-xs font-semibold px-3 py-1 uppercase tracking-wide">
              {statusLabel(doc.status)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-6 mb-8">
          <div className="max-w-[280px]">
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-1.5">
              {isInvoice ? "Bill To" : "Received From / Customer"}
            </p>
            <p className="font-semibold">{c.name || "Customer name"}</p>
            {c.company ? <p className="text-black/50 text-xs">{c.company}</p> : null}
            {c.billingAddress ? <p className="text-black/50 text-xs whitespace-pre-line">{c.billingAddress}</p> : null}
            {c.email || c.phone ? <p className="text-black/50 text-xs">{[c.email, c.phone].filter(Boolean).join("  •  ")}</p> : null}
            {c.taxId ? <p className="text-black/50 text-xs">Tax ID: {c.taxId}</p> : null}
          </div>
          {isInvoice && c.shippingAddress ? (
            <div className="max-w-[280px]">
              <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-1.5">Ship To</p>
              <p className="text-black/60 text-xs whitespace-pre-line">{c.shippingAddress}</p>
            </div>
          ) : null}
        </div>

        <div className="mb-8 border-t border-black/10">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-black/[0.03] text-black/40 uppercase tracking-wide">
                <th className="text-left font-semibold px-2 py-2">Item</th>
                <th className="text-right font-semibold px-2 py-2 w-14">Qty</th>
                <th className="text-right font-semibold px-2 py-2 w-20">Rate</th>
                <th className="text-right font-semibold px-2 py-2 w-20">Discount</th>
                <th className="text-right font-semibold px-2 py-2 w-14">Tax</th>
                <th className="text-right font-semibold px-2 py-2 w-24">Amount</th>
              </tr>
            </thead>
            <tbody>
              {doc.lineItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-2 py-4 text-center text-black/30">
                    No line items yet
                  </td>
                </tr>
              ) : (
                doc.lineItems.map((item, idx) => (
                  <tr key={item.id || idx} className="border-b border-black/5">
                    <td className="px-2 py-2 align-top">
                      <p className="font-medium break-words">{item.name || "Untitled item"}</p>
                      {item.description ? (
                        <p className="text-black/40 text-[11px] mt-0.5 whitespace-pre-line break-words">{item.description}</p>
                      ) : null}
                    </td>
                    <td className="px-2 py-2 text-right align-top tabular-nums">{item.quantity}</td>
                    <td className="px-2 py-2 text-right align-top tabular-nums">{formatCurrency(item.rate, doc.currency)}</td>
                    <td className="px-2 py-2 text-right align-top tabular-nums">
                      {item.discount ? formatCurrency(item.discount, doc.currency) : "—"}
                    </td>
                    <td className="px-2 py-2 text-right align-top tabular-nums">{item.taxRate ? `${item.taxRate}%` : "—"}</td>
                    <td className="px-2 py-2 text-right align-top font-medium tabular-nums">
                      {formatCurrency(calcLineTotal(item), doc.currency)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-full max-w-[280px] text-sm">
            <div className="flex justify-between py-1">
              <span className="text-black/40">Subtotal</span>
              <span className="font-medium tabular-nums">{formatCurrency(totals.subtotal, doc.currency)}</span>
            </div>
            {totals.discountTotal > 0 ? (
              <div className="flex justify-between py-1">
                <span className="text-black/40">Discount</span>
                <span className="font-medium tabular-nums">-{formatCurrency(totals.discountTotal, doc.currency)}</span>
              </div>
            ) : null}
            {totals.taxTotal > 0 ? (
              <div className="flex justify-between py-1">
                <span className="text-black/40">Tax</span>
                <span className="font-medium tabular-nums">{formatCurrency(totals.taxTotal, doc.currency)}</span>
              </div>
            ) : null}
            {totals.shippingTotal > 0 ? (
              <div className="flex justify-between py-1">
                <span className="text-black/40">Shipping / Other</span>
                <span className="font-medium tabular-nums">{formatCurrency(totals.shippingTotal, doc.currency)}</span>
              </div>
            ) : null}
            <div className="flex justify-between pt-2 mt-1 border-t border-black/70">
              <span className="font-semibold">{isInvoice ? "Total Due" : "Total Paid"}</span>
              <span className="font-bold text-accent text-base tabular-nums">{formatCurrency(totals.total, doc.currency)}</span>
            </div>
            {isInvoice && doc.amountPaid > 0 ? (
              <>
                <div className="flex justify-between py-1">
                  <span className="text-black/40">Amount Paid</span>
                  <span className="font-medium tabular-nums">-{formatCurrency(doc.amountPaid, doc.currency)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-black/40">Balance Due</span>
                  <span className="font-medium tabular-nums">{formatCurrency(balanceDue, doc.currency)}</span>
                </div>
              </>
            ) : null}
            {!isInvoice ? (
              <div className="mt-3 text-right">
                <span className="inline-block rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs tracking-wide px-3 py-1.5">
                  PAYMENT RECEIVED
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {hasPaymentInfo ? (
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-1.5">Payment Information</p>
            <div className="text-xs text-black/60 space-y-0.5">
              {b.bankName ? <p>Bank: {b.bankName}</p> : null}
              {b.accountHolderName ? <p>Account Name: {b.accountHolderName}</p> : null}
              {b.accountNumber ? <p>Account No: {b.accountNumber}</p> : null}
              {b.ifscCode ? <p>IFSC: {b.ifscCode}</p> : null}
              {b.swiftCode ? <p>SWIFT: {b.swiftCode}</p> : null}
              {b.upiId ? <p>UPI: {b.upiId}</p> : null}
              {b.paymentLink ? <p>Pay online: {b.paymentLink}</p> : null}
            </div>
          </div>
        ) : null}

        {doc.notes ? (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-1">Notes</p>
            <p className="text-xs text-black/60 whitespace-pre-line">{doc.notes}</p>
          </div>
        ) : null}

        {doc.terms ? (
          <div className="mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40 mb-1">Terms &amp; Conditions</p>
            <p className="text-xs text-black/60 whitespace-pre-line">{doc.terms}</p>
          </div>
        ) : null}

        <div className="mt-8 pt-4 border-t border-black/10 text-[10px] text-black/30 text-center">
          {b.businessName || "Statsix Invoice"}
        </div>
      </div>
    </div>
  );
}
