from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class HeroGate(Base):
    __tablename__ = "hero_gates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    baseline_score: Mapped[int] = mapped_column(Integer, nullable=False, default=80)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    samples: Mapped[list[TelemetrySample]] = relationship(
        "TelemetrySample",
        back_populates="gate",
        cascade="all, delete-orphan",
        lazy="raise",
    )


class TelemetrySample(Base):
    __tablename__ = "telemetry_samples"
    __table_args__ = (
        UniqueConstraint("gate_id", "recorded_at", name="uq_gate_timestamp"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    gate_id: Mapped[int] = mapped_column(
        ForeignKey("hero_gates.id", ondelete="CASCADE"),
        index=True,
    )
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False)
    metrics: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        index=True,
    )

    gate: Mapped[HeroGate] = relationship("HeroGate", back_populates="samples")


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    label: Mapped[str] = mapped_column(String(256), nullable=False)
    impact: Mapped[str] = mapped_column(String(128), nullable=False)
    tone: Mapped[str] = mapped_column(String(32), default="positive")
    occurred_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        index=True,
    )
    attributes: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)


class ApiClient(Base):
    __tablename__ = "api_clients"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: uuid4().hex)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    token_hash: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    scopes: Mapped[list[str]] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    last_used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)


__all__ = [
    "ApiClient",
    "Base",
    "HeroGate",
    "TelemetrySample",
    "TimelineEvent",
]
