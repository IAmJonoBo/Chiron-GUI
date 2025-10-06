import asyncio
import json
from logging import getLogger
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.models import ApiClient
from ..db.session import get_async_session
from ..schemas.dashboard import DashboardSummary, TelemetrySnapshotIn
from ..services.auth import get_current_client
from ..services.streaming import TelemetryStreamBroker
from ..services.telemetry import TelemetryRepository

router = APIRouter()
logger = getLogger(__name__)


def get_repository(
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> TelemetryRepository:
    return TelemetryRepository(session)


@router.get("/summary", response_model=DashboardSummary, name="dashboard:summary")
async def get_dashboard_summary(
    repo: Annotated[TelemetryRepository, Depends(get_repository)],
) -> DashboardSummary:
    return await repo.get_dashboard_summary()


@router.post(
    "/samples",
    response_model=DashboardSummary,
    status_code=status.HTTP_202_ACCEPTED,
    name="dashboard:ingest",
)
async def ingest_dashboard_snapshot(
    snapshot: TelemetrySnapshotIn,
    repo: Annotated[TelemetryRepository, Depends(get_repository)],
    request: Request,
    _: Annotated[ApiClient, Depends(get_current_client)],
) -> DashboardSummary:
    summary = await repo.ingest_snapshot(snapshot)
    broker: TelemetryStreamBroker | None = getattr(request.app.state, "telemetry_broker", None)
    if broker is not None:
        await broker.publish(summary)
    return summary


@router.get("/stream", name="dashboard:stream")
async def stream_dashboard_summary(
    request: Request,
    repo: Annotated[TelemetryRepository, Depends(get_repository)],
) -> StreamingResponse:
    broker: TelemetryStreamBroker | None = getattr(request.app.state, "telemetry_broker", None)

    if broker is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Telemetry streaming unavailable",
        )

    async def event_generator():
        try:
            initial_summary = await repo.get_dashboard_summary()
            yield f"data: {initial_summary.model_dump_json()}\n\n"

            async for payload in broker.stream():
                yield f"data: {json.dumps(payload)}\n\n"
        except asyncio.CancelledError:  # pragma: no cover - client disconnected
            logger.debug("Dashboard SSE client disconnected")
            raise

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
