"""Footer component for the VitaLex AI dashboard.

Purely presentational. No feature/business logic lives here.
"""

import streamlit as st


def render_footer() -> None:
    """Render a minimal footer with project attribution."""
    st.markdown(
        """
        <div class="vlx-footer">
            <span>VitaLex AI · Healthcare Content Intelligence Platform</span>
            <span class="vlx-footer-dot">•</span>
            <span>Built for the Cotiviti Internship Program</span>
        </div>
        """,
        unsafe_allow_html=True,
    )
