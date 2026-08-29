import asyncio
import json
import sys

import websockets

URL = "ws://127.0.0.1:8000/ws/live/test-session"


async def main():
    async with websockets.connect(URL) as ws:
        counts = {"transcript_final": 0, "transcript_ghost": 0, "block": 0, "done": 0}
        blocks = []
        done = False
        async for raw in ws:
            msg = json.loads(raw)
            t = msg["type"]
            d = msg.get("data", {})
            if t == "transcript":
                if d.get("is_final"):
                    counts["transcript_final"] += 1
                    print(f"[transcript FINAL] {d['raw'][:60]}...")
                else:
                    counts["transcript_ghost"] += 1
                    print(f"[transcript GHOST]  {d['raw'][:40]}...")
            elif t == "block":
                counts["block"] += 1
                blocks.append(d)
                print(f"[block] {d['type']:<12} {d['title'][:50]} conf={d['confidence']} flagged={d['flagged']}")
            elif t == "done":
                counts["done"] += 1
                done = True
                print(f"[done] count={d.get('count')}")
                break

        print("\n=== SUMMARY ===")
        print(json.dumps(counts, indent=2))
        assert counts["block"] == len(
            blocks
        ), "block count mismatch"
        if not done:
            print("WARNING: no done message received")
            return 1
        print("PASS: stream completed cleanly")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        print("FAIL:", e)
        sys.exit(1)
