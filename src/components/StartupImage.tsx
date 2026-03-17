"use client";

import { getStartupImageUrl } from "@/lib/images";

export default function StartupImage({
  name,
  src,
  size = 128,
  className = "",
}: {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}) {
  const url = src || getStartupImageUrl(name, size);
  return (
    <div
      className={`overflow-hidden rounded-lg bg-slate-800 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={url}
        alt={name}
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
