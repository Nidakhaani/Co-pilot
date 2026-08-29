import type { NoteType } from "./types";

export interface StreamItem {
  id: string;
  /** Raw transcript text shown in "Live Conversation" before classification. */
  raw: string;
  /** Delay in ms before this item appears after the previous one. */
  delay: number;
  /** The classified block that gets finalized after a short gap. */
  block: {
    type: NoteType;
    title: string;
    detail?: string;
    confidence: number;
  };
}

/**
 * Scripted, pre-classified stream used to simulate live capture during Phase 1.
 * Each chunk has a raw transcript line plus the block it will become.
 */
export const SCRIPTED_STREAM: StreamItem[] = [
  {
    id: "s1",
    raw: "Okay, let's kick this off. The big theme for this quarter is shipping a more polished, quieter AI product experience.",
    delay: 600,
    block: {
      type: "key_point",
      title: "Quarterly theme: a more polished AI product experience",
      detail: "Goal for the quarter across all workstreams.",
      confidence: 0.94,
    },
  },
  {
    id: "s2",
    raw: "I think we should all agree that voice notes stay the primary input medium — no surprise there.",
    delay: 2400,
    block: {
      type: "decision",
      title: "Voice notes remain the primary input medium",
      detail: "Confirmed by the whole group.",
      confidence: 0.91,
    },
  },
  {
    id: "s3",
    raw: "Maya, could you draft the onboarding copy we talked about before the end of the week?",
    delay: 3200,
    block: {
      type: "action_item",
      title: "Maya — draft onboarding copy before end of the week",
      detail: "Owner: Maya. Deadline: end of week.",
      confidence: 0.88,
    },
  },
  {
    id: "s4",
    raw: "One thing I'm still unsure about — how much should the recap be customizable versus kept strict and simple?",
    delay: 3000,
    block: {
      type: "question",
      title: "How customizable should the recap be?",
      detail: "Open question — strict and simple vs. flexible templates.",
      confidence: 0.82,
    },
  },
  {
    id: "s5",
    raw: "Just so we're all tracking, the beta is currently on 40 testers and we saw activation jump around twelve percent.",
    delay: 2800,
    block: {
      type: "key_point",
      title: "Beta has 40 testers; activation up ~12%",
      detail: "Early signal, not yet conclusive.",
      confidence: 0.6,
    },
  },
  {
    id: "s6",
    raw: "A quick note on tone so it doesn't get lost: we want the language to feel calm and trustworthy.",
    delay: 2600,
    block: {
      type: "note",
      title: "Tone should feel calm and trustworthy",
      detail: "Applies to all in-product copy.",
      confidence: 0.9,
    },
  },
  {
    id: "s7",
    raw: "Then it's settled — we're pushing the export feature to the start of next sprint, no debate.",
    delay: 3000,
    block: {
      type: "decision",
      title: "Export feature moves to start of next sprint",
      detail: "Group decision — no debate.",
      confidence: 0.96,
    },
  },
  {
    id: "s8",
    raw: "Dev, could you set up the analytics dashboard and tag each onboarding step by tomorrow morning?",
    delay: 2700,
    block: {
      type: "action_item",
      title: "Dev — set up analytics dashboard with per-step tagging",
      detail: "Owner: Dev. Deadline: tomorrow morning.",
      confidence: 0.9,
    },
  },
  {
    id: "s9",
    raw: "I keep going back and forth, but I'd like to hear whether the team prefers a weekly email digest or a more silent, in-app summary.",
    delay: 3000,
    block: {
      type: "question",
      title: "Weekly email digest vs. silent in-app summary?",
      detail: "Soliciting team preference.",
      confidence: 0.84,
    },
  },
  {
    id: "s10",
    raw: "Alright, that wraps us up — I'll send the full recap, and everyone should have their action items in their inbox tonight.",
    delay: 2600,
    block: {
      type: "action_item",
      title: "Recap will be distributed tonight with action items",
      detail: "Owner: organizer. Timing: tonight.",
      confidence: 0.92,
    },
  },
];

// Scripted raw transcript that the "Live Conversation" pane cycles through,
// independent of finalized blocks, to feel continuous.
export const SCRIPTED_GHOST = [
  "Okay, let's kick this off...",
  "the big theme this quarter is...",
  "I think we should all agree that...",
  "Maya, could you draft the onboarding copy...",
  "One thing I'm still unsure about...",
  "the beta is currently on 40 testers...",
  "we want the language to feel calm and trustworthy...",
  "we're pushing the export feature to...",
  "Dev, could you set up the analytics dashboard...",
  "a weekly email digest or a silent summary...",
  "I'll send the full recap, everyone should have...",
];
