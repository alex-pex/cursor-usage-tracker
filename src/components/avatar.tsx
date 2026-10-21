import Image from "next/image";

export function Avatar({ src, size }: { src: string; size: number }) {
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className="rounded-full shrink-0"
      unoptimized
    />
  );
}
