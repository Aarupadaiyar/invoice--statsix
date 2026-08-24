"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/toast";

const MAX_DIMENSION = 320;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/png", 0.92));
      };
      img.onerror = () => reject(new Error("Could not read image"));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export function LogoUpload({ value, onChange }: { value: string; onChange: (dataUrl: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please upload a PNG, JPG, WEBP, or SVG image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo must be smaller than 5MB.");
      return;
    }
    setLoading(true);
    try {
      const dataUrl = await resizeToDataUrl(file);
      onChange(dataUrl);
    } catch {
      toast.error("Couldn't process that image. Try a different file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="size-20 rounded-lg border border-dashed border-black/15 bg-black/[0.02] flex items-center justify-center overflow-hidden shrink-0">
        {loading ? (
          <Loader2 className="size-5 animate-spin text-black/30" />
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Business logo" className="w-full h-full object-contain" />
        ) : (
          <ImagePlus className="size-5 text-black/25" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm font-medium text-accent hover:underline"
          >
            {value ? "Change logo" : "Upload logo"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-sm text-black/40 hover:text-red-600 inline-flex items-center gap-1"
            >
              <X className="size-3.5" /> Remove
            </button>
          ) : null}
        </div>
        <p className="text-xs text-black/40">PNG, JPG, WEBP or SVG. Square logos work best.</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
