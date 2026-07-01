"""'How it works' step-by-step explainer for the VitaLex AI dashboard.

Purely presentational. No feature/business logic lives here.
"""

import streamlit as st

STEPS = [
    {
        "num": "01",
        "icon": "📤",
        "title": "Upload",
        "desc": "Drop in a healthcare PDF — a policy, guideline, or contract.",
    },
    {
        "num": "02",
        "icon": "🧠",
        "title": "Analyze",
        "desc": "VitaLex AI classifies, summarizes, and compares the content automatically.",
    },
    {
        "num": "03",
        "icon": "🚀",
        "title": "Act",
        "desc": "Export rules, insights, and executive-ready reports in minutes.",
    },
]


def render_workflow() -> None:
    """Render the 3-step 'how it works' section."""
    st.markdown('<div id="vlx-workflow" class="vlx-section-header">', unsafe_allow_html=True)
    st.markdown('<span class="vlx-eyebrow">How It Works</span>', unsafe_allow_html=True)
    st.markdown(
        '<h2 class="vlx-section-title">From raw policy to actionable insight</h2>',
        unsafe_allow_html=True,
    )
    st.markdown("</div>", unsafe_allow_html=True)

    cols = st.columns(len(STEPS))
    for col, step in zip(cols, STEPS):
        with col:
            st.markdown(
                f"""
                <div class="vlx-step">
                    <div class="vlx-step-num">{step['num']}</div>
                    <div class="vlx-step-icon">{step['icon']}</div>
                    <div class="vlx-step-title">{step['title']}</div>
                    <div class="vlx-step-desc">{step['desc']}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
