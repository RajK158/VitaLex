"""Reusable sidebar navigation component for VitaLex AI.

Renders a compact brand header and a flat, icon-led list of navigation
labels styled to look like a minimal enterprise app rail. This component
only tracks the active label in `st.session_state` - `app/main.py` decides
what to render for each label, so no business/feature logic lives here.
"""

import streamlit as st

OVERVIEW_ITEM = ("Overview", "🏠")

NAV_ITEMS = [
    ("Upload Document", "📤"),
    ("Classification", "🗂️"),
    ("Summary", "📝"),
    ("Comparison", "🔍"),
    ("Impact Analysis", "📊"),
    ("Rule Generator", "⚙️"),
    ("Policy Q&A", "💬"),
    ("Report Export", "📄"),
]

_NAV_STATE_KEY = "vlx_active_nav"


def render_sidebar() -> str:
    """Render the sidebar brand header and navigation menu.

    Returns:
        The label of the currently active navigation item (`"Overview"` for
        the landing dashboard, or one of the `NAV_ITEMS` labels).
    """
    if _NAV_STATE_KEY not in st.session_state:
        st.session_state[_NAV_STATE_KEY] = OVERVIEW_ITEM[0]

    with st.sidebar:
        st.markdown(
            """
            <div class="vlx-sidebar-brand">
                <div class="vlx-sidebar-logo">🩺</div>
                <div>
                    <div class="vlx-sidebar-name">VitaLex AI</div>
                    <div class="vlx-sidebar-tagline">Healthcare Intelligence</div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        overview_label, overview_icon = OVERVIEW_ITEM
        if st.button(
            f"{overview_icon}  {overview_label}",
            key="vlx_nav_overview",
            use_container_width=True,
            type="primary" if st.session_state[_NAV_STATE_KEY] == overview_label else "secondary",
        ):
            st.session_state[_NAV_STATE_KEY] = overview_label

        st.markdown('<div style="margin: 0.4rem 0;"></div>', unsafe_allow_html=True)

        for label, icon in NAV_ITEMS:
            is_active = st.session_state[_NAV_STATE_KEY] == label
            if st.button(
                f"{icon}  {label}",
                key=f"vlx_nav_{label}",
                use_container_width=True,
                type="primary" if is_active else "secondary",
            ):
                st.session_state[_NAV_STATE_KEY] = label

        st.markdown(
            '<div class="vlx-sidebar-footer">VitaLex AI · v0.3.0<br>Upload Module Live</div>',
            unsafe_allow_html=True,
        )

    return st.session_state[_NAV_STATE_KEY]
