"""Configuration loaded from environment variables (.env).

Phase 2 (this phase) only needs the WebSocket stream and does NOT require any
API keys. The keys below are read lazily and only used by later phases.

Phase 3 (STT):  DEEPGRAM_API_KEY
Phase 3 (LLM):  GROK_API_KEY     (xAI, OpenAI-compatible endpoint)
Phase 3 (TTS):  CARTESIA_API_KEY
"""

import os

from dotenv import load_dotenv

load_dotenv()

# Backend HTTP/WebSocket settings
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))

# Allowed frontend origin(s) for CORS / WebSocket.
# In development the Next.js dev server usually runs on http://localhost:3000;
# port 3001 is included as a fallback for when 3000 is already taken.
FRONTEND_ORIGINS = [
    o.strip()
    for o in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001",
    ).split(",")
    if o.strip()
]

# Playback pacing (seconds) for the Phase 2 scripted stream.
STREAM_LINE_DELAY = float(os.getenv("STREAM_LINE_DELAY", "1.6"))
STREAM_FINALIZE_DELAY = float(os.getenv("STREAM_FINALIZE_DELAY", "0.9"))


# ---------------------------------------------------------------------------
# Phase 3+ API keys (optional for Phase 2 — used by later phases).
# Provide them via a .env file at server/.env (see .env.example).
# ---------------------------------------------------------------------------
def secret(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        return ""
    return value


DEEPGRAM_API_KEY = secret("DEEPGRAM_API_KEY")
GROK_API_KEY = secret("GROK_API_KEY")
GROK_BASE_URL = os.getenv("GROK_BASE_URL", "https://api.x.ai/v1")
GROK_MODEL = os.getenv("GROK_MODEL", "grok-3-mini")
CARTESIA_API_KEY = secret("CARTESIA_API_KEY")
