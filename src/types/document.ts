export type DocumentType = "invoice" | "receipt";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";
export type ReceiptStatus = "draft" | "received";
export type DocumentStatus = InvoiceStatus | ReceiptStatus;

export type PaymentMethod = "cash" | "bank_transfer" | "card" | "upi" | "other";

export function defaultDocumentTitle(type: DocumentType): string {
  return type === "invoice" ? "Invoice" : "Receipt";
}

export const DOCUMENT_TITLE_PRESETS: Record<DocumentType, string[]> = {
  invoice: [
    "Invoice",
    "Tax Invoice",
    "Proforma Invoice",
    "Quotation",
    "Quote",
    "Estimate",
    "Estimation Bill",
    "Credit Note",
    "Sales Order",
    "Delivery Challan",
  ],
  receipt: ["Receipt", "Payment Receipt", "Cash Receipt", "Sales Receipt"],
};

/**
 * Each document heading gets its own sequential number series (e.g. a Quotation
 * numbers independently as QUO-0001, QUO-0002..., separate from Tax Invoice's
 * INV-0001, INV-0002...). Headings not listed here fall back to the user's default
 * invoice/receipt prefix from their business profile.
 */
export const DOCUMENT_TITLE_PREFIXES: Record<string, string> = {
  Invoice: "INV-",
  "Tax Invoice": "INV-",
  "Proforma Invoice": "PI-",
  Quotation: "QUO-",
  Quote: "QUO-",
  Estimate: "EST-",
  "Estimation Bill": "EST-",
  "Credit Note": "CN-",
  "Sales Order": "SO-",
  "Delivery Challan": "DC-",
  Receipt: "REC-",
  "Payment Receipt": "REC-",
  "Cash Receipt": "REC-",
  "Sales Receipt": "REC-",
};

export type LineItem = {
  id: string;
  name: string;
  description: string;
  hsnSac: string;
  unit: string;
  quantity: number;
  rate: number;
  discount: number;
  taxRate: number;
};

export type BusinessDetails = {
  businessName: string;
  logoDataUrl: string;
  billingAddress: string;
  shippingAddress: string;
  state: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  swiftCode: string;
  upiId: string;
  paymentLink: string;
  signatureDataUrl: string;
  authorizedSignatory: string;
};

export type CustomerDetails = {
  name: string;
  company: string;
  email: string;
  phone: string;
  billingAddress: string;
  shippingAddress: string;
  taxId: string;
  logoDataUrl: string;
};

export type ExtraCharge = {
  discountType: "flat" | "percent";
  discountValue: number;
  extraTax: number;
  shipping: number;
};

export type DocumentTotals = {
  subtotal: number;
  lineDiscountTotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  total: number;
};

export type GstSplit = {
  applicable: boolean;
  isIntraState: boolean;
  cgst: number;
  sgst: number;
  igst: number;
};

export type DocumentRecord = {
  id: string;
  documentType: DocumentType;
  documentTitle: string;
  documentNumber: string;
  status: DocumentStatus;
  issueDate: string;
  dueDate: string | null;
  paymentDate: string | null;
  paymentMethod: PaymentMethod | null;
  currency: string;
  placeOfSupply: string;
  businessDetails: BusinessDetails;
  customerDetails: CustomerDetails;
  customerId: string | null;
  lineItems: LineItem[];
  extraCharge: ExtraCharge;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  total: number;
  amountPaid: number;
  notes: string;
  terms: string;
  createdAt: string;
  updatedAt: string;
};

export function emptyLineItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    hsnSac: "",
    unit: "",
    quantity: 1,
    rate: 0,
    discount: 0,
    taxRate: 0,
  };
}

export function emptyBusinessDetails(): BusinessDetails {
  return {
    businessName: "",
    logoDataUrl: "",
    billingAddress: "",
    shippingAddress: "",
    state: "",
    phone: "",
    email: "",
    website: "",
    taxId: "",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    swiftCode: "",
    upiId: "",
    paymentLink: "",
    signatureDataUrl: "",
    authorizedSignatory: "",
  };
}

export function emptyCustomerDetails(): CustomerDetails {
  return {
    name: "",
    company: "",
    email: "",
    phone: "",
    billingAddress: "",
    shippingAddress: "",
    taxId: "",
    logoDataUrl: "",
  };
}

export function emptyExtraCharge(): ExtraCharge {
  return {
    discountType: "flat",
    discountValue: 0,
    extraTax: 0,
    shipping: 0,
  };
}

export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
] as const;

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "card", label: "Card" },
  { value: "upi", label: "UPI" },
  { value: "other", label: "Other" },
];

/** Indian states and union territories, for GST place-of-supply and business-state fields. */
export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

/** Common units of measurement for GST line items. */
export const UNIT_PRESETS = ["pcs", "nos", "hrs", "kg", "g", "ltr", "ml", "box", "set", "sqft", "sqm", "day", "month"] as const;
