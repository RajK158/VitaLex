"""File/path handling helpers."""


def format_file_size(num_bytes: int) -> str:
    """Format a byte count as a short human-readable string (e.g. "2.3 MB")."""
    size = float(num_bytes)
    for unit in ("B", "KB", "MB", "GB"):
        if size < 1024 or unit == "GB":
            return f"{size:.0f} {unit}" if unit == "B" else f"{size:.1f} {unit}"
        size /= 1024
    return f"{size:.1f} GB"
