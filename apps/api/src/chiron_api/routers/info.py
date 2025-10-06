from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter()


@router.get("/", name="info:meta")
async def info_root() -> dict[str, object]:
    return {
        "name": "Chiron",
        "version": "0.1.0",
        "description": "Unified security, observability, and dependency intelligence platform",
        "documentation": {
            "openapi": "/openapi.json",
            "docs": "/docs",
        },
        "links": {
            "runbooks": "/docs/runbooks",
            "status": "/health",
        },
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
