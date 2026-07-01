# VitaLex AI

AI-powered Healthcare Content Intelligence Platform that helps healthcare analysts understand and manage healthcare documents: classification, structured summarization, policy comparison, business impact analysis, rule generation, RAG-based Q&A, and executive report generation.

## Tech Stack

Python - Streamlit - Gemini API - LangChain - ChromaDB - PyMuPDF - Pydantic

## Project Structure

```
VitaLex-AI/
├── app/                    # Streamlit UI layer (pages, components) - presentation only
├── core/                   # Framework-agnostic domain/business logic, one subpackage per feature
├── llm/                    # Gemini + LangChain integration (client, prompts, chains)
├── vectorstore/            # ChromaDB client and indexing
├── models/                 # Pydantic schemas shared across all layers
├── services/               # Orchestration layer bridging UI <-> core/llm/vectorstore
├── utils/                  # Generic, stateless helper functions
├── data/                   # Runtime data (uploads, processed text, vector store, outputs)
├── tests/                  # Unit and integration tests
├── notebooks/              # Exploratory/prototyping notebooks
├── scripts/                # One-off automation/dev scripts
├── docs/                   # Project documentation
├── requirements.txt
└── .env.example
```

## Setup (once implementation begins)

1. Create and activate a virtual environment.
2. `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and fill in your Gemini API key and other settings.
4. Run the Streamlit app: `streamlit run app/main.py`

> Note: This repository currently contains only the project scaffold (folders, placeholder files, and configuration templates). Application logic will be implemented in subsequent steps.
