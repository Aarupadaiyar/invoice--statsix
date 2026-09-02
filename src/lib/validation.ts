import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const businessProfileSchema = z.object({
  businessName: z.string().trim().max(200).default(""),
  logoDataUrl: z.string().max(2_000_000).default(""),
  address: z.string().trim().max(1000).default(""),
  phone: z.string().trim().max(50).default(""),
  email: z.string().trim().max(200).refine((v) => v === "" || z.string().email().safeParse(v).success, {
    message: "Enter a valid email address",
  }),
  website: z.string().trim().max(200).default(""),
  taxId: z.string().trim().max(100).default(""),
  defaultCurrency: z.string().trim().max(10).default("USD"),
  defaultPaymentTerms: z.string().trim().max(200).default(""),
  invoicePrefix: z.string().trim().max(20).default("INV-"),
  receiptPrefix: z.string().trim().max(20).default("REC-"),
  defaultNotes: z.string().trim().max(2000).default(""),
  defaultTerms: z.string().trim().max(2000).default(""),
  bankName: z.string().trim().max(200).default(""),
  accountHolderName: z.string().trim().max(200).default(""),
  accountNumber: z.string().trim().max(100).default(""),
  ifscCode: z.string().trim().max(50).default(""),
  swiftCode: z.string().trim().max(50).default(""),
  upiId: z.string().trim().max(100).default(""),
  paymentLink: z.string().trim().max(500).default(""),
});

export const customerSchema = z.object({
  name: z.string().trim().min(1, "Customer name is required").max(200),
  company: z.string().trim().max(200).default(""),
  email: z.string().trim().max(200).refine((v) => v === "" || z.string().email().safeParse(v).success, {
    message: "Enter a valid email address",
  }),
  phone: z.string().trim().max(50).default(""),
  billingAddress: z.string().trim().max(1000).default(""),
  shippingAddress: z.string().trim().max(1000).default(""),
  taxId: z.string().trim().max(100).default(""),
  logoDataUrl: z.string().max(2_000_000).default(""),
});

const lineItemSchema = z.object({
  id: z.string(),
  name: z.string().trim().max(300).default(""),
  description: z.string().trim().max(3000).default(""),
  quantity: z.number().finite().default(0),
  rate: z.number().finite().default(0),
  discount: z.number().finite().default(0),
  taxRate: z.number().finite().default(0),
});

const extraChargeSchema = z.object({
  discountType: z.enum(["flat", "percent"]).default("flat"),
  discountValue: z.number().finite().default(0),
  extraTax: z.number().finite().default(0),
  shipping: z.number().finite().default(0),
});

const businessDetailsSchema = z.object({
  businessName: z.string().max(200).default(""),
  logoDataUrl: z.string().max(2_000_000).default(""),
  address: z.string().max(1000).default(""),
  phone: z.string().max(50).default(""),
  email: z.string().max(200).default(""),
  website: z.string().max(200).default(""),
  taxId: z.string().max(100).default(""),
  bankName: z.string().max(200).default(""),
  accountHolderName: z.string().max(200).default(""),
  accountNumber: z.string().max(100).default(""),
  ifscCode: z.string().max(50).default(""),
  swiftCode: z.string().max(50).default(""),
  upiId: z.string().max(100).default(""),
  paymentLink: z.string().max(500).default(""),
});

const customerDetailsSchema = z.object({
  name: z.string().max(200).default(""),
  company: z.string().max(200).default(""),
  email: z.string().max(200).default(""),
  phone: z.string().max(50).default(""),
  billingAddress: z.string().max(1000).default(""),
  shippingAddress: z.string().max(1000).default(""),
  taxId: z.string().max(100).default(""),
  logoDataUrl: z.string().max(2_000_000).default(""),
});

export const documentSchema = z.object({
  documentType: z.enum(["invoice", "receipt"]),
  documentTitle: z.string().trim().min(1, "Document heading is required").max(60),
  documentNumber: z.string().trim().min(1, "Document number is required").max(60),
  status: z.string().trim().min(1).max(30),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().nullable().optional(),
  paymentDate: z.string().nullable().optional(),
  paymentMethod: z.string().nullable().optional(),
  currency: z.string().trim().min(1).max(10),
  customerId: z.string().nullable().optional(),
  businessDetails: businessDetailsSchema,
  customerDetails: customerDetailsSchema,
  lineItems: z.array(lineItemSchema).max(500),
  extraCharge: extraChargeSchema,
  amountPaid: z.number().finite().default(0),
  notes: z.string().trim().max(3000).default(""),
  terms: z.string().trim().max(3000).default(""),
});

export type DocumentInput = z.infer<typeof documentSchema>;
