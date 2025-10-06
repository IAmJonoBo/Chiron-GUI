from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
from datetime import datetime, timezone
from logging import getLogger
from statistics import mean

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.models import HeroGate, TelemetrySample, TimelineEvent
from ..db.session import run_schema_migrations
from ..schemas.dashboard import (
    DashboardSummary,
    HeroGatePayload,
    HeroGateSummary,
    TelemetrySnapshotIn,
    TimelineEventPayload,
    TimelineEventSummary,
)

logger = getLogger(__name__)


@dataclass(slots=True)
class TelemetrySummary:
    generated_at: datetime
    hero_gates: list[HeroGateSummary]
    timeline: list[TimelineEventSummary]
    metadata: dict[str, object]


class TelemetryRepository:
    def __init__(self, session: AsyncSession):
        self._session = session

    async def ensure_schema(self) -> None:
        from ..db.models import Base

        await run_schema_migrations(Base.metadata)

    async def get_dashboard_summary(self) -> DashboardSummary:
        gate_summaries = await self._fetch_gate_summaries()
        timeline = await self._fetch_timeline()

        metadata: dict[str, object] = {}
        if gate_summaries:
            scores = [gate.score for gate in gate_summaries]
            metadata["average_score"] = round(mean(scores), 2)
            metadata["pass_rate"] = round(
                sum(1 for gate in gate_summaries if gate.status == "pass") / len(gate_summaries),
                2,
            )

        return DashboardSummary(
            generated_at=datetime.now(timezone.utc),
            hero_gates=gate_summaries,
            timeline=timeline,
            metadata=metadata,
        )

    async def ingest_snapshot(self, snapshot: TelemetrySnapshotIn) -> DashboardSummary:
        await self._upsert_gates(snapshot.hero_gates)
        await self._insert_samples(snapshot.hero_gates)
        await self._insert_timeline(snapshot.timeline)
        await self._session.commit()
        logger.info(
            "Telemetry snapshot ingested",
            extra={
                "hero_gate_count": len(snapshot.hero_gates),
                "timeline_count": len(snapshot.timeline),
            },
        )
        summary = await self.get_dashboard_summary()
        summary.metadata.update(snapshot.metadata)
        return summary

    async def _upsert_gates(self, gates: Iterable[HeroGatePayload]) -> None:
        if not gates:
            return

        existing_result = await self._session.scalars(select(HeroGate))
        existing_map = {gate.name.lower(): gate for gate in existing_result.all()}

        for payload in gates:
            lower_name = payload.name.lower()
            if lower_name in existing_map:
                gate = existing_map[lower_name]
                if payload.baseline is not None:
                    gate.baseline_score = payload.baseline
            else:
                gate = HeroGate(
                    name=payload.name,
                    baseline_score=payload.baseline or payload.score,
                )
                self._session.add(gate)

        await self._session.flush()

    async def _insert_samples(self, gates: Iterable[HeroGatePayload]) -> None:
        if not gates:
            return

        existing_gates_result = await self._session.scalars(select(HeroGate))
        gate_lookup = {
            gate.name.lower(): gate.id for gate in existing_gates_result.all()
        }

        for payload in gates:
            gate_id = gate_lookup.get(payload.name.lower())
            if gate_id is None:
                continue

            status = payload.status or self._status_from_score(payload.score)
            metrics = payload.metrics.dict() if payload.metrics else {}

            sample = TelemetrySample(
                gate_id=gate_id,
                score=payload.score,
                status=status,
                metrics=metrics,
            )
            self._session.add(sample)

    async def _insert_timeline(self, events: Iterable[TimelineEventPayload]) -> None:
        if not events:
            return

        for payload in events:
            attributes = dict(payload.attributes)
            if payload.overlay and "overlay" not in attributes:
                attributes["overlay"] = payload.overlay

            event = TimelineEvent(
                label=payload.label,
                impact=payload.impact,
                tone=payload.tone,
                occurred_at=payload.occurred_at,
                attributes=attributes,
            )
            self._session.add(event)

        # Keep the most recent 50 events
        retained = await self._session.scalars(
            select(TimelineEvent.id)
            .order_by(TimelineEvent.occurred_at.desc())
            .offset(50)
        )
        ids_to_delete = list(retained)
        if ids_to_delete:
            await self._session.execute(
                delete(TimelineEvent).where(TimelineEvent.id.in_(ids_to_delete))
            )

    async def _fetch_gate_summaries(self) -> list[HeroGateSummary]:
        latest_sample_subquery = (
            select(
                TelemetrySample.gate_id,
                func.max(TelemetrySample.recorded_at).label("latest_at"),
            )
            .group_by(TelemetrySample.gate_id)
            .subquery()
        )

        stmt = (
            select(
                HeroGate.name,
                HeroGate.baseline_score,
                TelemetrySample.score,
                TelemetrySample.status,
                TelemetrySample.metrics,
            )
            .join(latest_sample_subquery, latest_sample_subquery.c.gate_id == HeroGate.id)
            .join(
                TelemetrySample,
                (TelemetrySample.gate_id == HeroGate.id)
                & (TelemetrySample.recorded_at == latest_sample_subquery.c.latest_at),
            )
            .order_by(HeroGate.name.asc())
        )

        results = await self._session.execute(stmt)
        hero_data: list[HeroGateSummary] = []
        for name, baseline, score, status, metrics in results:
            trend = []
            throughput = None
            load = None

            if isinstance(metrics, dict):
                trend = [int(value) for value in metrics.get("trend", [])]
                throughput = metrics.get("throughput")
                load = metrics.get("load")

            delta = float(score - baseline)

            hero_data.append(
                HeroGateSummary(
                    name=name,
                    score=score,
                    status=status,
                    baseline=baseline,
                    delta=delta,
                    trend=trend,
                    throughput=throughput,
                    load=load,
                )
            )

        return hero_data

    async def _fetch_timeline(self) -> list[TimelineEventSummary]:
        stmt = (
            select(
                TimelineEvent.label,
                TimelineEvent.impact,
                TimelineEvent.tone,
                TimelineEvent.occurred_at,
                TimelineEvent.attributes,
            )
            .order_by(TimelineEvent.occurred_at.desc())
            .limit(10)
        )

        results = await self._session.execute(stmt)
        timeline: list[TimelineEventSummary] = []
        for label, impact, tone, occurred_at, attributes in results:
            overlay = None
            attrs = attributes or {}
            if isinstance(attrs, dict):
                overlay = attrs.get("overlay")
            timeline.append(
                TimelineEventSummary(
                    label=label,
                    impact=impact,
                    tone=tone,
                    occurred_at=occurred_at,
                    overlay=overlay,
                    attributes=attrs if isinstance(attrs, dict) else {},
                )
            )
        return timeline

    @staticmethod
    def _status_from_score(score: int) -> str:
        if score >= 80:
            return "pass"
        if score >= 60:
            return "warn"
        return "fail"
