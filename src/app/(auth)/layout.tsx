import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-background">
      <Link href="/" className="flex items-center font-semibold text-lg mb-8">
        <BrandLogo height={28} />
      </Link>
      <div className="w-full max-w-sm bg-white rounded-xl border border-black/5 shadow-sm p-7">{children}</div>
    </div>
  );
}
