from __future__ import annotations

import hmac
import secrets
from datetime import datetime, timezone
from hashlib import sha256
from logging import getLogger
from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import AppConfig, get_config
from ..db.models import ApiClient
from ..db.session import get_async_session

logger = getLogger(__name__)

_security = HTTPBearer(auto_error=False)


class AuthService:
    def __init__(self, config: AppConfig) -> None:
        self._config = config

    def hash_token(self, token: str) -> str:
        secret = self._config.auth_admin_secret.encode()
        digest = hmac.new(secret, token.encode(), sha256).hexdigest()
        return digest

    def generate_token(self) -> str:
        return secrets.token_urlsafe(32)

    def verify_admin_secret(self, candidate: str) -> bool:
        expected = self._config.auth_admin_secret
        return hmac.compare_digest(expected, candidate)

    async def issue_client_token(
        self,
        session: AsyncSession,
        *,
        name: str,
        scopes: list[str] | None = None,
    ) -> tuple[str, ApiClient]:
        token = self.generate_token()
        token_hash = self.hash_token(token)

        client = ApiClient(
            name=name,
            token_hash=token_hash,
            scopes=scopes or ["telemetry:write"],
        )
        session.add(client)
        await session.commit()
        await session.refresh(client)
        logger.info("API client token issued", extra={"client_id": client.id})
        return token, client

    async def find_client_by_token(self, session: AsyncSession, token: str) -> ApiClient | None:
        token_hash = self.hash_token(token)
        stmt = select(ApiClient).where(
            ApiClient.token_hash == token_hash,
            ApiClient.is_active.is_(True),
        )
        return await session.scalar(stmt)


def get_auth_service(config: Annotated[AppConfig, Depends(get_config)]) -> AuthService:
    return AuthService(config)


async def get_current_client(
    request: Request,
    session: Annotated[AsyncSession, Depends(get_async_session)],
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> ApiClient:
    credentials: HTTPAuthorizationCredentials | None = await _security(request)
    token: str | None = None

    if credentials:
        token = credentials.credentials
    elif api_key := request.headers.get("X-API-Key"):
        token = api_key

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing credentials")

    client = await auth_service.find_client_by_token(session, token)
    if client is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    client.last_used_at = datetime.now(timezone.utc)
    await session.commit()
    return client
