# Copilot — Ambient Knowledge Companion

Copilot listens quietly during meetings, lectures, and workshops and turns the
conversation into **clean, structured notes in real time** — correctable in
plain language, without ever interrupting the flow.

It is **not a transcription tool**. It decides, live, what kind of thing is
being said (a **key point**, a **decision**, an **action item**, a **question**),
formats it on the fly with a confidence score, and lets you fix it in one tap
or one sentence (human-in-the-loop correction).

This repository currently contains the **frontend application** (`copilot-app/`),
a Next.js (App Router, TypeScript, Tailwind) client for the full product:
setup, live listening, structured notes feed, correction, final review,
history, and Markdown export.

---

## What's built so far

1. **Welcome** — start a session or jump into past notes.
2. **Session setup** — name it, pick a type (Meeting / Lecture / Workshop),
   choose capture mode.
3. **Listening & auto-capture** — live raw transcript on the left, structured
   notes on the right. Each note is auto-tagged with a type + confidence, and
   low-confidence notes are flagged.
4. **Correction** — fix a wrong block by natural language or a quick type-chip
   while the session keeps running.
5. **End session & review** — auto-generated recap grouped by
   Key Points / Decisions / Action Items / Open Questions.
6. **History & export** — browse past sessions and export notes as Markdown.

### Two capture modes

- **Demo** (default) — a scripted conversation plays from the browser. No
  backend needed; the fastest way to see the flow.
- **Live** — streams the conversation **over a WebSocket** so the real-time
  UI is driven by actual socket events. The FastAPI backend that powers this
  is under active development and is **not included in this repository** yet.

---

## Quick start

You only need Node.

```bash
cd copilot-app
npm install
npm run dev
```

Open **http://localhost:3000** (Next.js may pick another port if 3000 is busy —
it prints the URL), start a session with **Capture mode: Demo**, and click
through the flow.

---

## Useful commands

| Task                | Command                              |
|---------------------|--------------------------------------|
| Run the frontend    | `cd copilot-app && npm run dev`      |
| Lint the frontend   | `cd copilot-app && npm run lint`     |
| Build the frontend  | `cd copilot-app && npm run build`    |
| Run on another port | `cd copilot-app && npm run dev -- -p 3001` |

---

## Project layout

```
.
└── copilot-app/            # Next.js frontend
    ├── src/app/            # pages (welcome, setup, session, notes, review…)
    ├── src/components/     # shared UI components
    └── src/lib/            # store, types, mock data
```

Planned/documented work that is intentionally **not** in this repository:
the FastAPI backend (`server/`), product/design docs, architecture notes, and
the Figma MVP.
