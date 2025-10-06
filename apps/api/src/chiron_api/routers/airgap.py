from collections.abc import Iterable
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

router = APIRouter()


class AirgapBundle(BaseModel):
    id: str
    created_at: datetime
    environments: list[str]
    signed: bool
    checksum: str


class AirgapBundleList(BaseModel):
    items: list[AirgapBundle]


class CreateAirgapRequest(BaseModel):
    environments: list[str] = Field(default_factory=lambda: ["prod"])
    include_security_mirror: bool = True
    include_docs: bool = True


class CreateAirgapResponse(BaseModel):
    bundle_id: str
    status: str
    submitted_at: datetime


MOCK_BUNDLES: Iterable[AirgapBundle] = (
    AirgapBundle(
        id="bundle-2024-09-18",
        created_at=datetime(2024, 9, 18, 8, 30, tzinfo=timezone.utc),
        environments=["prod", "stage"],
        signed=True,
        checksum="sha256-abcdef123456",
    ),
)


@router.get("/bundles", response_model=AirgapBundleList, name="airgap:list")
async def list_bundles() -> AirgapBundleList:
    return AirgapBundleList(items=list(MOCK_BUNDLES))


@router.post(
    "/create",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=CreateAirgapResponse,
    name="airgap:create",
)
async def create_bundle(request: CreateAirgapRequest) -> CreateAirgapResponse:
    if not request.environments:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one environment must be specified",
        )
    bundle_id = f"bundle-{int(datetime.now(timezone.utc).timestamp())}"
    return CreateAirgapResponse(
        bundle_id=bundle_id,
        status="queued",
        submitted_at=datetime.now(timezone.utc),
    )
