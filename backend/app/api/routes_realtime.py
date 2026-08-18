import asyncio
import time
from typing import Dict, Any, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from app.engine.realtime_streaming import RealtimeStreamingHub, LiveTelemetryFrame
from app.api.routes_products import CATALOG

router = APIRouter(prefix="/realtime", tags=["Real-Time Industrial Telemetry & OPC-UA"])

class TripPayload(BaseModel):
    reason: str = "MANUAL_E_STOP_TRIGGERED"

@router.get("/poll", response_model=LiveTelemetryFrame)
async def poll_live_telemetry(part_number: str = "M3BP 160MLA 4"):
    return RealtimeStreamingHub.generate_live_frame(part_number)

@router.post("/trip")
async def trigger_trip(payload: TripPayload):
    RealtimeStreamingHub.trigger_emergency_trip(payload.reason)
    return {"status": "TRIPPED", "reason": payload.reason}

@router.post("/reset")
async def reset_trip():
    RealtimeStreamingHub.reset_emergency_trip()
    return {"status": "RESET_HEALTHY"}

@router.websocket("/stream")
async def websocket_telemetry_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            frame = RealtimeStreamingHub.generate_live_frame("M3BP 160MLA 4")
            await websocket.send_text(frame.model_dump_json())
            await asyncio.sleep(0.2) # 5 Hz real-time updates
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
