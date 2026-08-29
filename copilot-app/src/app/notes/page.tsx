"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useStore } from "@/lib/store";
import { TYPE_LABEL, type NoteType } from "@/lib/types";

export default function NotesIndexPage() {
  const router = useRouter();
  const { completedSessions } = useStore();

  function groupCount(session: (typeof completedSessions)[number], type: NoteType) {
    return session.blocks.filter((b) => b.type === type).length;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar sessions={completedSessions} />

      <main className="flex flex-1 flex-col px-8 py-10">
        <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
          History
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Previous notes
        </h1>
        <p className="mt-2 text-sm text-muted">
          Every session, saved. Open a document or start a fresh one.
        </p>

        <div className="mt-8">
          {completedSessions.length === 0 ? (
            <Card className="flex flex-col items-center gap-4 p-12 text-center">
              <p className="max-w-xs text-sm text-muted">
                Nothing saved yet. Your completed sessions will appear here
                automatically.
              </p>
              <Button onClick={() => router.push("/setup")}>Start a new session</Button>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completedSessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => router.push(`/notes/${s.id}`)}
                  className="rounded-[12px] border border-line bg-card p-5 text-left transition-colors hover:border-accent/40 hover:shadow-sm"
                >
                  <div className="text-[15px] font-semibold text-ink">{s.name}</div>
                  <div className="mt-1 text-xs text-muted">
                    {new Date(s.startedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    · {s.blocks.length} notes
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(["key_point", "decision", "action_item", "question"] as NoteType[]).map((t) =>
                      groupCount(s, t) > 0 ? (
                        <span
                          key={t}
                          className="rounded-full bg-canvas px-2 py-0.5 text-[11px] font-medium text-muted"
                        >
                          {TYPE_LABEL[t]} · {groupCount(s, t)}
                        </span>
                      ) : null
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
