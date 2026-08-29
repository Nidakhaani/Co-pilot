import type { NoteType } from "@/lib/types";
import { TYPE_LABEL } from "@/lib/types";

const typeStyles: Record<NoteType, { pill: string; dot: string }> = {
  key_point: { pill: "bg-keypoint-soft text-keypoint", dot: "bg-keypoint" },
  decision: { pill: "bg-decision-soft text-decision", dot: "bg-decision" },
  action_item: { pill: "bg-action-soft text-action", dot: "bg-action" },
  question: { pill: "bg-question-soft text-question", dot: "bg-question" },
  note: { pill: "bg-note-soft text-note", dot: "bg-note" },
};

const typeHex: Record<NoteType, string> = {
  key_point: "#0f766e",
  decision: "#4f46e5",
  action_item: "#d97a06",
  question: "#9333ea",
  note: "#64748b",
};

export function TypePill({
  type,
  flagged = false,
  confirmed = false,
}: {
  type: NoteType;
  flagged?: boolean;
  confirmed?: boolean;
}) {
  if (flagged) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-flagged/20 bg-flagged-soft px-2.5 py-0.5 text-xs font-semibold text-flagged">
        <span className="h-1.5 w-1.5 rounded-full bg-flagged" />
        Flagged
      </span>
    );
  }
  if (confirmed) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-confirmed/25 bg-confirmed-soft px-2.5 py-0.5 text-xs font-semibold text-confirmed">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Confirmed
      </span>
    );
  }
  const s = typeStyles[type];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.pill}`}
      style={{ borderColor: `${typeHex[type]}26` }}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {TYPE_LABEL[type]}
    </span>
  );
}
