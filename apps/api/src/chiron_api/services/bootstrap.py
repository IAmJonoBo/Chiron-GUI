from __future__ import annotations

from logging import getLogger

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from ..config import AppConfig
from ..db.models import ApiClient, Base, HeroGate
from ..db.session import (
    get_session_factory,
    init_engine_and_session,
    run_schema_migrations,
)
from ..schemas.dashboard import (
    HeroGateMetrics,
    HeroGatePayload,
    TelemetrySnapshotIn,
    TimelineEventPayload,
)
from .auth import AuthService
from .telemetry import TelemetryRepository

logger = getLogger(__name__)


async def bootstrap_application(config: AppConfig) -> None:
    """Prepare database schema and ensure seed data is present."""

    init_engine_and_session(config)
    await run_schema_migrations(Base.metadata)

    if not config.seed_demo_data:
        return

    session_factory = get_session_factory()
    async with session_factory() as session:
        repo = TelemetryRepository(session)

        existing_gates = await session.scalar(select(HeroGate.id))
        if existing_gates is None:
            await repo.ingest_snapshot(_demo_snapshot())

        if config.default_api_token:
            auth_service = AuthService(config)
            token_hash = auth_service.hash_token(config.default_api_token)
            stmt = select(ApiClient).where(ApiClient.token_hash == token_hash)
            client = await session.scalar(stmt)
            if client is None:
                client = ApiClient(
                    name="Local development",
                    token_hash=token_hash,
                    scopes=["telemetry:write"],
                )
                session.add(client)
                try:
                    await session.commit()
                    logger.info("Seeded default API token", extra={"client_id": client.id})
                except IntegrityError:
                    await session.rollback()


def _demo_snapshot() -> TelemetrySnapshotIn:
    return TelemetrySnapshotIn(
        hero_gates=[
            HeroGatePayload(
                name="Fusion Segment",
                score=94,
                baseline=90,
                status="pass",
                metrics=HeroGateMetrics(
                    trend=[90, 91, 92, 94],
                    throughput=128.4,
                    load=0.68,
                ),
            ),
            HeroGatePayload(
                name="Kinematics Mesh",
                score=74,
                baseline=70,
                status="warn",
                metrics=HeroGateMetrics(
                    trend=[64, 68, 70, 74],
                    throughput=86.1,
                    load=0.54,
                ),
            ),
            HeroGatePayload(
                name="Containment Umbra",
                score=82,
                baseline=78,
                status="pass",
                metrics=HeroGateMetrics(
                    trend=[75, 77, 80, 82],
                    throughput=112.6,
                    load=0.72,
                ),
            ),
            HeroGatePayload(
                name="Reactor Baffles",
                score=58,
                baseline=62,
                status="fail",
                metrics=HeroGateMetrics(
                    trend=[64, 62, 60, 58],
                    throughput=98.4,
                    load=0.81,
                ),
            ),
        ],
        timeline=[
            TimelineEventPayload(
                label="Delta Gate sync",
                impact="Stable vector",
                tone="positive",
                occurred_at=_minutes_ago(6),
                overlay="aurora",
            ),
            TimelineEventPayload(
                label="Turbine telemetry",
                impact="Spectrum drift",
                tone="signal",
                occurred_at=_minutes_ago(12),
                overlay="grid",
            ),
            TimelineEventPayload(
                label="Sentinel recalibration",
                impact="Manual assist",
                tone="critical",
                occurred_at=_minutes_ago(18),
                overlay="flare",
            ),
        ],
        metadata={"seed": True},
    )


def _minutes_ago(minutes: int):
    from datetime import datetime, timedelta, timezone

    return datetime.now(timezone.utc) - timedelta(minutes=minutes)
