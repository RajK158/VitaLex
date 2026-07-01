"""Centralized application configuration.

Exposes a single `settings` object (Pydantic Settings) that loads values
from environment variables / `.env` - storage paths, API keys, model names,
logging level - so the rest of the codebase never reads `os.environ`
directly.
"""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_PROJECT_ROOT = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Runtime configuration for VitaLex AI, loaded from `.env`."""

    model_config = SettingsConfigDict(
        env_file=str(_PROJECT_ROOT / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = "development"
    log_level: str = "INFO"

    gemini_api_key: str = ""
    gemini_model_name: str = "gemini-1.5-pro"

    chroma_persist_dir: Path = _PROJECT_ROOT / "data" / "vector_store"
    chroma_collection_name: str = "vitalex_documents"

    raw_upload_dir: Path = _PROJECT_ROOT / "data" / "raw_uploads"
    processed_data_dir: Path = _PROJECT_ROOT / "data" / "processed"
    output_dir: Path = _PROJECT_ROOT / "data" / "outputs"

    embedding_model_name: str = "models/text-embedding-004"


settings = Settings()
