from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.session import get_async_session
from ..services.auth import AuthService, get_auth_service

router = APIRouter()


class TokenRequest(BaseModel):
    client_name: str = Field(..., min_length=3, max_length=128)
    scopes: list[str] = Field(default_factory=lambda: ["telemetry:write"])
    admin_secret: str = Field(..., min_length=8)


class TokenResponse(BaseModel):
    client_id: str
    token: str
    scopes: list[str]


@router.post("/token", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def issue_token(
    payload: TokenRequest,
    session: Annotated[AsyncSession, Depends(get_async_session)],
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> TokenResponse:
    if not auth_service.verify_admin_secret(payload.admin_secret):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid admin secret")

    token, client = await auth_service.issue_client_token(
        session,
        name=payload.client_name,
        scopes=payload.scopes,
    )

    return TokenResponse(client_id=client.id, token=token, scopes=client.scopes)
