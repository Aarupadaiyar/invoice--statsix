import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { btnPrimary } from "@/lib/ui";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
      <Link href="/" className="flex items-center gap-2 font-semibold mb-10">
        <BrandLogo height={22} />
      </Link>
      <div className="size-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">
        <FileQuestion className="size-6" />
      </div>
      <h1 className="text-2xl font-semibold mb-2">This page doesn&apos;t exist</h1>
      <p className="text-black/50 max-w-sm mb-8">
        The page you&apos;re looking for was moved, renamed, or never existed. Check the link, or head back to the
        homepage.
      </p>
      <Link href="/" className={btnPrimary}>
        Back to homepage
      </Link>
    </div>
  );
}
