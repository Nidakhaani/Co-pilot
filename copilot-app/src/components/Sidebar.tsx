"use client";

import { usePathname, useRouter } from "next/navigation";
import { BrandHeader } from "./BrandHeader";
import type { Session } from "@/lib/types";

function relativeDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const day = 86400000;
  if (diff < day) return "Today";
  if (diff < 2 * day) return "Yesterday";
  if (diff < 7 * day) return `${Math.round(diff / day)} days ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function Sidebar({
  sessions,
}: {
  sessions: Session[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-white">
      <div className="border-b border-line px-5 py-4">
        <BrandHeader subtitle={false} />
      </div>

      <div className="px-3 py-3">
        <button
          onClick={() => router.push("/setup")}
          className="flex w-full items-center gap-2 rounded-[9px] bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          New session
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="mb-2 px-2 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
          Past sessions
        </div>
        {sessions.length === 0 ? (
          <p className="px-2 text-xs text-muted">
            No saved sessions yet. Start one to see it here.
          </p>
        ) : (
          <ul className="space-y-1">
            {sessions.map((s) => {
              const active = pathname === `/notes/${s.id}`;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => router.push(`/notes/${s.id}`)}
                    className={`w-full rounded-[9px] px-3 py-2.5 text-left transition-colors ${
                      active ? "bg-accent-soft" : "hover:bg-canvas"
                    }`}
                  >
                    <div
                      className={`truncate text-sm font-medium ${
                        active ? "text-accent" : "text-ink"
                      }`}
                    >
                      {s.name}
                    </div>
                    <div className="text-xs text-muted">
                      {relativeDate(s.startedAt)} · {s.blocks.length}{" "}
                      {s.blocks.length === 1 ? "note" : "notes"}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
