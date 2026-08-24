import { Document, Page, View, Text, Image, StyleSheet, Font } from "@react-pdf/renderer";
import type { DocumentRecord } from "@/types/document";
import { calcDocumentTotals, calcLineTotal, formatCurrency } from "@/lib/calc";
import { formatDate, statusLabel } from "@/lib/format";

Font.registerHyphenationCallback((word) => [word]);

const COLORS = {
  ink: "#1a1d23",
  muted: "#6b7280",
  border: "#e2e5eb",
  panel: "#f6f7f9",
  accent: "#2d5bff",
  accentSoft: "#eef1ff",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 40,
    fontSize: 9.5,
    color: COLORS.ink,
    fontFamily: "Helvetica",
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  logo: { width: 88, height: 88, objectFit: "contain", marginBottom: 8 },
  businessName: { fontSize: 15, fontWeight: 700, marginBottom: 4 },
  mutedLine: { color: COLORS.muted, fontSize: 9, lineHeight: 1.5 },
  titleBlock: { alignItems: "flex-end" },
  docTitle: { fontSize: 22, fontWeight: 700, color: COLORS.accent, letterSpacing: 1, marginBottom: 6 },
  docNumber: { fontSize: 11, fontWeight: 700, marginBottom: 10 },
  metaRow: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 3 },
  metaLabel: { color: COLORS.muted, width: 76, textAlign: "right", marginRight: 8 },
  metaValue: { width: 100, textAlign: "right", fontWeight: 700 },
  statusBadge: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: COLORS.accentSoft,
    color: COLORS.accent,
    borderRadius: 3,
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  partiesRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  partyBlock: { width: "48%" },
  partyLabel: { fontSize: 8, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 5 },
  partyName: { fontSize: 11, fontWeight: 700, marginBottom: 2 },
  table: { marginBottom: 16, borderTop: `1pt solid ${COLORS.border}` },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: COLORS.panel,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottom: `1pt solid ${COLORS.border}`,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottom: `1pt solid ${COLORS.border}`,
  },
  th: { fontSize: 8, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase" },
  colItem: { width: "30%" },
  colQty: { width: "10%", textAlign: "right" },
  colRate: { width: "15%", textAlign: "right" },
  colDiscount: { width: "13%", textAlign: "right" },
  colTax: { width: "10%", textAlign: "right" },
  colAmount: { width: "17%", textAlign: "right", fontWeight: 700 },
  itemDescription: { fontSize: 8.5, color: COLORS.muted, marginTop: 2 },
  totalsWrap: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 20 },
  totalsBox: { width: 230 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  totalsLabel: { color: COLORS.muted },
  totalsValue: { fontWeight: 700 },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    marginTop: 4,
    borderTop: `1pt solid ${COLORS.ink}`,
  },
  grandTotalLabel: { fontSize: 11, fontWeight: 700 },
  grandTotalValue: { fontSize: 13, fontWeight: 700, color: COLORS.accent },
  paidStamp: {
    marginTop: 10,
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#e8f8ee",
    color: "#1a8a4a",
    fontWeight: 700,
    fontSize: 11,
    borderRadius: 3,
    letterSpacing: 1,
  },
  sectionTitle: { fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: COLORS.muted, marginBottom: 4 },
  section: { marginBottom: 14 },
  sectionText: { fontSize: 9, lineHeight: 1.5 },
  twoColSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    borderTop: `1pt solid ${COLORS.border}`,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 8, color: COLORS.muted },
  pageNumber: { fontSize: 8, color: COLORS.muted },
});

function money(amount: number, currency: string) {
  return formatCurrency(amount, currency);
}

export function DocumentPdf({ doc }: { doc: DocumentRecord }) {
  const totals = calcDocumentTotals(doc.lineItems, doc.extraCharge);
  const isInvoice = doc.documentType === "invoice";
  const title = isInvoice ? "INVOICE" : "RECEIPT";
  const balanceDue = Math.max(0, totals.total - doc.amountPaid);
  const b = doc.businessDetails;
  const c = doc.customerDetails;
  const hasPaymentInfo = Boolean(b.bankName || b.accountNumber || b.upiId || b.paymentLink);

  return (
    <Document title={`${title === "INVOICE" ? "Invoice" : "Receipt"}-${doc.documentNumber}`}>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerRow}>
          <View style={{ maxWidth: 280 }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image has no alt prop */}
            {b.logoDataUrl ? <Image src={b.logoDataUrl} style={styles.logo} /> : null}
            <Text style={styles.businessName}>{b.businessName || "Your Business"}</Text>
            {b.address ? <Text style={styles.mutedLine}>{b.address}</Text> : null}
            {(b.phone || b.email) ? <Text style={styles.mutedLine}>{[b.phone, b.email].filter(Boolean).join("  •  ")}</Text> : null}
            {b.website ? <Text style={styles.mutedLine}>{b.website}</Text> : null}
            {b.taxId ? <Text style={styles.mutedLine}>Tax ID: {b.taxId}</Text> : null}
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.docTitle}>{title}</Text>
            <Text style={styles.docNumber}>{doc.documentNumber}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Issue Date</Text>
              <Text style={styles.metaValue}>{formatDate(doc.issueDate)}</Text>
            </View>
            {isInvoice && doc.dueDate ? (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Due Date</Text>
                <Text style={styles.metaValue}>{formatDate(doc.dueDate)}</Text>
              </View>
            ) : null}
            {!isInvoice && doc.paymentDate ? (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Payment Date</Text>
                <Text style={styles.metaValue}>{formatDate(doc.paymentDate)}</Text>
              </View>
            ) : null}
            {!isInvoice && doc.paymentMethod ? (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Method</Text>
                <Text style={styles.metaValue}>{statusLabel(doc.paymentMethod)}</Text>
              </View>
            ) : null}
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.statusBadge}>{statusLabel(doc.status)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.partiesRow}>
          <View style={styles.partyBlock}>
            <Text style={styles.partyLabel}>{isInvoice ? "Bill To" : "Received From / Customer"}</Text>
            <Text style={styles.partyName}>{c.name || "Customer"}</Text>
            {c.company ? <Text style={styles.mutedLine}>{c.company}</Text> : null}
            {c.billingAddress ? <Text style={styles.mutedLine}>{c.billingAddress}</Text> : null}
            {(c.email || c.phone) ? <Text style={styles.mutedLine}>{[c.email, c.phone].filter(Boolean).join("  •  ")}</Text> : null}
            {c.taxId ? <Text style={styles.mutedLine}>Tax ID: {c.taxId}</Text> : null}
          </View>
          {isInvoice && c.shippingAddress ? (
            <View style={styles.partyBlock}>
              <Text style={styles.partyLabel}>Ship To</Text>
              <Text style={styles.sectionText}>{c.shippingAddress}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow} fixed>
            <Text style={[styles.th, styles.colItem]}>Item</Text>
            <Text style={[styles.th, styles.colQty]}>Qty</Text>
            <Text style={[styles.th, styles.colRate]}>Rate</Text>
            <Text style={[styles.th, styles.colDiscount]}>Discount</Text>
            <Text style={[styles.th, styles.colTax]}>Tax</Text>
            <Text style={[styles.th, styles.colAmount]}>Amount</Text>
          </View>
          {doc.lineItems.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={{ color: COLORS.muted }}>No line items</Text>
            </View>
          ) : (
            doc.lineItems.map((item, idx) => (
              <View style={styles.tableRow} key={item.id || idx} wrap={false}>
                <View style={styles.colItem}>
                  <Text>{item.name || "Untitled item"}</Text>
                  {item.description ? <Text style={styles.itemDescription}>{item.description}</Text> : null}
                </View>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colRate}>{money(item.rate, doc.currency)}</Text>
                <Text style={styles.colDiscount}>{item.discount ? money(item.discount, doc.currency) : "—"}</Text>
                <Text style={styles.colTax}>{item.taxRate ? `${item.taxRate}%` : "—"}</Text>
                <Text style={styles.colAmount}>{money(calcLineTotal(item), doc.currency)}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.totalsWrap}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{money(totals.subtotal, doc.currency)}</Text>
            </View>
            {totals.discountTotal > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Discount</Text>
                <Text style={styles.totalsValue}>-{money(totals.discountTotal, doc.currency)}</Text>
              </View>
            ) : null}
            {totals.taxTotal > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Tax</Text>
                <Text style={styles.totalsValue}>{money(totals.taxTotal, doc.currency)}</Text>
              </View>
            ) : null}
            {totals.shippingTotal > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Shipping / Other</Text>
                <Text style={styles.totalsValue}>{money(totals.shippingTotal, doc.currency)}</Text>
              </View>
            ) : null}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>{isInvoice ? "Total Due" : "Total Paid"}</Text>
              <Text style={styles.grandTotalValue}>{money(totals.total, doc.currency)}</Text>
            </View>
            {isInvoice && doc.amountPaid > 0 ? (
              <>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>Amount Paid</Text>
                  <Text style={styles.totalsValue}>-{money(doc.amountPaid, doc.currency)}</Text>
                </View>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>Balance Due</Text>
                  <Text style={styles.totalsValue}>{money(balanceDue, doc.currency)}</Text>
                </View>
              </>
            ) : null}
            {!isInvoice ? <Text style={styles.paidStamp}>PAYMENT RECEIVED</Text> : null}
          </View>
        </View>

        <View style={styles.twoColSection}>
          {hasPaymentInfo ? (
            <View style={{ width: "48%" }}>
              <Text style={styles.sectionTitle}>Payment Information</Text>
              {b.bankName ? <Text style={styles.sectionText}>Bank: {b.bankName}</Text> : null}
              {b.accountHolderName ? <Text style={styles.sectionText}>Account Name: {b.accountHolderName}</Text> : null}
              {b.accountNumber ? <Text style={styles.sectionText}>Account No: {b.accountNumber}</Text> : null}
              {b.ifscCode ? <Text style={styles.sectionText}>IFSC: {b.ifscCode}</Text> : null}
              {b.swiftCode ? <Text style={styles.sectionText}>SWIFT: {b.swiftCode}</Text> : null}
              {b.upiId ? <Text style={styles.sectionText}>UPI: {b.upiId}</Text> : null}
              {b.paymentLink ? <Text style={styles.sectionText}>Pay online: {b.paymentLink}</Text> : null}
            </View>
          ) : (
            <View style={{ width: "48%" }} />
          )}
          <View style={{ width: "48%" }} />
        </View>

        {doc.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.sectionText}>{doc.notes}</Text>
          </View>
        ) : null}

        {doc.terms ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terms &amp; Conditions</Text>
            <Text style={styles.sectionText}>{doc.terms}</Text>
          </View>
        ) : null}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{b.businessName || "Statsix Invoice"}</Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
