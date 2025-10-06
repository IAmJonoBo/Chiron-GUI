from contextlib import asynccontextmanager
from logging import getLogger

from fastapi import FastAPI
from redis.asyncio import Redis

from .config import AppConfig
from .db.session import lifespan_engine
from .routers import airgap, auth, dashboard, health, info, process, wheelhouse
from .services.bootstrap import bootstrap_application
from .services.instrumentation import configure_observability
from .services.streaming import TelemetryStreamBroker


def create_app() -> FastAPI:
    """Construct the FastAPI application with configured routers and instrumentation."""
    config = AppConfig()
    logger = getLogger(__name__)

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        redis_client: Redis | None = None

        if config.redis_url:
            try:
                redis_client = Redis.from_url(
                    config.redis_url,
                    encoding="utf-8",
                    decode_responses=True,
                )
                if redis_client is not None:
                    await redis_client.ping()
            except Exception as exc:  # pragma: no cover - optional dependency
                logger.warning("Redis unavailable; using in-memory stream", exc_info=exc)
                redis_client = None

        app.state.telemetry_broker = TelemetryStreamBroker(redis_client)

        async with lifespan_engine(config):
            await bootstrap_application(config)
            yield

        if redis_client is not None:
            await redis_client.aclose()

    app = FastAPI(title="Chiron Core API", version="0.1.0", lifespan=lifespan)

    configure_observability(app, config)

    app.include_router(health.router, prefix="/health", tags=["health"])
    app.include_router(info.router, prefix="/api/v1/info", tags=["info"])
    app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
    app.include_router(process.router, prefix="/api/v1/process", tags=["process"])
    app.include_router(wheelhouse.router, prefix="/api/v1/wheelhouse", tags=["wheelhouse"])
    app.include_router(airgap.router, prefix="/api/v1/airgap", tags=["airgap"])
    app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])

    return app
