import Image from "next/image";

export function BrandLogo({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="Statsix Invoice"
      width={size}
      height={size}
      className="rounded-md object-cover shrink-0"
      priority
    />
  );
}
