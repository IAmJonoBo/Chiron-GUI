from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()


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


MOCK_DASHBOARD = DashboardSummary(
    generated_at=datetime.now(timezone.utc),
    hero_gates=[
        GateHealth(name="Fusion Segment", score=92, status="pass"),
        GateHealth(name="Kinematics Mesh", score=68, status="warn"),
        GateHealth(name="Containment Umbra", score=81, status="pass"),
        GateHealth(name="Reactor Baffles", score=47, status="fail"),
    ],
    timeline=[
        TimelineEvent(
            time="08:24",
            label="Delta Gate sync",
            impact="Stable",
            tone="text-successMint",
        ),
        TimelineEvent(
            time="08:16",
            label="Turbine telemetry",
            impact="Spectrum drift",
            tone="text-warn",
        ),
        TimelineEvent(
            time="08:04",
            label="Sentinel recalibration",
            impact="Manual assist",
            tone="text-danger",
        ),
    ],
)


@router.get("/summary", response_model=DashboardSummary, name="dashboard:summary")
async def get_dashboard_summary() -> DashboardSummary:
    return MOCK_DASHBOARD
