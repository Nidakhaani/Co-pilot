import type { ReactNode } from "react";

export function StatusPill({
  children,
  tone = "idle",
}: {
  children: ReactNode;
  tone?: "idle" | "live" | "done";
}) {
  const tones = {
    idle: "bg-white text-muted border-border",
    live: "bg-accent-soft text-accent border-accent/20",
    done: "bg-white text-muted border-border",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
