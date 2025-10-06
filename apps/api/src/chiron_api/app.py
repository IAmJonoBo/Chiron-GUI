from fastapi import FastAPI

from .config import AppConfig
from .routers import airgap, dashboard, health, info, process, wheelhouse
from .services.instrumentation import configure_observability


def create_app() -> FastAPI:
    """Construct the FastAPI application with configured routers and instrumentation."""
    config = AppConfig()
    app = FastAPI(title="Chiron Core API", version="0.1.0")

    configure_observability(app, config)

    app.include_router(health.router, prefix="/health", tags=["health"])
    app.include_router(info.router, prefix="/api/v1/info", tags=["info"])
    app.include_router(process.router, prefix="/api/v1/process", tags=["process"])
    app.include_router(wheelhouse.router, prefix="/api/v1/wheelhouse", tags=["wheelhouse"])
    app.include_router(airgap.router, prefix="/api/v1/airgap", tags=["airgap"])
    app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])

    return app
