"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type {
  Block,
  CaptureMode,
  NoteType,
  Session,
  SessionType,
} from "./types";
import { FLAG_THRESHOLD } from "./types";

interface CreateSessionInput {
  name: string;
  type: SessionType;
  captureMode: CaptureMode;
}

interface StoreValue {
  currentSession: Session | null;
  completedSessions: Session[];
  createSession: (input: CreateSessionInput) => Session;
  endSession: () => void;
  addBlock: (block: Omit<Block, "sessionId" | "flagged" | "userCorrected" | "userConfirmed" | "createdAt">) => void;
  correctBlock: (
    id: string,
    correction: { type?: NoteType; title?: string; detail?: string }
  ) => void;
  confirmBlock: (id: string) => void;
  revertBlock: (id: string) => void;
  getSession: (id: string) => Session | undefined;
}

const StoreContext = createContext<StoreValue | null>(null);

function makeBlock(
  partial: Omit<Block, "sessionId" | "flagged" | "userCorrected" | "userConfirmed" | "createdAt">,
  sessionId: string
): Block {
  return {
    ...partial,
    sessionId,
    confidence: partial.confidence,
    flagged: partial.confidence < FLAG_THRESHOLD,
    userCorrected: false,
    userConfirmed: false,
    createdAt: new Date().toISOString(),
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [completedSessions, setCompletedSessions] = useState<Session[]>([]);

  const createSession: StoreValue["createSession"] = ({ name, type, captureMode }) => {
    const session: Session = {
      id: `sess_${Math.random().toString(36).slice(2, 8)}`,
      name,
      type,
      captureMode,
      startedAt: new Date().toISOString(),
      blocks: [],
      corrections: 0,
      status: "active",
    };
    setCurrentSession(session);
    return session;
  };

  const endSession = () => {
    setCurrentSession((cur) => {
      if (!cur) return cur;
      const ended: Session = {
        ...cur,
        status: "completed",
        endedAt: new Date().toISOString(),
        durationMinutes: Math.max(
          1,
          Math.round(
            (Date.now() - new Date(cur.startedAt).getTime()) / 60000
          )
        ),
      };
      setCompletedSessions((prev) => {
        const idx = prev.findIndex((s) => s.id === ended.id);
        if (idx === -1) return [ended, ...prev];
        const copy = [...prev];
        copy[idx] = ended;
        return copy;
      });
      return ended;
    });
  };

  const addBlock: StoreValue["addBlock"] = (partial) => {
    setCurrentSession((cur) => {
      if (!cur) return cur;
      const block = makeBlock(partial, cur.id);
      return { ...cur, blocks: [...cur.blocks, block] };
    });
  };

  const correctBlock: StoreValue["correctBlock"] = (id, correction) => {
    setCurrentSession((cur) => {
      if (!cur) return cur;
      const blocks = cur.blocks.map((b) => {
        if (b.id !== id) return b;
        const original = b.original ?? {
          type: b.type,
          title: b.title,
          detail: b.detail,
          confidence: b.confidence,
        };
        return {
          ...b,
          type: correction.type ?? b.type,
          title: correction.title ?? b.title,
          detail:
            correction.detail !== undefined ? correction.detail : b.detail,
          userCorrected: true,
          userConfirmed: false,
          original,
          confidence:
            correction.type && correction.type !== b.type
              ? Math.min(0.98, b.confidence + 0.12)
              : b.confidence,
          flagged: false,
        };
      });
      return { ...cur, blocks, corrections: cur.corrections + 1 };
    });
  };

  const confirmBlock: StoreValue["confirmBlock"] = (id) => {
    setCurrentSession((cur) => {
      if (!cur) return cur;
      const blocks = cur.blocks.map((b) =>
        b.id === id
          ? { ...b, userConfirmed: true, flagged: false, userCorrected: false }
          : b
      );
      return { ...cur, blocks };
    });
  };

  const revertBlock: StoreValue["revertBlock"] = (id) => {
    setCurrentSession((cur) => {
      if (!cur) return cur;
      const blocks = cur.blocks.map((b) => {
        if (b.id !== id || !b.original) return b;
        return {
          ...b,
          type: b.original.type,
          title: b.original.title,
          detail: b.original.detail,
          confidence: b.original.confidence,
          userCorrected: false,
          userConfirmed: false,
          flagged: b.original.confidence < FLAG_THRESHOLD,
          original: undefined,
        };
      });
      return { ...cur, blocks };
    });
  };

  const getSession = (id: string) =>
    currentSession?.id === id
      ? currentSession
      : completedSessions.find((s) => s.id === id);

  return (
    <StoreContext.Provider
      value={{
        currentSession,
        completedSessions,
        createSession,
        endSession,
        addBlock,
        correctBlock,
        confirmBlock,
        revertBlock,
        getSession,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
