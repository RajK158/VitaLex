"""Service orchestration layer.

Coordinates calls across `core`, `llm`, and `vectorstore` modules to fulfill
a full use case requested by the UI (e.g. "summarize this document"). Keeps
the Streamlit pages thin and keeps `core` modules single-purpose.
"""
