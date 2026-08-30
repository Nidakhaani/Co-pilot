"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppHeader, LiveStatus } from "@/components/AppHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { BlockItem } from "@/components/BlockItem";
import { Waveform } from "@/components/ListeningIndicator";
import { Toast } from "@/components/Toast";
import { CorrectionPanel } from "@/components/CorrectionPanel";
import { useStore } from "@/lib/store";
import { SCRIPTED_STREAM } from "@/lib/mock-data";
import type { Block, NoteType } from "@/lib/types";

type LiveMessage = {
  type: "transcript" | "block" | "done";
  data: {
    raw?: string;
    is_final?: boolean;
    id?: string;
    type?: NoteType;
    title?: string;
    detail?: string;
    confidence?: number;
  };
};

export default function SessionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getSession, addBlock, revertBlock } = useStore();

  const session = getSession(params.id);
  const sessionId = params.id;

  const [elapsed, setElapsed] = useState(0);
  const [streamIdx, setStreamIdx] = useState(0);
  const [activeRaw, setActiveRaw] = useState<string | null>(null);
  const [typed, setTyped] = useState(0);
  const [streamDone, setStreamDone] = useState(false);
  const [transcriptHistory, setTranscriptHistory] = useState<
    { text: string; time: string }[]
  >([]);
  const [liveLine, setLiveLine] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState<
    "connecting" | "live" | "done" | "error"
  >("connecting");

  const [correcting, setCorrecting] = useState<Block | null>(null);
  const [updated, setUpdated] = useState<Block | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("Note updated");

  const notesScrollRef = useRef<HTMLDivElement>(null);
  const transcriptScrollRef = useRef<HTMLDivElement>(null);

  const blocks = session?.blocks ?? [];
  const isLive = session?.captureMode === "live";

  // Keep each pane independently scrolled to the latest content without
  // scrolling the whole page.
  const scrollToBottom = (ref: React.RefObject<HTMLDivElement | null>) => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  // Keep the newest note in view as the feed grows
  useEffect(() => {
    scrollToBottom(notesScrollRef);
  }, [blocks.length]);

  // Keep the transcript log anchored at the latest line
  useEffect(() => {
    scrollToBottom(transcriptScrollRef);
  }, [transcriptHistory.length]);

  // Elapsed timer
  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Step 1: after a small pause, reveal the next raw transcript line
  useEffect(() => {
    if (isLive || streamIdx >= SCRIPTED_STREAM.length) return;
    const item = SCRIPTED_STREAM[streamIdx];
    const t = setTimeout(() => {
      setActiveRaw(item.raw);
      setTyped(0);
    }, item.delay);
    return () => clearTimeout(t);
  }, [streamIdx, isLive]);

  // Step 2: type it out letter by letter, then finalize the block
  useEffect(() => {
    if (isLive || !activeRaw || streamIdx >= SCRIPTED_STREAM.length) return;
    const item = SCRIPTED_STREAM[streamIdx];
    if (typed < activeRaw.length) {
      const t = setTimeout(() => setTyped((n) => n + 1), 18);
      return () => clearTimeout(t);
    }
    // finished typing -> finalize the classified block after a short beat
    const t = setTimeout(() => {
      addBlock({ id: item.id, ...item.block });
      setTranscriptHistory((h) => [
        ...h,
        { text: item.raw, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) },
      ]);
      setActiveRaw(null);
      setTyped(0);
      setStreamIdx((i) => i + 1);
      if (streamIdx + 1 >= SCRIPTED_STREAM.length) setStreamDone(true);
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRaw, typed, streamIdx, isLive]);

  // Live mode: consume the real WebSocket stream from the FastAPI backend.
  const doneRef = useRef(false);
  useEffect(() => {
    doneRef.current = streamDone;
  }, [streamDone]);

  useEffect(() => {
    if (!isLive) return;
    const base = process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:8000";
    const ws = new WebSocket(`${base}/ws/live/${sessionId}`);

    ws.onopen = () => setLiveStatus("live");
    ws.onmessage = (e) => {
      let msg: LiveMessage;
      try {
        msg = JSON.parse(e.data as string);
      } catch {
        return;
      }
      if (msg.type === "transcript") {
        if (msg.data.is_final) {
          setTranscriptHistory((h) => [
            ...h,
            {
              text: msg.data.raw ?? "",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
            },
          ]);
          setLiveLine(null);
        } else {
          setLiveLine(msg.data.raw ?? null);
        }
      } else if (msg.type === "block") {
        const b = msg.data;
        addBlock({
          id: b.id ?? `blk_${Math.random().toString(36).slice(2, 8)}`,
          type: b.type ?? "key_point",
          title: b.title ?? "",
          detail: b.detail ?? "",
          confidence: b.confidence ?? 0,
        });
      } else if (msg.type === "done") {
        setStreamDone(true);
        setLiveStatus("done");
      }
    };
    ws.onerror = () => setLiveStatus("error");
    ws.onclose = () => {
      if (!doneRef.current) setLiveStatus("error");
    };
    return () => ws.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLive, sessionId]);

  const elapsedLabel = useMemo(() => {
    const m = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, "0");
    const s = (elapsed % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [elapsed]);

  const typedRaw = activeRaw ? activeRaw.slice(0, typed) : null;

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted">That session does not exist.</p>
        <Button variant="secondary" onClick={() => router.push("/welcome")}>
          Go home
        </Button>
      </div>
    );
  }

  function openCorrection(block: Block) {
    setUpdated(null);
    setCorrecting(block);
  }

  function handleRevert(block: Block) {
    revertBlock(block.id);
    setToastMsg("Reverted to Copilot's capture");
    setShowToast(true);
  }

  function handleUpdated(before: Block, after: Block) {
    setCorrecting(null);
    setUpdated(after);
    setToastMsg("Note updated · listening continues");
    setShowToast(true);
  }

  function endSession() {
    router.push("/review");
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <AppHeader
        center={
          session.status === "active" ? (
            <div className="flex items-center gap-3">
              <LiveStatus elapsed={elapsedLabel} />
              <Waveform />
            </div>
          ) : undefined
        }
        right={
          <div className="flex items-center gap-2">
            <Link
              href="/setup"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:text-ink"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isLive ? "bg-question" : "bg-keypoint"
                }`}
              />
              {isLive ? "Live" : "Demo"}
            </Link>
            <Button variant="secondary" size="sm" onClick={endSession}>
              End session
            </Button>
          </div>
        }
      />

      <main className="flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-6 lg:mx-auto lg:flex-row">
        {/* Left: Live Conversation */}
        <Card className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <h2 className="text-sm font-semibold text-ink">Live Conversation</h2>
            <span className="text-xs text-muted">Raw transcript · streaming</span>
          </div>

          {/* Scrollable transcript log */}
          <div
            ref={transcriptScrollRef}
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-6"
          >
            {transcriptHistory.map((h, i) => (
              <div
                key={i}
                className="animate-fade-in-up shrink-0 rounded-[10px] border border-line bg-canvas/60 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[15px] font-light leading-relaxed text-ink/75">
                    {h.text}
                  </p>
                  <span className="shrink-0 text-[10px] tabular-nums text-muted">
                    {h.time}
                  </span>
                </div>
              </div>
            ))}

            {(typedRaw !== null || liveLine !== null) && (
              <div className="animate-fade-in-up inline-block shrink-0">
                <p className="text-[22px] font-light leading-normal text-ink/75">
                  {typedRaw !== null ? typedRaw : liveLine}
                  <span className="animate-blink text-accent">▌</span>
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-keypoint-soft px-2.5 py-1 text-[11px] font-medium text-keypoint">
                  <span className="h-1.5 w-1.5 rounded-full bg-keypoint" />
                  {isLive ? "Live capture" : "Capturing audio…"}
                </div>
              </div>
            )}

            {!isLive &&
              transcriptHistory.length === 0 &&
              typedRaw === null && (
                <div className="flex flex-1 items-center justify-center">
                  <div className="text-center">
                    <Waveform bars={7} />
                    <p className="mt-4 text-sm text-muted">
                      Listening for the first moment…
                    </p>
                  </div>
                </div>
              )}

            {isLive && liveLine === null && (
              <div className="flex flex-1 items-center justify-center">
                {liveStatus === "error" ? (
                  <div className="text-center">
                    <div className="text-sm font-semibold text-flagged">
                      Lost connection to the live stream
                    </div>
                    <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
                      Is the backend running? Start it with{" "}
                      <code className="rounded bg-canvas px-1 py-0.5 text-xs">
                        uvicorn main:app --port 8000
                      </code>{" "}
                      in <code className="rounded bg-canvas px-1 py-0.5 text-xs">server/</code>.
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Waveform bars={7} />
                    <p className="mt-4 text-sm text-muted">
                      {liveStatus === "connecting"
                        ? "Connecting to live stream…"
                        : liveStatus === "done"
                        ? "Demo complete."
                        : "Waiting for the first moment…"}
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

          <div className="flex items-center justify-between border-t border-line px-5 py-3">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  streamDone
                    ? "bg-note"
                    : isLive
                    ? liveStatus === "live"
                      ? "animate-pulse-dot bg-accent"
                      : "bg-muted"
                    : "animate-pulse-dot bg-accent"
                }`}
              />
              <span className="text-sm font-medium text-ink">
                {streamDone
                  ? "Demo complete"
                  : isLive
                  ? liveStatus === "live"
                    ? "Live · connected"
                    : liveStatus === "connecting"
                    ? "Live · connecting…"
                    : "Live · not connected"
                  : "Capturing in real time"}
              </span>
            </div>
            <span className="text-xs text-keypoint">
              {blocks.length} {blocks.length === 1 ? "note" : "notes"} captured
            </span>
          </div>
        </Card>

        {/* Right: Your Notes — same Card + scroll window as left */}
        <Card className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <h2 className="text-sm font-semibold text-ink">Your Notes</h2>
            <span className="text-xs text-muted">
              {blocks.length} {blocks.length === 1 ? "block" : "blocks"} ·{" "}
              <span className="font-medium text-accent">edit any if Copilot got it wrong</span>
            </span>
          </div>

          <div ref={notesScrollRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-6">
            {blocks.length === 0 ? (
              <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted">
                {isLive ? (
                  <div>Notes streamed from the backend will appear here in real time as the conversation is classified.</div>
                ) : (
                  <div>
                    Notes will appear here automatically as the conversation streams in — no blocking or confirmation
                    needed. Edit any note if Copilot gets it wrong.
                  </div>
                )}
              </div>
            ) : (
              blocks.map((b) => (
                <BlockItem
                  key={b.id}
                  block={b}
                  onCorrect={openCorrection}
                  onRevert={handleRevert}
                  correcting={correcting?.id === b.id}
                />
              ))
            )}

            {/* Explicit demo end */}
            {streamDone && blocks.length > 0 && (
              <div className="animate-fade-in-up mt-2 flex shrink-0 flex-col items-center gap-3 rounded-[12px] border border-accent/30 bg-accent-soft/40 p-6 text-center">
                <div className="text-sm font-semibold text-accent">Demo complete — that&apos;s the end of the session.</div>
                <p className="max-w-sm text-sm text-muted">
                  All {blocks.length} notes were captured automatically. Review the grouped recap, or edit any note above
                  first.
                </p>
                <Button onClick={endSession}>End session &amp; review</Button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-line px-5 py-3">
            <span className="text-xs text-muted">{blocks.length} {blocks.length === 1 ? "block" : "blocks"} captured</span>
            <span className="text-xs text-muted">{streamDone ? "Ready to review" : "Auto-capturing…"}</span>
          </div>
        </Card>
      </main>
      <CorrectionPanel
        block={correcting}
        onClose={() => setCorrecting(null)}
        onUpdated={handleUpdated}
      />

      <Toast show={showToast} onDone={() => setShowToast(false)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white">
          <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" stroke="currentColor" strokeWidth="1.8" opacity="0.35" />
          <path d="m8.5 12.3 2.4 2.4 4.6-5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>
          {toastMsg.startsWith("Note") ? (
            <>
              {toastMsg.split(" · ")[0]} ·{" "}
              <span className="font-semibold">{toastMsg.split(" · ")[1]}</span>
            </>
          ) : (
            toastMsg
          )}
        </span>
      </Toast>

      {updated && (
        <UpdateComparison
          sessionId={sessionId}
          onClose={() => setUpdated(null)}
        />
      )}
    </div>
  );
}

function UpdateComparison({
  sessionId,
  onClose,
}: {
  sessionId: string;
  onClose: () => void;
}) {
  // Look up the most recently corrected block to show before/after.
  const { getSession } = useStore();
  const session = getSession(sessionId);
  const corrected = [...(session?.blocks ?? [])]
    .reverse()
    .find((b) => b.userCorrected && b.original);
  if (!corrected) return null;

  const before = corrected.original!;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink/30 p-6"
      onClick={onClose}
    >
      <div
        className="animate-fade-in-up w-full max-w-2xl rounded-[12px] bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink">Note updated</h3>
          <button onClick={onClose} className="text-sm text-muted hover:text-ink">
            Close
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-flagged/30 p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-flagged">
              Before
            </div>
            <div className="text-sm font-semibold text-ink">{before.title}</div>
            {before.detail && <p className="mt-1 text-xs text-muted">{before.detail}</p>}
          </Card>
          <Card className="border-action/30 bg-action-soft/40 p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-action">
              Updated by Copilot
            </div>
            <div className="text-sm font-semibold text-ink">{corrected.title}</div>
            {corrected.detail && (
              <p className="mt-1 text-xs text-muted">{corrected.detail}</p>
            )}
          </Card>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={onClose}>Back to listening</Button>
        </div>
      </div>
    </div>
  );
}
