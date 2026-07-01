"""LLM integration layer.

Wraps the Gemini API and LangChain constructs (prompts, chains) so the rest
of the codebase never talks to the LLM SDK directly. This isolates the app
from vendor-specific changes and makes swapping models easier.
"""
