import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { requireUser, errorResponse } from "@/lib/api-helpers";
import { toDocumentRecord } from "@/lib/data/mappers";
import { DocumentPdf } from "@/lib/pdf/document-pdf";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;
  const { id } = await params;

  const { data, error } = await supabase.from("documents").select("*").eq("user_id", user.id).eq("id", id).maybeSingle();
  if (error) return errorResponse(error.message, 500);
  if (!data) return errorResponse("Document not found", 404);

  const doc = toDocumentRecord(data);

  let buffer: Buffer;
  try {
    buffer = await renderToBuffer(DocumentPdf({ doc }));
  } catch (e) {
    console.error("PDF generation failed", e);
    return errorResponse("Failed to generate PDF. Please try again.", 500);
  }

  const label = doc.documentType === "invoice" ? "Invoice" : "Receipt";
  const filename = `${label}-${doc.documentNumber}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buffer.length),
    },
  });
}
