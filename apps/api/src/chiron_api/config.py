from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class AppConfig(BaseSettings):
    """Runtime configuration for the Chiron API."""

    environment: str = "development"
    telemetry_enabled: bool = True
    otlp_endpoint: str | None = None
    database_url: str = "postgresql+asyncpg://localhost:5432/chiron"
    redis_url: str = "redis://localhost:6379/0"

    model_config = SettingsConfigDict(env_prefix="CHIRON_", env_file=".env", extra="ignore")


@lru_cache
def get_config() -> "AppConfig":
    return AppConfig()
