from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class AppConfig(BaseSettings):
    """Runtime configuration for the Chiron API."""

    environment: str = "development"
    telemetry_enabled: bool = True
    otlp_endpoint: str | None = None
    database_url: str = "sqlite+aiosqlite:///./var/chiron.db"
    redis_url: str = "redis://localhost:6379/0"
    sql_echo: bool = False
    seed_demo_data: bool = True
    auth_admin_secret: str = "chiron-dev-admin"
    default_api_token: str | None = "local-dev-token"
    api_token_ttl_seconds: int = 7 * 24 * 60 * 60

    model_config = SettingsConfigDict(env_prefix="CHIRON_", env_file=".env", extra="ignore")


@lru_cache
def get_config() -> "AppConfig":
    return AppConfig()
