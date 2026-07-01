"""Feature module showcase cards for the VitaLex AI dashboard.

Purely presentational: describes the platform's upcoming modules. No
feature/business logic lives here - modules are wired in during later
phases via the `services` layer.
"""

import streamlit as st

FEATURES = [
    {
        "icon": "📤",
        "title": "Document Upload",
        "desc": "Securely ingest healthcare PDFs — policies, guidelines, and contracts — in seconds.",
    },
    {
        "icon": "🗂️",
        "title": "Classification",
        "desc": "Automatically categorize documents by type, domain, and regulatory relevance.",
    },
    {
        "icon": "📝",
        "title": "Summarization",
        "desc": "Generate structured, section-aware summaries analysts can trust.",
    },
    {
        "icon": "🔍",
        "title": "Comparison",
        "desc": "Compare policy versions side-by-side and surface material differences.",
    },
    {
        "icon": "📊",
        "title": "Impact Analysis",
        "desc": "Quantify the operational and business impact of policy changes.",
    },
    {
        "icon": "⚙️",
        "title": "Rule Generator",
        "desc": "Convert policy language into JSON, YAML, or decision-table rules.",
    },
    {
        "icon": "💬",
        "title": "Policy Q&A",
        "desc": "Ask natural-language questions and get grounded answers via RAG.",
    },
    {
        "icon": "📄",
        "title": "Report Export",
        "desc": "Produce executive-ready reports summarizing key findings.",
    },
]

_COLUMNS_PER_ROW = 4


def render_feature_grid() -> None:
    """Render the feature module grid as responsive, hoverable cards."""
    st.markdown('<div id="vlx-features" class="vlx-section-header">', unsafe_allow_html=True)
    st.markdown('<span class="vlx-eyebrow">Platform Capabilities</span>', unsafe_allow_html=True)
    st.markdown(
        '<h2 class="vlx-section-title">One workspace, eight AI modules</h2>',
        unsafe_allow_html=True,
    )
    st.markdown("</div>", unsafe_allow_html=True)

    for row_start in range(0, len(FEATURES), _COLUMNS_PER_ROW):
        row_features = FEATURES[row_start : row_start + _COLUMNS_PER_ROW]
        cols = st.columns(_COLUMNS_PER_ROW)
        for col, feature in zip(cols, row_features):
            with col:
                st.markdown(
                    f"""
                    <div class="vlx-card">
                        <div class="vlx-card-icon">{feature['icon']}</div>
                        <div class="vlx-card-title">{feature['title']}</div>
                        <div class="vlx-card-desc">{feature['desc']}</div>
                        <div class="vlx-card-status">Coming soon</div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
