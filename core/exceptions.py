"""Custom application exception types.

A small hierarchy of domain-specific exceptions used across `core` and
`services` so callers (e.g. the Streamlit UI) can catch predictable,
friendly error types instead of raw third-party exceptions.
"""


class VitaLexError(Exception):
    """Base class for all VitaLex AI application errors."""


class DocumentProcessingError(VitaLexError):
    """Raised when a document cannot be loaded or processed."""


class UnsupportedFileTypeError(DocumentProcessingError):
    """Raised when an uploaded file is not a supported type (e.g. not a PDF)."""


class PDFExtractionError(DocumentProcessingError):
    """Raised when text cannot be extracted from a PDF."""
