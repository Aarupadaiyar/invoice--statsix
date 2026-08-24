import type { Database } from "@/types/database";
import {
  defaultDocumentTitle,
  emptyBusinessDetails,
  emptyCustomerDetails,
  emptyExtraCharge,
  type BusinessDetails,
  type CustomerDetails,
  type DocumentRecord,
  type ExtraCharge,
  type LineItem,
} from "@/types/document";
import type { DocumentInput } from "@/lib/validation";

type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];
type BusinessProfileRow = Database["public"]["Tables"]["business_profiles"]["Row"];

export function toDocumentRecord(row: DocumentRow): DocumentRecord {
  const businessDetails = { ...emptyBusinessDetails(), ...(row.business_details as object) } as BusinessDetails;
  const customerDetails = { ...emptyCustomerDetails(), ...(row.customer_details as object) } as CustomerDetails;
  const extraCharge = { ...emptyExtraCharge(), ...(row.extra_charge as object) } as ExtraCharge;
  const lineItems = (Array.isArray(row.line_items) ? row.line_items : []) as unknown as LineItem[];

  return {
    id: row.id,
    documentType: row.document_type as DocumentRecord["documentType"],
    documentTitle: row.document_title || defaultDocumentTitle(row.document_type as DocumentRecord["documentType"]),
    documentNumber: row.document_number,
    status: row.status as DocumentRecord["status"],
    issueDate: row.issue_date,
    dueDate: row.due_date,
    paymentDate: row.payment_date,
    paymentMethod: row.payment_method as DocumentRecord["paymentMethod"],
    currency: row.currency,
    businessDetails,
    customerDetails,
    customerId: row.customer_id,
    lineItems,
    extraCharge,
    subtotal: Number(row.subtotal),
    discountTotal: Number(row.discount_total),
    taxTotal: Number(row.tax_total),
    shippingTotal: Number(row.shipping_total),
    total: Number(row.total),
    amountPaid: Number(row.amount_paid),
    notes: row.notes,
    terms: row.terms,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toDocumentInput(doc: DocumentRecord): DocumentInput {
  return {
    documentType: doc.documentType,
    documentTitle: doc.documentTitle,
    documentNumber: doc.documentNumber,
    status: doc.status,
    issueDate: doc.issueDate,
    dueDate: doc.dueDate,
    paymentDate: doc.paymentDate,
    paymentMethod: doc.paymentMethod,
    currency: doc.currency,
    customerId: doc.customerId,
    businessDetails: doc.businessDetails,
    customerDetails: doc.customerDetails,
    lineItems: doc.lineItems,
    extraCharge: doc.extraCharge,
    amountPaid: doc.amountPaid,
    notes: doc.notes,
    terms: doc.terms,
  };
}

export type CustomerRecord = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  billingAddress: string;
  shippingAddress: string;
  taxId: string;
  createdAt: string;
  updatedAt: string;
};

export function toCustomerRecord(row: CustomerRow): CustomerRecord {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    billingAddress: row.billing_address,
    shippingAddress: row.shipping_address,
    taxId: row.tax_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type BusinessProfileRecord = {
  businessName: string;
  logoDataUrl: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  defaultCurrency: string;
  defaultPaymentTerms: string;
  invoicePrefix: string;
  receiptPrefix: string;
  defaultNotes: string;
  defaultTerms: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  swiftCode: string;
  upiId: string;
  paymentLink: string;
};

export function toBusinessProfileRecord(row: BusinessProfileRow | null): BusinessProfileRecord {
  if (!row) {
    return {
      businessName: "",
      logoDataUrl: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      taxId: "",
      defaultCurrency: "USD",
      defaultPaymentTerms: "Due on receipt",
      invoicePrefix: "INV-",
      receiptPrefix: "REC-",
      defaultNotes: "",
      defaultTerms: "",
      bankName: "",
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      swiftCode: "",
      upiId: "",
      paymentLink: "",
    };
  }
  return {
    businessName: row.business_name,
    logoDataUrl: row.logo_data_url,
    address: row.address,
    phone: row.phone,
    email: row.email,
    website: row.website,
    taxId: row.tax_id,
    defaultCurrency: row.default_currency,
    defaultPaymentTerms: row.default_payment_terms,
    invoicePrefix: row.invoice_prefix,
    receiptPrefix: row.receipt_prefix,
    defaultNotes: row.default_notes,
    defaultTerms: row.default_terms,
    bankName: row.bank_name,
    accountHolderName: row.account_holder_name,
    accountNumber: row.account_number,
    ifscCode: row.ifsc_code,
    swiftCode: row.swift_code,
    upiId: row.upi_id,
    paymentLink: row.payment_link,
  };
}
