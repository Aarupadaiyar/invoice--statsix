import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "Statsix Invoice: Create Professional Invoices & Receipts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoBase64 = readFileSync(join(process.cwd(), "public", "logo.jpg")).toString("base64");

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#f6f7f9",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/jpeg;base64,${logoBase64}`} alt="" width={190} height={57} />

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 880 }}>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: -1.5,
              color: "#1a1d23",
            }}
          >
            Invoicing that looks sharp, and gets you paid faster
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#6b7280", marginTop: 28 }}>
            Build polished invoices and receipts, save your details once, and download real PDFs every time.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", width: 10, height: 10, borderRadius: 999, backgroundColor: "#2d5bff" }} />
          <div style={{ display: "flex", fontSize: 24, color: "#1a1d23", fontWeight: 600 }}>Free to start</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
