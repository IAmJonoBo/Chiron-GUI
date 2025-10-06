import asyncio
import json
from datetime import datetime, timedelta, timezone
from logging import getLogger
from random import SystemRandom, randint

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

router = APIRouter()
logger = getLogger(__name__)


class GateHealth(BaseModel):
    name: str
    score: int = Field(ge=0, le=100)
    status: str


class TimelineEvent(BaseModel):
    time: str
    label: str
    impact: str
    tone: str


class DashboardSummary(BaseModel):
    generated_at: datetime
    hero_gates: list[GateHealth]
    timeline: list[TimelineEvent]


_rng = SystemRandom()

_GATE_BASELINES: dict[str, int] = {
    "Fusion Segment": 93,
    "Kinematics Mesh": 72,
    "Containment Umbra": 85,
    "Reactor Baffles": 58,
}

_TIMELINE_POOL: list[tuple[str, str, str]] = [
    ("Delta Gate sync", "Stable vector", "positive"),
    ("Turbine telemetry", "Spectrum drift", "signal"),
    ("Sentinel recalibration", "Manual assist", "critical"),
    ("Containment sweep", "Field stabilized", "positive"),
    ("Drone uplink", "Latency spike", "signal"),
    ("Reactor dampening", "Override engaged", "critical"),
]

STREAM_INTERVAL_SECONDS = 10


def _status_from_score(score: int) -> str:
    if score >= 80:
        return "pass"
    if score >= 60:
        return "warn"
    return "fail"


def _generate_gate_health() -> list[GateHealth]:
    gates: list[GateHealth] = []
    for name, baseline in _GATE_BASELINES.items():
        variance = randint(-12, 12)
        score = max(0, min(100, baseline + variance))
        gates.append(GateHealth(name=name, score=score, status=_status_from_score(score)))
    # Maintain consistent ordering for consumers
    return gates


def _generate_timeline(now: datetime) -> list[TimelineEvent]:
    # Pick three unique events to surface, newest first
    sample = _rng.sample(_TIMELINE_POOL, k=3)
    events: list[TimelineEvent] = []
    for index, (label, impact, tone) in enumerate(sample):
        event_time = (now - timedelta(minutes=index * 6)).strftime("%H:%M")
        events.append(
            TimelineEvent(
                time=f"{event_time} UTC",
                label=label,
                impact=impact,
                tone=tone,
            )
        )
    return events


@router.get("/summary", response_model=DashboardSummary, name="dashboard:summary")
async def get_dashboard_summary() -> DashboardSummary:
    now = datetime.now(timezone.utc)
    return DashboardSummary(
        generated_at=now,
        hero_gates=_generate_gate_health(),
        timeline=_generate_timeline(now),
    )


@router.get("/stream", name="dashboard:stream")
async def stream_dashboard_summary() -> StreamingResponse:
    async def event_generator():
        try:
            while True:
                summary = await get_dashboard_summary()
                payload = json.dumps(summary.model_dump(mode="json"))
                yield f"data: {payload}\n\n"
                await asyncio.sleep(STREAM_INTERVAL_SECONDS)
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
