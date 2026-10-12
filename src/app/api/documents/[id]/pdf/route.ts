import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { requireUser, errorResponse, dbError } from "@/lib/api-helpers";
import { toDocumentRecord } from "@/lib/data/mappers";
import { DocumentPdf } from "@/lib/pdf/document-pdf";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user, unauthorized } = await requireUser();
  if (!user) return unauthorized;
  const { id } = await params;

  const { data, error } = await supabase.from("documents").select("*").eq("user_id", user.id).eq("id", id).maybeSingle();
  if (error) return dbError(error);
  if (!data) return errorResponse("Document not found", 404);

  const doc = toDocumentRecord(data);

  let buffer: Buffer;
  try {
    buffer = await renderToBuffer(DocumentPdf({ doc }));
  } catch (e) {
    console.error("PDF generation failed", e);
    return errorResponse("Failed to generate PDF. Please try again.", 500);
  }

  // Numbers like "PI-88/26/27" contain characters that are invalid in filenames and headers.
  const safe = (s: string) => s.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  const filename = `${safe(doc.documentTitle) || "Document"}-${safe(doc.documentNumber) || doc.id}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buffer.length),
    },
  });
}
