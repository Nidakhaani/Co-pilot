# Copilot — Ambient Knowledge Companion

Copilot listens quietly during meetings, lectures, and workshops and turns the
conversation into **clean, structured notes in real time** — correctable in
plain language, without ever interrupting the flow.

It is **not a transcription tool**. It decides, live, what kind of thing is
being said (a **key point**, a **decision**, an **action item**, a **question**),
formats it on the fly with a confidence score, and lets you fix it in one tap
or one sentence (human-in-the-loop correction).

```
[ Next.js Client ]  <--WebSocket-->  [ FastAPI Backend ]
                                          (streams the conversation
                                           and classified notes)
```

- **`copilot-app/`** — Next.js (App Router, TypeScript, Tailwind) frontend.
  The whole product UI: setup, live listening, structured notes feed,
  correction, final review, history, Markdown export.
- **`server/`** — FastAPI (Python) backend. In the current phase it exposes a
  WebSocket live-stream endpoint that pushes a scripted conversation, so the
  frontend consumes real socket events end to end.
- **Later phases** will swap the scripted stream for real speech-to-text
  (Deepgram), AI classification (Grok / xAI), and text-to-speech (Cartesia).
  API-key placeholders are already scaffolded in `server/.env.example`.

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
- **Live** — streams the conversation **over a WebSocket** from the FastAPI
  backend. Same UI, real socket events.

---

## Quick start (simplest path — Demo mode only)

You don't need anything but Node for this.

```bash
cd copilot-app
npm install
npm run dev
```

Open **http://localhost:3000**, start a session with **Capture mode: Demo**,
and click through the flow. No backend, no keys, nothing else to run.

---

## Full setup (Demo + Live WebSocket streaming)

### 1. Frontend (Next.js)

```bash
cd copilot-app
npm install
npm run dev
```

Runs on **http://localhost:3000** by default.

### 2. Backend (FastAPI)

```bash
cd server
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

- Service info: http://127.0.0.1:8000/
- Health check: http://127.0.0.1:8000/health

### 3. Try Live mode

1. Both servers running (backend on **8000**, app on **3000**).
2. Open http://localhost:3000 → **Start a new session**.
3. Set **Capture mode: Live** → **Start listening (live)**.
4. The Live pane fills as blocks stream in over the WebSocket, then
   auto-completes.

> **Port 3000 already taken?** Run the app on another port:
> `cd copilot-app && npm run dev -- -p 3001`. The backend accepts origins on
> both **3000** and **3001** by default, so Live mode works either way.

---

## How the WebSocket protocol works

**Backend → frontend** (JSON messages over `ws://localhost:8000/ws/live/{session_id}`):

| `type`       | `data`                                            | meaning                            |
|--------------|---------------------------------------------------|------------------------------------|
| `transcript` | `{ raw, is_final }`                               | raw speech line (ghost or final)   |
| `block`      | `{ id, type, title, detail, confidence, flagged }`| a classified note                  |
| `done`       | `{ count }`                                       | stream finished                    |

---

## Project layout

```
.
├── copilot-app/            # Next.js frontend
│   ├── src/app/            # pages (welcome, setup, session, notes, review…)
│   ├── src/components/     # UI components
│   └── src/lib/            # store, types, mock data
└── server/                 # FastAPI backend
    ├── main.py             # app, routes, /health, WebSocket endpoint
    ├── stream.py           # scripted stream generator
    ├── config.py           # env config + phase-3 key placeholders
    └── requirements.txt
```

---

## Configuration & API keys

Phase 2 (Demo + Live WebSocket) needs **no API keys**.

Phase 3 (real STT/LLM/TTS) will read keys from `server/.env` (see
`server/.env.example`):

| Key                  | Provider | Get it at                     | Used for          |
|----------------------|----------|-------------------------------|-------------------|
| `DEEPGRAM_API_KEY`   | Deepgram | https://console.deepgram.com/ | Speech-to-text    |
| `GROK_API_KEY`       | xAI/Grok | https://console.x.ai/         | AI classification |
| `CARTESIA_API_KEY`   | Cartesia | https://play.cartesia.ai/     | Text-to-speech    |

Copy the example and fill in values when you reach that phase:

```bash
cd server
copy .env.example .env      # Windows
# cp .env.example .env      # macOS/Linux
```

The frontend's WebSocket URL can be overridden with `NEXT_PUBLIC_WS_URL` in
`copilot-app/.env.local` (see `copilot-app/.env.local.example`); it defaults to
`ws://127.0.0.1:8000`.

---

## Useful commands

| Task                     | Command                                          |
|--------------------------|--------------------------------------------------|
| Run the frontend         | `cd copilot-app && npm run dev`                  |
| Run the backend          | `cd server && uvicorn main:app --reload --port 8000` |
| Lint the frontend        | `cd copilot-app && npm run lint`                 |
| Build the frontend       | `cd copilot-app && npm run build`                |
| Install backend deps     | `cd server && pip install -r requirements.txt`   |
