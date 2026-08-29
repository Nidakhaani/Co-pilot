"use client";

import { useEffect, type ReactNode } from "react";

export function Toast({
  children,
  show,
  onDone,
  duration = 3200,
}: {
  children: ReactNode;
  show: boolean;
  onDone?: () => void;
  duration?: number;
}) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(t);
  }, [show, onDone, duration]);

  if (!show) return null;

  return (
    <div className="animate-toast-in pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-2.5 rounded-[10px] bg-ink px-4 py-3 text-sm text-white shadow-lg">
        {children}
      </div>
    </div>
  );
}
