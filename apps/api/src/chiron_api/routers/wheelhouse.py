from collections.abc import Iterable
from datetime import datetime, timezone

from fastapi import APIRouter, status
from pydantic import BaseModel, Field

router = APIRouter()


class WheelhouseEntry(BaseModel):
    id: str
    created_at: datetime
    status: str
    artifacts: list[str]


class WheelhouseListResponse(BaseModel):
    items: list[WheelhouseEntry]


class WheelhouseBuildRequest(BaseModel):
    target: str
    extras: list[str] = Field(default_factory=list)
    signed: bool = True


class WheelhouseBuildResponse(BaseModel):
    status: str
    run_id: str
    submitted_at: datetime


MOCK_ENTRIES: Iterable[WheelhouseEntry] = (
    WheelhouseEntry(
        id="wheelhouse-2024-10-01",
        created_at=datetime(2024, 10, 1, 12, 0, tzinfo=timezone.utc),
        status="verified",
        artifacts=["openssl-3.1.7.whl", "libssl-attestation.json"],
    ),
)


@router.get("/", response_model=WheelhouseListResponse, name="wheelhouse:list")
async def list_wheelhouse() -> WheelhouseListResponse:
    return WheelhouseListResponse(items=list(MOCK_ENTRIES))


@router.post(
    "/build",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=WheelhouseBuildResponse,
    name="wheelhouse:build",
)
async def build_wheelhouse(request: WheelhouseBuildRequest) -> WheelhouseBuildResponse:
    run_id = f"wheelhouse-{request.target}-{int(datetime.now(timezone.utc).timestamp())}"
    return WheelhouseBuildResponse(
        status="queued",
        run_id=run_id,
        submitted_at=datetime.now(timezone.utc),
    )
