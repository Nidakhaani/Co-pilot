"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useStore } from "@/lib/store";
import {
  SESSION_TYPE_LABEL,
  type CaptureMode,
  type SessionType,
} from "@/lib/types";

const SESSION_TYPES: SessionType[] = ["meeting", "lecture", "workshop"];

const MODE_BLURB: Record<CaptureMode, string> = {
  demo: "Scripted, simulated conversation played back on a timer. No mic or network needed — great for exploring the UI.",
  live: "Captures your real audio with speech-to-text and AI classification. (Arriving in the next implementation phase.)",
};

const TYPE_BLURB: Record<SessionType, string> = {
  meeting:
    "Copilot keeps decisions, action items, and open questions front and center.",
  lecture:
    "Copilot frames what's said as key points and questions to study later.",
  workshop:
    "Copilot watches for decisions, steps, and action items as you build.",
};

export default function SetupPage() {
  const router = useRouter();
  const { createSession } = useStore();

  const [name, setName] = useState("Product Strategy Meeting");
  const [type, setType] = useState<SessionType>("meeting");
  const [captureMode, setCaptureMode] = useState<CaptureMode>("demo");
  const [error, setError] = useState<string | null>(null);

  function start() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Give your session a name first.");
      return;
    }
    const session = createSession({ name: trimmed, type, captureMode });
    router.push(`/session/${session.id}`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        right={
          <Link href="/notes" className="text-sm font-medium text-muted hover:text-ink">
            Previous notes
          </Link>
        }
      />

      <main className="mx-auto flex w-full max-w-3xl flex-1 items-center gap-12 px-6 py-12">
        <div className="hidden flex-1 md:block">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-ink">
            Set up your session
          </h1>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
            Name it, choose the setting, and Copilot starts listening. You can
            correct anything it captures — live, without missing a beat.
          </p>
        </div>

        <Card className="w-full max-w-sm flex-1 p-6">
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Session name
          </label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder="e.g. Product Strategy Meeting"
            className="mb-5 h-11 w-full rounded-[10px] border border-border bg-white px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
          />

          <label className="mb-2 block text-sm font-medium text-ink">Type</label>
          <div className="mb-2 grid grid-cols-3 gap-2">
            {SESSION_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`h-10 rounded-[10px] border text-sm font-medium transition-colors ${
                  type === t
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border bg-white text-muted hover:border-accent/40 hover:text-ink"
                }`}
              >
                {SESSION_TYPE_LABEL[t]}
              </button>
            ))}
          </div>
          <p className="mb-5 text-xs leading-relaxed text-muted">
            {TYPE_BLURB[type]}
          </p>

          <label className="mb-2 block text-sm font-medium text-ink">
            Capture mode
          </label>
          <div className="mb-2 grid grid-cols-2 gap-2">
            {(["demo", "live"] as CaptureMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setCaptureMode(m)}
                className={`h-10 rounded-[10px] border text-sm font-medium transition-colors ${
                  captureMode === m
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border bg-white text-muted hover:border-accent/40 hover:text-ink"
                }`}
              >
                {m === "demo" ? "Demo" : "Live"}
              </button>
            ))}
          </div>
          <p className="mb-5 text-xs leading-relaxed text-muted">
            {MODE_BLURB[captureMode]}
          </p>

          <div className="mb-5 flex gap-2.5 rounded-[10px] border border-border bg-canvas p-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-accent">
              <path d="M12 16a4 4 0 0 0 4-4V7a4 4 0 1 0-8 0v5a4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="1.6" />
              <path d="M5 12a7 7 0 0 0 14 0M12 5v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <div className="text-xs leading-relaxed text-muted">
              <span className="font-medium text-ink">Microphone permission</span>
              <br />
              {captureMode === "demo"
                ? "Demo mode runs without the mic — the conversation is simulated."
                : "Live mode will request mic access so Copilot can hear the real conversation."}
            </div>
          </div>

          {error && (
            <p className="mb-3 text-xs font-medium text-flagged">{error}</p>
          )}

          <Button size="lg" className="w-full" onClick={start}>
            {captureMode === "demo"
              ? "Start listening (demo)"
              : "Start listening (live)"}
          </Button>
        </Card>
      </main>
    </div>
  );
}
