"""Pydantic models representing uploaded/processed documents.

Defines the structured contract returned by the PDF ingestion pipeline
(`core.document_processing` via `services.document_service`) to the UI.
"""

from __future__ import annotations

from enum import Enum

from pydantic import BaseModel


class ExtractionStatus(str, Enum):
    """Outcome of a PDF text extraction attempt."""

    SUCCESS = "success"
    FAILED = "failed"


class DocumentExtractionResult(BaseModel):
    """Structured result of uploading and extracting text from a PDF."""

    file_name: str
    file_size_bytes: int
    page_count: int = 0
    extracted_text: str = ""
    word_count: int = 0
    char_count: int = 0
    status: ExtractionStatus = ExtractionStatus.FAILED
    error_message: str | None = None
    saved_file_path: str | None = None
    saved_text_path: str | None = None

    @property
    def is_success(self) -> bool:
        """Whether extraction completed successfully."""
        return self.status is ExtractionStatus.SUCCESS
