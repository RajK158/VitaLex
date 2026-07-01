"""Document upload/processing orchestration.

Bridges the Streamlit UI and the `core.document_processing` layer:
validates the upload, persists the raw file and extracted text to disk,
runs PDF text extraction, and returns a structured `DocumentExtractionResult`
the UI can render directly. The UI never touches PyMuPDF or the filesystem
itself - it only calls `process_uploaded_pdf`.
"""

import logging
from pathlib import Path

from core.config import settings
from core.document_processing.pdf_loader import load_pdf_from_bytes
from core.document_processing.text_extractor import (
    count_characters,
    count_words,
    extract_text,
)
from core.exceptions import DocumentProcessingError
from models.document_models import DocumentExtractionResult, ExtractionStatus

logger = logging.getLogger(__name__)

ALLOWED_EXTENSION = ".pdf"


def process_uploaded_pdf(file_name: str, file_bytes: bytes) -> DocumentExtractionResult:
    """Validate, persist, and extract text from an uploaded PDF.

    Args:
        file_name: Original uploaded file name, as provided by the UI.
        file_bytes: Raw bytes of the uploaded file.

    Returns:
        A `DocumentExtractionResult` describing the outcome. Extraction
        failures (bad/unsupported/unreadable files) are captured in the
        result rather than raised, so the calling UI never has to handle
        exceptions directly and never crashes on a bad file.
    """
    result = DocumentExtractionResult(file_name=file_name, file_size_bytes=len(file_bytes))

    if not file_name.lower().endswith(ALLOWED_EXTENSION):
        result.status = ExtractionStatus.FAILED
        result.error_message = "Only PDF files are supported. Please upload a .pdf file."
        return result

    try:
        result.saved_file_path = str(_save_uploaded_file(file_name, file_bytes))

        document = load_pdf_from_bytes(file_bytes)
        try:
            result.page_count = document.page_count
            extracted_text = extract_text(document)
        finally:
            document.close()

        result.extracted_text = extracted_text
        result.word_count = count_words(extracted_text)
        result.char_count = count_characters(extracted_text)
        result.saved_text_path = str(_save_extracted_text(file_name, extracted_text))
        result.status = ExtractionStatus.SUCCESS

    except DocumentProcessingError as exc:
        result.status = ExtractionStatus.FAILED
        result.error_message = str(exc)
        logger.warning("PDF extraction failed for '%s': %s", file_name, exc)

    except Exception:  # Safety net: the UI must never crash on a bad file.
        result.status = ExtractionStatus.FAILED
        result.error_message = "An unexpected error occurred while processing this file."
        logger.exception("Unexpected error processing '%s'", file_name)

    return result


def _save_uploaded_file(file_name: str, file_bytes: bytes) -> Path:
    """Persist the raw uploaded PDF under the configured upload directory."""
    upload_dir = Path(settings.raw_upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    destination = upload_dir / file_name
    destination.write_bytes(file_bytes)
    return destination


def _save_extracted_text(file_name: str, text: str) -> Path:
    """Persist the extracted text under the configured processed-data directory."""
    processed_dir = Path(settings.processed_data_dir)
    processed_dir.mkdir(parents=True, exist_ok=True)
    destination = processed_dir / f"{Path(file_name).stem}.txt"
    destination.write_text(text, encoding="utf-8")
    return destination
