"""Streamlit application entrypoint for VitaLex AI.

Renders the app shell (theme + sidebar) and routes to either the landing
dashboard or the Upload Document screen based on the active sidebar
selection. Contains no feature/business logic itself - it only decides
*which* pre-built screen component to render; all real logic lives in the
`services`/`core` layers.

Run with: streamlit run app/main.py
"""

import sys
from pathlib import Path

# Streamlit only puts this script's directory (app/) on sys.path. The
# project root must be added too so `core`, `services`, and `models` -
# which live one level up - can be imported by the components below.
_PROJECT_ROOT = str(Path(__file__).resolve().parent.parent)
if _PROJECT_ROOT not in sys.path:
    sys.path.append(_PROJECT_ROOT)

import streamlit as st

from components.feature_cards import render_feature_grid
from components.footer import render_footer
from components.hero import render_hero
from components.sidebar import render_sidebar
from components.upload_screen import render_upload_screen
from components.workflow import render_workflow
from styles.theme import load_theme

st.set_page_config(
    page_title="VitaLex AI",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="expanded",
)

load_theme()

active_module = render_sidebar()

if active_module == "Upload Document":
    render_upload_screen()
else:
    render_hero(active_module=active_module)
    render_workflow()
    render_feature_grid()

render_footer()
