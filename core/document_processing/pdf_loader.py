"""PDF loading utilities.

Wraps PyMuPDF (`fitz`) so the rest of the codebase never imports the
third-party library directly - this is the only module allowed to do so.
"""

import fitz  # PyMuPDF

from core.exceptions import PDFExtractionError


def load_pdf_from_bytes(file_bytes: bytes) -> fitz.Document:
    """Open a PDF document from raw bytes.

    Args:
        file_bytes: Raw content of the uploaded PDF file.

    Returns:
        An opened PyMuPDF `Document`. Callers are responsible for closing
        it (e.g. via `document.close()` or a `try/finally` block).

    Raises:
        PDFExtractionError: If the bytes cannot be parsed as a valid PDF,
            or the PDF has no pages.
    """
    try:
        document = fitz.open(stream=file_bytes, filetype="pdf")
    except Exception as exc:  # PyMuPDF raises assorted low-level errors
        raise PDFExtractionError(f"Unable to open PDF file: {exc}") from exc

    if document.page_count == 0:
        document.close()
        raise PDFExtractionError("The PDF file contains no pages.")

    return document
