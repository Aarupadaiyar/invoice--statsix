import Image from "next/image";

const LOGO_ASPECT_RATIO = 773 / 230;

export function BrandLogo({ height = 22 }: { height?: number }) {
  const width = Math.round(height * LOGO_ASPECT_RATIO);
  return (
    <Image
      src="/logo.png"
      alt="Statsix Invoice"
      width={width}
      height={height}
      className="object-contain shrink-0"
      priority
    />
  );
}
