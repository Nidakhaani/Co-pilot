"use client";

import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/Button";
import { useStore } from "@/lib/store";
import { TYPE_LABEL, type NoteType, type Session } from "@/lib/types";

const RECAP_GROUPS: {
  key: NoteType;
  heading: string;
  dot: string;
  soft: string;
}[] = [
  { key: "key_point", heading: "Key Points", dot: "bg-keypoint", soft: "text-keypoint" },
  { key: "decision", heading: "Decisions", dot: "bg-decision", soft: "text-decision" },
  { key: "action_item", heading: "Action Items", dot: "bg-action", soft: "text-action" },
  { key: "question", heading: "Open Questions", dot: "bg-question", soft: "text-question" },
  { key: "note", heading: "Other Notes", dot: "bg-note", soft: "text-note" },
];

function downloadMarkdown(session: Session | undefined) {
  if (!session) return;
  const lines: string[] = [];
  lines.push(`# ${session.name}`);
  lines.push("");
  lines.push(`> **FINAL NOTES** — captured by Copilot`);
  lines.push("");
  for (const g of RECAP_GROUPS) {
    const items = session.blocks.filter((b) => b.type === g.key);
    if (items.length === 0) continue;
    lines.push(`## ${g.heading}`);
    lines.push("");
    items.forEach((b) => {
      lines.push(`- ${b.title}`);
      if (b.detail) lines.push(`  - ${b.detail}`);
      lines.push(
        `  - _${TYPE_LABEL[b.type]}, ${Math.round(b.confidence * 100)}% confidence${
          b.userCorrected ? ", corrected" : ""
        }_`
      );
    });
    lines.push("");
  }
  lines.push(`---`);
  lines.push(`_${session.corrections} correction(s) made · all changes saved_`);
  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${session.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function NotesPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getSession, completedSessions } = useStore();

  const session = getSession(params.id);
  const groups = RECAP_GROUPS.map((g) => ({
    ...g,
    items: session?.blocks.filter((b) => b.type === g.key) ?? [],
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex min-h-screen">
      <Sidebar sessions={completedSessions} />

      <main className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-white px-8 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-keypoint-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-keypoint">
              <span className="h-1.5 w-1.5 rounded-full bg-keypoint" />
              Final notes
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={() => downloadMarkdown(session)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 4v11m0 0 4-4m-4 4-4-4M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Share / export
            </Button>
            <Button size="sm" onClick={() => router.push("/welcome")}>
              Done
            </Button>
          </div>
        </header>

        <div className="flex flex-1 justify-center overflow-y-auto px-8 py-10">
          <div className="w-full max-w-2xl">
            {!session ? (
              <p className="text-sm text-muted">No session found.</p>
            ) : (
              <article>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
                  Final notes
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-ink">
                  {session.name}
                </h1>
                <p className="mt-2 text-sm text-muted">
                  {new Date(session.startedAt).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                  {" · "}
                  {session.durationMinutes} min
                  {session.durationMinutes === 1 ? "" : "s"}
                  {" · "}
                  {session.blocks.length}{" "}
                  {session.blocks.length === 1 ? "note" : "notes"}
                </p>

                <div className="mt-8 space-y-8">
                  {groups.map((g) => (
                    <section key={g.key}>
                      <h2 className={`mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide ${g.soft}`}>
                        <span className={`inline-block h-2 w-2 rounded-full ${g.dot}`} />
                        {g.heading}
                      </h2>
                      <ul className="space-y-3 border-l border-line pl-4">
                        {g.items.map((b) => (
                          <li key={b.id} className="relative">
                            <span className={`absolute -left-[21px] top-2 h-2 w-2 rounded-full ${g.dot}`} />
                            <div className="text-[15px] font-medium leading-snug text-ink">
                              {b.title}
                            </div>
                            {b.detail && (
                              <p className="mt-1 text-sm text-muted">{b.detail}</p>
                            )}
                            <div className="mt-1.5 text-xs text-muted">
                              <span className={g.soft}>{TYPE_LABEL[b.type]}</span>
                              {" · "}
                              {Math.round(b.confidence * 100)}% confidence
                              {b.userConfirmed && (
                                <span className="ml-1.5 font-medium text-confirmed">
                                  · confirmed
                                </span>
                              )}
                              {b.userCorrected && (
                                <span className="ml-1.5 font-medium text-action">
                                  · edited by you
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>

                <footer className="mt-12 border-t border-line pt-4 text-xs text-muted">
                  {session.corrections} correction(s) made · all changes saved
                </footer>
              </article>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
