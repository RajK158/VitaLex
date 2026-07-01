"""Text extraction utilities for parsed PDF documents.

Operates on an already-opened PyMuPDF `Document` (see `pdf_loader.py`) and
returns plain text plus simple word/character counts.
"""

import fitz  # PyMuPDF

from core.exceptions import PDFExtractionError


def extract_text(document: fitz.Document) -> str:
    """Extract plain text from every page of a PDF document.

    Args:
        document: An opened PyMuPDF `Document`.

    Returns:
        The concatenated text of all pages, separated by blank lines.

    Raises:
        PDFExtractionError: If no extractable text is found - typically a
            scanned/image-only PDF with no text layer (OCR is out of scope
            for this phase).
    """
    pages_text = [page.get_text("text") for page in document]
    full_text = "\n\n".join(text.strip() for text in pages_text if text.strip())

    if not full_text:
        raise PDFExtractionError(
            "No extractable text was found in this PDF. It may be a "
            "scanned/image-only document without a text layer."
        )

    return full_text


def count_words(text: str) -> int:
    """Count whitespace-separated words in the given text."""
    return len(text.split())


def count_characters(text: str) -> int:
    """Count characters in the given text."""
    return len(text)
