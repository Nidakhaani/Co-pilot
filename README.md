# Copilot — Ambient Knowledge Companion

Copilot listens quietly during meetings, lectures, and workshops and turns the conversation into **clean, structured notes in real time** — correctable in plain language, without ever interrupting the flow.

It is **not a transcription tool**. It decides, live, what kind of thing is being said (a **key point**, a **decision**, an **action item**, a **question**, a **note**), formats it on the fly with a confidence score, and lets you fix it in one tap or one sentence without ever blocking capture.

This repository currently contains the **frontend application only** (`copilot-app/`) — a Next.js App Router + TypeScript + Tailwind client. The backend, product docs, architecture notes and Figma MVP are intentionally not tracked here and live locally.

---

## Phase 1 — Present (this repo) ✅

**Status: Implemented and shipped in this repo. Everything below runs today with `npm run dev` and no backend.**

**Shell & Navigation**
- Welcome, Setup, Listening Session (`/session/[id]`), Review (`/review`), History (`/notes`), Note detail (`/notes/[id]`) — 7 screens built
- App shell with `BrandHeader` logo that links to `/` from anywhere, sticky header, theme and layout

**Landing Page (`/`)**
- Hero with CTA, core loop (It listens → It understands → You refine → It wraps up), five note types, correction explainer, demo notice
- "Watch the demo" section with a 16:9 `Coming soon` placeholder — video player area shows a play icon + *Demo video coming soon / A short walkthrough is being prepared* until `public/demo.mp4` is added; text column with *Try the interactive demo* CTA
- Footer branding

**Demo Capture Mode (default, no backend)**
- Scripted `SCRIPTED_STREAM` plays letter-by-letter (ghost transcript) on the left, classifies into `Block` on the right with `type / title / detail / confidence / flagged`
- `flagged = confidence < 0.65` — low-confidence notes highlighted with *Low confidence / Edit to fix*
- HITL correction: `CorrectionPanel` + `TypePill` chips + `correctBlock / revertBlock / confirmBlock` via app store; `Toast` + `UpdateComparison` feedback; listening never blocks
- Explicit end-of-stream state and *End session & review* flow

**Listening UI — Scroll & Layout**
- Two-pane layout: **Live Conversation** (left) and **Your Notes** (right) are each a single `Card` window — `flex-col overflow-hidden` with a header, a single `overflow-y-auto` scroll window, and a footer
- On overflow, each window auto-scrolls to the newest item (hiding the oldest at the top); user can scroll up inside that same window to see history — cards keep full height (`shrink-0`), no minimizing/squashing
- Left scroll: transcript history bubbles + ghost `typedRaw / liveLine` with blinking caret
- Right scroll: `BlockItem` cards (accent bar + TypePill + confidence + Edit/Revert); demo complete callout scrolls into view; auto-scroll via `notesScrollRef / transcriptScrollRef` + `scrollTop = scrollHeight`

**Review & History**
- `/review` groups the session into recap cards by type with counts; duration + note count + *Open full notes / Save session*
- `/notes` list + `/notes/[id]` detail; local Markdown export

**State & Types**
- `src/lib/store.tsx` — session + blocks lifecycle, `makeBlock`, correction persistence
- `src/lib/types.ts` — `NoteType`, `Block`, `CaptureMode = "demo" | "live"`, `Session`
- `src/lib/mock-data.ts` — scripted data driving the demo

**Polish**
- BrandHeader is a `next/link` to `/`; hero LogoMark is also linked to `/`
- Lint + build pass (`eslint`, `next build`); `public/` placeholder SVGs removed (kept `.gitkeep` for future `demo.mp4`)

---

## Phase 2 — Backend Live Streaming (next, not in this repo)

**Status: Built locally, not pushed. Kept out of GitHub per frontend-only policy (`/server/` is gitignored). Will be published when stable.**

- Stack: **FastAPI + Python** (`server/main.py`, `stream.py`, `config.py`) with a `GET /health` and a `GET /ws/live/{session_id}` WebSocket endpoint
- Protocol mirrors the frontend model so the Live capture mode consumes real socket events instead of the local timer:
  `{"type":"transcript","data":{"raw":str,"is_final":bool}}` → `{"type":"block","data":Block}` → `{"type":"done","data":{"count":int}}`
- `setup` toggle: Demo (local stream) vs Live (socket consumers in `session/[id]/page.tsx` — `useEffect` WebSocket consumer + `liveStatus`/`liveLine` state)
- CORS origins, pacing `STREAM_LINE_DELAY / STREAM_FINALIZE_DELAY`, `.env.example` scaffolding
- Verified: Python venv install, `uvicorn main:app --reload --port 8000`, Python WS client confirms 7 ghost + 7 final + 7 blocks + done; frontend consumer builds and renders via WS; `NEXT_PUBLIC_WS_URL` override

When published, this phase makes Live mode end-to-end with the browser as a real socket client, while Demo remains as a fallback toggle.

---

## Phase 3 — Real Intelligence (planned)

- **STT:** Deepgram — `DEEPGRAM_API_KEY` at `server/.env` (from `server/.env.example`), streaming audio → transcript
- **LLM classification:** Grok via xAI OpenAI-compatible API — `GROK_API_KEY / GROK_BASE_URL=https://api.x.ai/v1 / GROK_MODEL=grok-3-mini` — classifies each utterance into the 5-type taxonomy with confidence + flagged logic
- **TTS / voice feedback (optional):** Cartesia — `CARTESIA_API_KEY` at `server/.env`
- Backend will bridge STT → LLM → WS `block` events; `/health` will surface `*_key_configured`; frontend stays the same consumer
- No auth / no multi-user / desktop-first for this cut

---

## Phase 4 — Documentation & Export (planned, demo slice described)

- **Final documentation phase:** after *End session* → review is fully **editable** — same `BlockItem` edit/revert + `CorrectionPanel` inside the recap before anything is finalized
- **Confirm & document everything:** a single *Confirm and document everything* CTA at the end of the review generates and downloads a **local Obsidian-friendly `.md` file** (no external service in the demo):
  - YAML frontmatter (`title / date / session type / tags`), `#` title + executive summary, tables for decisions/action items/questions, fenced code blocks for any code-like notes, task lists (`- [ ]`), `[[wiki-links]]` where applicable, and `confidence` metadata callouts
- **Demo slice (for now):** a readymade `.md` template is used — prefilled tables + code + checklists + frontmatter — so the download works end-to-end before the generated-doc pipeline is wired
- Later: real generated Markdown from the session's final blocks + export destination options

---

## Quick start (Demo — no backend)

You only need Node 18+.

```bash
cd copilot-app
npm install
npm run dev
```

Open the URL Next prints (usually http://localhost:3000; it picks 3001 if 3000 is busy), start a session with **Capture mode: Demo**, and click through the flow. Click the Copilot logo anywhere to return to the landing page.

## Useful commands

| Task | Command |
|------|---------|
| Run the frontend | `cd copilot-app && npm run dev` |
| Run on another port | `cd copilot-app && npm run dev -- -p 3001` |
| Lint | `cd copilot-app && npm run lint` |
| Build | `cd copilot-app && npm run build` |

## Project layout (what is in this repo)

```
.
├── README.md
├── .gitignore
├── CONTEXT.md              # local-only, not tracked (see below)
└── copilot-app/            # ← only this is tracked
    ├── public/.gitkeep     # reserved for demo.mp4
    ├── src/app/            # /, /welcome, /setup, /session/[id], /review, /notes…
    ├── src/components/     # AppHeader/BrandHeader/Card/BlockItem/CorrectionPanel/Toast/Sidebar…
    └── src/lib/            # store.tsx / types.ts / mock-data.ts
```

Intentionally **not** in this repo (local only): `server/` (FastAPI backend), `COPILOT_PRD.md`, `COPILOT_Design_Doc.md`, `Arch/`, `Co-Pilot Figma MVP/`, `CONTEXT.md`, real `.env` files, `node_modules/.next/.venv/__pycache__`.

Add the demo video when ready by dropping it at `copilot-app/public/demo.mp4` — the landing page placeholder will be swapped for a `<video>` player.
