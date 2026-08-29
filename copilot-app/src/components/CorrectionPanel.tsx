"use client";

import { useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { TypePill } from "./TypePill";
import { useStore } from "@/lib/store";
import {
  TYPE_LABEL,
  type Block,
  type NoteType,
} from "@/lib/types";

const QUICK_TYPES: NoteType[] = [
  "key_point",
  "decision",
  "action_item",
  "question",
  "note",
];

/** Mock natural-language interpretation for Phase 1. */
function interpretCorrection(original: Block, text: string): Partial<Block> {
  const lower = text.toLowerCase();
  let type: NoteType | undefined;
  if (/(task|to do|deadline|should .+ by |will .+ by |owner)/.test(lower))
    type = "action_item";
  else if (/(decision|agreed|settled|decided|we decided)/.test(lower))
    type = "decision";
  else if (/(question|ask|wondering|open question|unsure)/.test(lower))
    type = "question";
  else if (/(key point|key takeaway|important point|insight|the point is)/.test(lower))
    type = "key_point";

  const clean = text
    .replace(/^(this|that|it)\s+(is|was|should be|should have been)\s+/i, "")
    .trim();
  const detail =
    `Corrected note: "${text.trim()}". ` +
    (original.detail ? `${original.detail}` : "Recategorized by you.");

  if (type) {
    return { type, title: clean || original.title, detail };
  }
  return { title: clean || original.title, detail, flagged: false, confidence: 0.9 };
}

export function CorrectionPanel({
  block,
  onClose,
  onUpdated,
}: {
  block: Block | null;
  onClose: () => void;
  onUpdated: (before: Block, after: Block) => void;
}) {
  if (!block) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center bg-ink/30 p-6 pt-[10vh]"
      onClick={onClose}
    >
      <div
        key={block.id}
        className="animate-fade-in-up grid w-full max-w-3xl gap-5 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: original block with red note */}
        <Card className="p-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-flagged">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path d="M12 5v6m0 4.01.01-.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            Something looks wrong
          </div>
          <div className="rounded-[10px] border border-flagged/20 bg-flagged-soft/40 p-3">
            <TypePill type={block.type} />
          </div>
          <div className="mt-3 text-[15px] font-semibold text-ink">{block.title}</div>
          {block.detail && <p className="mt-1 text-sm text-muted">{block.detail}</p>}
          <div className="mt-3 text-xs text-flagged">
            {block.flagged
              ? "Copilot marked this low-confidence and got it wrong."
              : "This note doesn't look right."}
          </div>
        </Card>

        <CorrectionForm
          key={block.id}
          block={block}
          onClose={onClose}
          onUpdated={onUpdated}
        />
      </div>
    </div>
  );
}

function CorrectionForm({
  block,
  onClose,
  onUpdated,
}: {
  block: Block;
  onClose: () => void;
  onUpdated: (before: Block, after: Block) => void;
}) {
  const { correctBlock } = useStore();
  const [text, setText] = useState("");
  const [pickedType, setPickedType] = useState<NoteType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleUpdate() {
    setSubmitting(true);

    // Simulate a quick round trip, then apply
    setTimeout(() => {
      let patch: Partial<Block>;
      if (pickedType) {
        patch = {
          type: pickedType,
          detail: `${block.detail ?? ""}${
            block.detail ? " " : ""
          }Reclassified by you.`.trim(),
          confidence: Math.min(0.98, block.confidence + 0.12),
        };
      } else if (text.trim()) {
        patch = interpretCorrection(block, text);
      } else {
        patch = {};
      }
      correctBlock(block.id, patch);
      const after: Block = {
        ...block,
        ...patch,
        type: patch.type ?? block.type,
        userCorrected: true,
        flagged: false,
      };
      setSubmitting(false);
      onUpdated(block, after);
    }, 500);
  }

  return (
    <Card className="p-5">
      <h3 className="text-[15px] font-semibold text-ink">What did Copilot get wrong?</h3>
      <p className="mb-3 mt-1 text-xs text-muted">
        Describe the fix in plain language, or pick the right type.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. this was an example, not a task"
        rows={3}
        className="w-full resize-none rounded-[10px] border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
      />

      <div className="mb-2 mt-3 text-xs font-medium text-muted">Or tap a type</div>
      <div className="flex flex-wrap gap-2">
        {QUICK_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setPickedType(t === block.type ? null : t)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              pickedType === t
                ? "border-accent bg-accent text-white"
                : "border-border bg-white text-muted hover:border-accent/40 hover:text-ink"
            }`}
          >
            {TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          disabled={submitting || (!text.trim() && !pickedType)}
        >
          {submitting ? "Updating…" : "Update note"}
        </Button>
      </div>
    </Card>
  );
}
