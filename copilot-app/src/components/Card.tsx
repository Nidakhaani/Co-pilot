import type { PropsWithChildren } from "react";

export function Card({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`rounded-[12px] border border-line bg-card shadow-[0_1px_2px_rgba(28,43,38,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}
