"""Theme loader for VitaLex AI.

Reads `custom.css` and injects it into the current Streamlit page. This is
a presentation-only helper - it contains no business/feature logic.
"""

from pathlib import Path

import streamlit as st

_CSS_PATH = Path(__file__).parent / "custom.css"


def load_theme() -> None:
    """Inject the shared VitaLex AI stylesheet into the current page."""
    css = _CSS_PATH.read_text(encoding="utf-8")
    st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)
