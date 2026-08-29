"""Copilot backend — FastAPI application.

Phase 2 exposes:
    GET  /                          -> service info
    GET  /health                    -> liveness
    WS   /ws/live/{session_id}      -> scripted live-stream demo

Run (from the `server/` directory):
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, APIRouter
from fastapi.middleware.cors import CORSMiddleware

import config
from stream import live_session

app = FastAPI(title="Copilot Backend", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict:
    return {"service": "Copilot Backend", "phase": 2, "status": "ok"}


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "deepgram_key_configured": bool(config.DEEPGRAM_API_KEY),
        "grok_key_configured": bool(config.GROK_API_KEY),
        "cartesia_key_configured": bool(config.CARTESIA_API_KEY),
    }


router = APIRouter()


@router.websocket("/ws/live/{session_id}")
async def ws_live(websocket: WebSocket, session_id: str) -> None:
    await live_session(websocket, session_id)


app.include_router(router)
