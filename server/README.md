# Copilot Backend

FastAPI backend for the Copilot ambient-knowledge companion.

- **Phase 2 (current):** a WebSocket live-stream endpoint that pushes a
  scripted conversation, so the Next.js client consumes real socket events
  instead of a local timer.
- **Phase 3+:** real speech-to-text (Deepgram), AI classification (Grok),
  and text-to-speech (Cartesia). Keys are already scaffolded in the config.

---

## Setup

```bash
cd server
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` if you want to override settings (optional for Phase 2):

```bash
copy .env.example .env     # Windows
# cp .env.example .env     # macOS/Linux
```

## Run

```bash
uvicorn main:app --reload --port 8000
```

- Service info: `http://127.0.0.1:8000/`
- Health: `http://127.0.0.1:8000/health`

## How to test Phase 2 — the WebSocket stream

### Option A — with the web app (recommended)
1. Start the backend (above).
2. Start the Next.js app: `cd copilot-app && npm run dev` (port 3000).
3. Open `http://localhost:3000` → **Start a new session** → set
   **Capture mode: Live** → **Start listening (live)**.
4. The Live pane should fill as blocks stream in over the WebSocket.

> **Port 3000 already taken?** The dev server falls back to another port
> (e.g. `npm run dev -- -p 3001`). The backend allows `3000` **and** `3001`
> by default, so Live mode works either way. If you use a different port,
> add it to `FRONTEND_ORIGINS` in `server/.env`.

### Option B — with a raw WebSocket client
Any WebSocket client works. Point it at the endpoint:

```
ws://127.0.0.1:8000/ws/live/<any-session-id>
```

Example with Python (in `server/`):

```bash
pip install websockets
python - <<'PY'
import asyncio, json, websockets

async def main():
    async with websockets.connect("ws://127.0.0.1:8000/ws/live/demo1") as ws:
        async for raw in ws:
            msg = json.loads(raw)
            print(msg["type"], msg["data"].get("raw") or
                  msg["data"].get("title") or msg["data"])

asyncio.run(main())
PY
```

You should see `transcript` (ghost then final) lines, then `block` events, then
a final `done` message.

### Option C — browser console
Open the devtools console on the running app and run:

```js
const ws = new WebSocket("ws://127.0.0.1:8000/ws/live/from-console");
ws.onmessage = (e) => console.log(JSON.parse(e.data));
```

---

## WebSocket protocol

Messages are JSON objects pushed from server to client:

| type         | data                                     | meaning                          |
|--------------|------------------------------------------|----------------------------------|
| `transcript` | `{ raw, is_final }`                      | raw speech line (ghost or final) |
| `block`      | `{ id, type, title, detail, confidence, flagged }` | a classified note  |
| `done`       | `{ count }`                              | stream finished                  |

---

## API keys (Phase 3+, where they go)

Phase 2 does **not** need keys. When you start Phase 3, add these to
`server/.env` (from `.env.example`):

| Key                 | Provider  | Get it at            | Used for            |
|---------------------|-----------|----------------------|---------------------|
| `DEEPGRAM_API_KEY`  | Deepgram  | https://console.deepgram.com/ | Speech-to-text (STT) |
| `GROK_API_KEY`      | xAI (Grok)| https://console.x.ai/ | LLM classification  |
| `CARTESIA_API_KEY`  | Cartesia  | https://play.cartesia.ai/ | Text-to-speech (TTS) |

The `/health` endpoint reports whether each key is currently configured.
