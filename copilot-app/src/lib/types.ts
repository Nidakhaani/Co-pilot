export type NoteType =
  | "key_point"
  | "decision"
  | "action_item"
  | "question"
  | "note";

export type SessionType = "meeting" | "lecture" | "workshop";

export type CaptureMode = "demo" | "live";

export interface Block {
  id: string;
  sessionId: string;
  type: NoteType;
  title: string;
  detail?: string;
  confidence: number; // 0-1
  flagged: boolean; // true if confidence below threshold (e.g. 0.65)
  userCorrected: boolean;
  userConfirmed: boolean; // user accepted the block as-captured
  /** Snapshot before any user correction, used to revert. */
  original?: {
    type: NoteType;
    title: string;
    detail?: string;
    confidence: number;
  };
  createdAt: string;
}

export interface Session {
  id: string;
  name: string;
  type: SessionType;
  captureMode: CaptureMode;
  startedAt: string;
  endedAt?: string;
  durationMinutes?: number;
  blocks: Block[];
  corrections: number;
  status: "active" | "completed";
}

export const FLAG_THRESHOLD = 0.65;

export const TYPE_LABEL: Record<NoteType, string> = {
  key_point: "Key point",
  decision: "Decision",
  action_item: "Action item",
  question: "Question",
  note: "Note",
};

export const SESSION_TYPE_LABEL: Record<SessionType, string> = {
  meeting: "Meeting",
  lecture: "Lecture",
  workshop: "Workshop",
};
