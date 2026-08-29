"""WebSocket live-stream protocol for Copilot.

Phase 2 prototype: streams a scripted conversation so the frontend consumes
real WebSocket events (instead of a local timer). The message shapes are
designed to be identical to what Phase 3 will produce from Deepgram + LLM.

Message types (sent as JSON over the socket):

    {"type": "transcript", "data": {"raw": str, "is_final": bool}}
        A growing line of raw speech. `is_final: false` is a ghost/partial
        line; `is_final: true` means the transcript segment is complete.

    {"type": "block", "data": Block}
        A finalized, classified note. Block fields mirror the frontend model:
        id, type, title, detail, confidence, flagged.

    {"type": "done", "data": {"count": int}}
        Signals the end of the streamed demo.
"""

from __future__ import annotations

import asyncio
from typing import AsyncIterator

from fastapi import WebSocket, WebSocketDisconnect

import config

# A scripted "conversation". Each item yields one ghost (partial) line, one
# final line, and then a classified block. Delays mimic live capture pacing.
SCRIPTED_STREAM = [
    {
        "raw": "Okay, let's kick this off. The big theme this quarter is shipping a more polished, quieter AI product experience.",
        "block": {
            "type": "key_point",
            "title": "Quarterly theme: a more polished AI product experience",
            "detail": "Goal for the quarter across all workstreams.",
            "confidence": 0.94,
        },
    },
    {
        "raw": "I think we should all agree that voice notes stay the primary input medium, no surprise there.",
        "block": {
            "type": "decision",
            "title": "Voice notes remain the primary input medium",
            "detail": "Confirmed by the whole group.",
            "confidence": 0.91,
        },
    },
    {
        "raw": "Maya, could you draft the onboarding copy we talked about before the end of the week?",
        "block": {
            "type": "action_item",
            "title": "Maya — draft onboarding copy before end of the week",
            "detail": "Owner: Maya. Deadline: end of week.",
            "confidence": 0.88,
        },
    },
    {
        "raw": "One thing I'm still unsure about, how much should the recap be customizable versus kept strict and simple?",
        "block": {
            "type": "question",
            "title": "How customizable should the recap be?",
            "detail": "Open question — strict and simple vs. flexible templates.",
            "confidence": 0.82,
        },
    },
    {
        "raw": "Just so we're all tracking, the beta is currently on 40 testers and we saw activation jump around twelve percent.",
        "block": {
            "type": "key_point",
            "title": "Beta has 40 testers; activation up ~12%",
            "detail": "Early signal, not yet conclusive.",
            "confidence": 0.6,
        },
    },
    {
        "raw": "Then it's settled, we're pushing the export feature to the start of next sprint, no debate.",
        "block": {
            "type": "decision",
            "title": "Export feature moves to start of next sprint",
            "detail": "Group decision — no debate.",
            "confidence": 0.96,
        },
    },
    {
        "raw": "Dev, could you set up the analytics dashboard and tag each onboarding step by tomorrow morning?",
        "block": {
            "type": "action_item",
            "title": "Dev — set up analytics dashboard with per-step tagging",
            "detail": "Owner: Dev. Deadline: tomorrow morning.",
            "confidence": 0.9,
        },
    },
]


async def stream_events() -> AsyncIterator[dict]:
    """Async generator of WebSocket messages for the scripted demo."""
    line_delay = config.STREAM_LINE_DELAY
    finalize_delay = config.STREAM_FINALIZE_DELAY

    for i, item in enumerate(SCRIPTED_STREAM):
        raw = item["raw"]
        half = max(1, len(raw) // 2)

        # Ghost/partial line (first half, growing feel)
        yield {"type": "transcript", "data": {"raw": raw[:half], "is_final": False}}
        await asyncio.sleep(line_delay)

        # Final line (full text)
        yield {"type": "transcript", "data": {"raw": raw, "is_final": True}}
        await asyncio.sleep(finalize_delay)

        # Classified block
        block = {
            "id": f"blk_{i:03d}",
            "type": item["block"]["type"],
            "title": item["block"]["title"],
            "detail": item["block"].get("detail"),
            "confidence": item["block"]["confidence"],
            "flagged": item["block"]["confidence"] < 0.65,
        }
        yield {"type": "block", "data": block}
        await asyncio.sleep(line_delay)

    yield {"type": "done", "data": {"count": len(SCRIPTED_STREAM)}}


async def live_session(websocket: WebSocket, session_id: str) -> None:
    """Handle a single live-session WebSocket connection.

    Phase 2: streams scripted data. Phase 3 will receive audio frames from the
    client and stream STT + classification results back instead.
    """
    await websocket.accept()
    try:
        # Optional client handshake (a client may send a {"action":"start"}).
        # Phase 2 ignores inbound bytes; everything is pushed server-side.
        await asyncio.sleep(0.1)

        async for message in stream_events():
            await websocket.send_json(message)

    except WebSocketDisconnect:
        # Client closed the connection — nothing to clean up in Phase 2.
        return
    except Exception:
        # Unexpected error — terminate the socket rather than hang it.
        try:
            await websocket.close(code=1011, reason="stream_error")
        except Exception:
            pass
