"use client";

import type { ReactNode } from "react";
import { BrandHeader } from "./BrandHeader";
import { StatusPill } from "./StatusPill";

export function AppHeader({
  right,
  center,
}: {
  right?: ReactNode;
  center?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-canvas/80 px-6 py-3.5 backdrop-blur">
      <BrandHeader subtitle={false} />
      {center}
      <div className="flex items-center gap-3">{right}</div>
    </header>
  );
}

export function LiveStatus({
  elapsed,
}: {
  elapsed: string;
}) {
  return (
    <StatusPill tone="live">
      <span className="flex items-center gap-1.5 font-semibold text-accent">
        <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent" />
        Listening
      </span>
      <span className="font-tabular-nums text-accent">· {elapsed}</span>
    </StatusPill>
  );
}
