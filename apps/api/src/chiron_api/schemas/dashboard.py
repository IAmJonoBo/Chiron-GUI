from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class HeroGateMetrics(BaseModel):
    trend: list[int] = Field(default_factory=list)
    throughput: float | None = None
    load: float | None = None


class HeroGatePayload(BaseModel):
    name: str
    score: int = Field(ge=0, le=100)
    status: str | None = None
    baseline: int | None = Field(default=None, ge=0, le=100)
    metrics: HeroGateMetrics | None = None

    model_config = ConfigDict(extra="allow")


class TimelineEventPayload(BaseModel):
    label: str
    impact: str
    tone: str = "positive"
    occurred_at: datetime
    overlay: str | None = None
    attributes: dict[str, Any] = Field(default_factory=dict)


class TelemetrySnapshotIn(BaseModel):
    hero_gates: list[HeroGatePayload]
    timeline: list[TimelineEventPayload]
    metadata: dict[str, Any] = Field(default_factory=dict)


class HeroGateSummary(BaseModel):
    name: str
    score: int
    status: str
    baseline: int
    delta: float
    trend: list[int]
    throughput: float | None = None
    load: float | None = None

    model_config = ConfigDict(from_attributes=True)


class TimelineEventSummary(BaseModel):
    label: str
    impact: str
    tone: str
    occurred_at: datetime
    overlay: str | None = None
    attributes: dict[str, Any] = Field(default_factory=dict)


class DashboardSummary(BaseModel):
    generated_at: datetime
    hero_gates: list[HeroGateSummary]
    timeline: list[TimelineEventSummary]
    metadata: dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(from_attributes=True)
