from __future__ import annotations

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from pathlib import Path

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from ..config import AppConfig

_engine: AsyncEngine | None = None
_session_factory: async_sessionmaker[AsyncSession] | None = None


def init_engine_and_session(config: AppConfig) -> None:
    """Initialise the async SQLAlchemy engine and session factory."""
    global _engine, _session_factory

    if _engine is not None and _session_factory is not None:
        return

    database_url = config.database_url

    if database_url.startswith("sqlite"):
        # Ensure local directory exists for SQLite storage
        db_path = database_url.split("///")[-1]
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)

    _engine = create_async_engine(
        database_url,
        echo=config.sql_echo,
        future=True,
        pool_pre_ping=True,
    )
    _session_factory = async_sessionmaker(_engine, expire_on_commit=False)


@asynccontextmanager
async def lifespan_engine(config: AppConfig):
    init_engine_and_session(config)
    try:
        yield
    finally:
        if _engine is not None:
            await _engine.dispose()


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    if _session_factory is None:
        raise RuntimeError("Database session factory not initialised")

    async with _session_factory() as session:
        yield session


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    if _session_factory is None:
        raise RuntimeError("Database session factory not initialised")
    return _session_factory


async def run_schema_migrations(metadata) -> None:
    if _engine is None:
        raise RuntimeError("Database engine not initialised")

    async with _engine.begin() as connection:
        await connection.run_sync(metadata.create_all)
