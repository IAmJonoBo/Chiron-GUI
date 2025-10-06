from __future__ import annotations

import asyncio
import json
from collections.abc import AsyncGenerator
from logging import getLogger
from typing import Any

from redis.asyncio import Redis

from ..schemas.dashboard import DashboardSummary

logger = getLogger(__name__)


class TelemetryStreamBroker:
    """Fan-out broker for dashboard telemetry streaming."""

    def __init__(self, redis_client: Redis | None = None) -> None:
        self._redis = redis_client
        self._subscribers: set[asyncio.Queue[dict[str, Any]]] = set()
        self._lock = asyncio.Lock()

    async def publish(self, summary: DashboardSummary) -> None:
        payload = summary.model_dump(mode="json")
        await self._broadcast(payload)

        if self._redis is not None:
            try:
                await self._redis.xadd("telemetry:dashboard", {"payload": json.dumps(payload)})
            except Exception as exc:  # pragma: no cover - Redis optional in dev
                logger.warning("Failed to publish telemetry event to redis", exc_info=exc)

    async def stream(self) -> AsyncGenerator[dict[str, Any], None]:
        queue: asyncio.Queue[dict[str, Any]] = asyncio.Queue(maxsize=100)
        async with self._lock:
            self._subscribers.add(queue)
        logger.info(
            "Dashboard stream subscriber connected",
            extra={"subscribers": len(self._subscribers)},
        )
        try:
            while True:
                payload = await queue.get()
                yield payload
        finally:
            async with self._lock:
                self._subscribers.discard(queue)
            logger.info(
                "Dashboard stream subscriber disconnected",
                extra={"subscribers": len(self._subscribers)},
            )

    async def _broadcast(self, payload: dict[str, Any]) -> None:
        async with self._lock:
            subscribers = list(self._subscribers)
        if not subscribers:
            return

        for queue in subscribers:
            try:
                queue.put_nowait(payload)
            except asyncio.QueueFull:  # pragma: no cover - transient condition
                logger.warning("Dropping telemetry payload for slow subscriber")
