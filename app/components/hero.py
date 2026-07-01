"""Hero section component for the VitaLex AI landing dashboard.

Purely presentational: renders the brand name, subtitle, value proposition,
and CTA row. No feature/business logic lives here.
"""

import streamlit as st


def render_hero(active_module: str | None = None) -> None:
    """Render the top hero section.

    Args:
        active_module: Label of the currently selected sidebar nav item,
            shown as a small context pill. Purely cosmetic.
    """
    context_pill = ""
    if active_module:
        context_pill = (
            f'<div class="vlx-context-pill">🧭 Currently exploring: '
            f"<strong>{active_module}</strong></div>"
        )

    st.markdown(
        f"""
        <div class="vlx-hero">
            <div class="vlx-hero-content">
                <span class="vlx-badge">✨ AI-Powered Healthcare Intelligence</span>
                <h1 class="vlx-hero-title">VitaLex AI</h1>
                <p class="vlx-hero-subtitle">Healthcare Content Intelligence Platform</p>
                <p class="vlx-hero-copy">
                    Turn dense healthcare policies, guidelines, and contracts into
                    clear, structured, and actionable intelligence — classification,
                    summarization, comparison, impact analysis, rule generation, and
                    executive reporting, all in one secure workspace.
                </p>
                <div class="vlx-hero-stats">
                    <div class="vlx-stat"><span>8</span>AI Modules</div>
                    <div class="vlx-stat"><span>RAG</span>Grounded Q&amp;A</div>
                    <div class="vlx-stat"><span>PDF</span>Native Ingestion</div>
                </div>
                <div class="vlx-cta-row">
                    <a href="#vlx-features" class="vlx-cta-primary">Explore Modules →</a>
                    <a href="#vlx-workflow" class="vlx-cta-secondary">See How It Works</a>
                </div>
                {context_pill}
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
