"use client";

import type { Block, NoteType } from "@/lib/types";
import { TypePill } from "./TypePill";
import { Waveform } from "./ListeningIndicator";

const typeHex: Record<NoteType, string> = {
  key_point: "#0f766e",
  decision: "#4f46e5",
  action_item: "#d97a06",
  question: "#9333ea",
  note: "#64748b",
};

function confidenceLabel(confidence: number) {
  return `${Math.round(confidence * 100)}% confidence`;
}

export function BlockItem({
  block,
  onCorrect,
  onRevert,
  correcting = false,
}: {
  block: Block;
  onCorrect?: (block: Block) => void;
  onRevert?: (block: Block) => void;
  correcting?: boolean;
}) {
  const flagged = block.flagged && !block.userCorrected;
  const corrected = block.userCorrected;

  const accent = typeHex[block.type];

  return (
    <div
      className={`animate-fade-in-up relative overflow-hidden rounded-[10px] border bg-card transition-colors ${
        flagged
          ? "border-flagged/40"
          : corrected
          ? "border-action/40"
          : "border-line"
      }`}
    >
      {/* Type accent bar */}
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: accent }}
      />

      <div className="pl-4">
        <div className="flex items-center justify-between gap-2 border-b border-line/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <TypePill type={block.type} flagged={flagged} />
            {corrected && (
              <span className="rounded-full bg-action-soft px-2 py-0.5 text-[11px] font-semibold text-action">
                Edited by you
              </span>
            )}
          </div>
          <div className="text-[11px] text-muted">
            {corrected ? (
              <span className="text-action">Edited · {confidenceLabel(block.confidence)}</span>
            ) : (
              <>Auto-captured · {confidenceLabel(block.confidence)}</>
            )}
          </div>
        </div>

        <div className="px-4 py-3.5">
          <div className="text-[15px] font-semibold leading-snug text-ink">
            {block.title}
          </div>
          {block.detail && (
            <p className="mt-1 text-sm leading-relaxed text-muted">{block.detail}</p>
          )}
        </div>

        {/* HITL controls — capture never blocks; edit only when asked */}
        <div className="flex items-center justify-between gap-2 border-t border-line/70 px-3 py-2">
          {flagged ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-flagged">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v6m0 4.01.01-.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Low confidence
            </span>
          ) : (
            <span className="text-[11px] text-muted">Auto-captured</span>
          )}

          {corrected && onRevert ? (
            <button
              onClick={() => onRevert(block)}
              className="rounded-md px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-canvas hover:text-ink"
            >
              Revert
            </button>
          ) : (
            onCorrect && (
              <button
                onClick={() => onCorrect(block)}
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                  flagged
                    ? "bg-flagged text-white hover:bg-flagged/90"
                    : "text-ink hover:bg-canvas"
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M4 20h4L20 8l-4-4L4 16v4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
                {flagged ? "Edit to fix" : "Edit"}
              </button>
            )
          )}
        </div>
      </div>

      {correcting && (
        <div className="flex items-center gap-2 border-t border-line px-4 py-2.5 text-xs text-muted">
          <Waveform bars={4} />
          <span>Updating note…</span>
        </div>
      )}
    </div>
  );
}

