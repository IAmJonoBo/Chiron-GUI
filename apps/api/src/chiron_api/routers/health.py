from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter()


@router.get("/", name="health:live")
async def health_live() -> dict[str, str]:
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}


@router.get("/ready", name="health:ready")
async def health_ready() -> dict[str, str]:
    return {"status": "ready", "timestamp": datetime.now(timezone.utc).isoformat()}


@router.get("/live", name="health:heartbeat")
async def health_heartbeat() -> dict[str, str]:
    return {"status": "live", "timestamp": datetime.now(timezone.utc).isoformat()}
