from logging import getLogger

from fastapi import FastAPI
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from ..config import AppConfig

logger = getLogger(__name__)


def configure_observability(app: FastAPI, config: AppConfig) -> None:
    if not config.telemetry_enabled:
        logger.info("Telemetry disabled; skipping OpenTelemetry configuration")
        return

    resource = Resource(attributes={SERVICE_NAME: "chiron-api"})
    provider = TracerProvider(resource=resource)

    if config.otlp_endpoint:
        exporter = OTLPSpanExporter(endpoint=config.otlp_endpoint)
        provider.add_span_processor(BatchSpanProcessor(exporter))
        trace.set_tracer_provider(provider)
        logger.info("Configured OTLP exporter", extra={"endpoint": config.otlp_endpoint})
    else:
        trace.set_tracer_provider(provider)
        logger.warning("OTLP endpoint not configured; spans will not be exported")

    @app.on_event("startup")
    async def _startup() -> None:  # pragma: no cover - telemetry wiring is integration-tested
        logger.info("Chiron telemetry initialized")

    @app.on_event("shutdown")
    async def _shutdown() -> None:  # pragma: no cover
        trace.get_tracer_provider().shutdown()
        logger.info("Chiron telemetry shutdown complete")
