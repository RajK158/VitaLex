"""Upload Document screen for VitaLex AI.

Presentation only: collects the uploaded PDF, delegates all processing to
`services.document_service.process_uploaded_pdf`, and renders the returned
`DocumentExtractionResult` inside clean, high-contrast cards. No PDF/
business logic lives in this module.
"""

import html

import streamlit as st

from models.document_models import DocumentExtractionResult
from services.document_service import process_uploaded_pdf
from utils.file_utils import format_file_size

_PREVIEW_CHAR_LIMIT = 3000


def render_upload_screen() -> None:
    """Render the Upload Document screen."""
    st.markdown(
        """
        <div class="vlx-page-header">
            <span class="vlx-page-icon">📤</span>
            <h2 class="vlx-page-title">Upload Document</h2>
        </div>
        <p class="vlx-page-subtitle">
            Upload a healthcare PDF — a policy, guideline, or contract — to extract its text content.
        </p>
        """,
        unsafe_allow_html=True,
    )

    with st.container(border=True):
        st.markdown('<div class="vlx-card-heading">Choose a File</div>', unsafe_allow_html=True)
        uploaded_file = st.file_uploader(
            "Choose a PDF file",
            type=["pdf"],
            accept_multiple_files=False,
            help="Only .pdf files are supported.",
            label_visibility="collapsed",
        )

    if uploaded_file is None:
        st.info("📎 No file uploaded yet. Select a PDF above to get started.")
        return

    with st.spinner("Extracting text from PDF..."):
        result = process_uploaded_pdf(uploaded_file.name, uploaded_file.getvalue())

    _render_result(result)


def _render_result(result: DocumentExtractionResult) -> None:
    """Render extraction status, metadata, preview, and saved-output cards."""
    with st.container(border=True):
        st.markdown(
            '<div class="vlx-card-heading">Extraction Summary</div>', unsafe_allow_html=True
        )
        if result.is_success:
            st.success(f"✅ Text extracted successfully from **{result.file_name}**")
        else:
            st.error(f"❌ Could not extract text: {result.error_message}")

        cols = st.columns(4)
        cols[0].metric("File Size", format_file_size(result.file_size_bytes))
        cols[1].metric("Pages", result.page_count or "—")
        cols[2].metric("Word Count", f"{result.word_count:,}" if result.word_count else "—")
        cols[3].metric("Characters", f"{result.char_count:,}" if result.char_count else "—")

    if not result.is_success:
        return

    with st.container(border=True):
        st.markdown(
            '<div class="vlx-card-heading">📄 Extracted Text Preview</div>',
            unsafe_allow_html=True,
        )
        preview = result.extracted_text[:_PREVIEW_CHAR_LIMIT]
        st.markdown(
            f'<div class="vlx-text-preview">{html.escape(preview)}</div>',
            unsafe_allow_html=True,
        )
        if len(result.extracted_text) > _PREVIEW_CHAR_LIMIT:
            st.caption(
                f"Showing the first {_PREVIEW_CHAR_LIMIT:,} of "
                f"{len(result.extracted_text):,} characters."
            )

    with st.container(border=True):
        st.markdown(
            '<div class="vlx-card-heading">💾 Saved Output</div>', unsafe_allow_html=True
        )
        st.markdown(
            '<div class="vlx-saved-row">✅ Uploaded file saved successfully</div>',
            unsafe_allow_html=True,
        )
        st.markdown(
            '<div class="vlx-saved-row">✅ Extracted text saved successfully</div>',
            unsafe_allow_html=True,
        )
        with st.expander("Developer details"):
            st.code(
                f"Uploaded file:  {result.saved_file_path}\n"
                f"Extracted text: {result.saved_text_path}",
                language="text",
            )
