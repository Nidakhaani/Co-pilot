"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useStore } from "@/lib/store";
import { type NoteType } from "@/lib/types";

const RECAP_GROUPS: {
  key: NoteType;
  heading: string;
  oneLine: string;
  dot: string;
  soft: string;
}[] = [
  { key: "key_point", heading: "Key points", oneLine: "3 insights you'll want to remember", dot: "bg-keypoint", soft: "bg-keypoint-soft text-keypoint" },
  { key: "decision", heading: "Decisions", oneLine: "2 things the group agreed on", dot: "bg-decision", soft: "bg-decision-soft text-decision" },
  { key: "action_item", heading: "Action items", oneLine: "3 tasks to get done", dot: "bg-action", soft: "bg-action-soft text-action" },
  { key: "question", heading: "Open questions", oneLine: "2 still up for discussion", dot: "bg-question", soft: "bg-question-soft text-question" },
];

export default function ReviewPage() {
  const router = useRouter();
  const { currentSession, endSession } = useStore();

  useEffect(() => {
    if (currentSession && currentSession.status === "active") {
      endSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentSession) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted">No session to review.</p>
        <Button variant="secondary" onClick={() => router.push("/welcome")}>
          Go home
        </Button>
      </div>
    );
  }

  const groups = RECAP_GROUPS.map((g) => ({
    ...g,
    items: currentSession.blocks.filter(
      (b) => b.type === g.key
    ),
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        right={
          <Button variant="secondary" size="sm" onClick={() => router.push("/welcome")}>
            Home
          </Button>
        }
      />

      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center gap-12 px-6 py-12">
        <div className="hidden max-w-sm flex-1 md:block">
          <div className="flex items-center gap-2 text-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" stroke="currentColor" strokeWidth="1.6" opacity="0.35" />
              <path d="m8.5 12.3 2.4 2.4 4.6-5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-semibold">Session finished</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink">
            {currentSession.name}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            {currentSession.durationMinutes || "A few"} minutes,{" "}
            {currentSession.blocks.length} notes captured. Here is the recap —
            everything is saved to your history.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Button size="lg" onClick={() => router.push(`/notes/${currentSession.id}`)}>
              Open full notes
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push(`/notes/${currentSession.id}`)}
            >
              Save session
            </Button>
          </div>
        </div>

        <Card className="flex-1 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Session recap</h2>
            <Button size="sm" variant="secondary" onClick={() => router.push(`/notes/${currentSession.id}`)}>
              Open full notes
            </Button>
          </div>

          <div className="space-y-5">
            {groups.map((g) => (
              <div key={g.key} className={g.items.length === 0 ? "opacity-50" : ""}>
                <div className="mb-1.5 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <span className={`inline-block h-2 w-2 rounded-full ${g.dot}`} />
                    {g.heading}
                  </h3>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${g.soft}`}>
                    {g.items.length}
                  </span>
                </div>
                {g.items.length === 0 ? (
                  <p className="text-xs text-muted">{g.oneLine}</p>
                ) : (
                  <ul className="space-y-1.5">
                    {g.items.map((b) => (
                      <li key={b.id} className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${g.dot}`} />
                        {b.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
