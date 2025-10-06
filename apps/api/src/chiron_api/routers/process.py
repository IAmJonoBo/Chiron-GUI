from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

router = APIRouter()


class ProcessOptions(BaseModel):
    dry_run: bool = Field(default=False, description="Perform validation without executing actions")
    priority: str = Field(default="normal", description="Execution priority")


class ProcessRequest(BaseModel):
    process_type: str = Field(..., description="Identifier for the process to run")
    payload: dict[str, object] = Field(default_factory=dict, description="Structured payload")
    options: ProcessOptions = Field(default_factory=ProcessOptions)


class ProcessResponse(BaseModel):
    status: str = Field(default="queued")
    queued_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    evidence_link: str | None = None


@router.post("/", response_model=ProcessResponse, name="process:run")
async def enqueue_process(request: ProcessRequest) -> ProcessResponse:
    if request.process_type == "":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing process type")

    return ProcessResponse(
        status="queued",
        evidence_link=f"https://console.chiron.local/process/{request.process_type}",
    )
