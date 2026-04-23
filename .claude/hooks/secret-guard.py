#!/usr/bin/env python3
"""
PreToolUse hook — blocks Edit/Write/NotebookEdit tool calls that contain hardcoded secrets.

Exit codes:
  0  → clean, write proceeds
  2  → secret detected, write is blocked and stderr is fed back to Claude
"""

import os
import sys
import json
import re


PATTERNS = [
    # More-specific patterns first so labels are accurate when multiple match
    ("Anthropic API key",           r"sk-ant-[A-Za-z0-9_-]{30,}"),
    ("OpenAI / Stripe key",         r"sk-[a-zA-Z0-9_-]{20,}"),
    ("GitHub token (classic)",      r"ghp_[A-Za-z0-9]{30,}"),
    ("GitHub fine-grained PAT",     r"github_pat_[A-Za-z0-9_]{40,}"),
    ("Slack bot token",             r"xoxb-[0-9A-Za-z-]{50,}"),
    ("Slack user token",            r"xoxp-[0-9A-Za-z-]{50,}"),
    ("Google API key",              r"AIza[0-9A-Za-z_-]{35}"),
    ("AWS secret access key",       r'(?i)aws.{0,20}secret.{0,20}["\'][A-Za-z0-9/+=]{40}["\']'),
    ("PEM private key",             r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    ("Hardcoded password",          r'(?i)(?:password|passwd|pwd)\s*[:=]\s*["\'][^"\']{6,}["\']'),
    ("Hardcoded API key",           r'(?i)(?:api_key|apikey|api_secret)\s*[:=]\s*["\'][^"\']{8,}["\']'),
    ("Hardcoded secret",            r'(?i)(?:secret_key|client_secret)\s*[:=]\s*["\'][^"\']{8,}["\']'),
]

# Files that are allowed to contain secret-like patterns (templates, docs)
SAFE_SUFFIXES = (".example", ".sample", ".template")
SAFE_NAMES = ("CLAUDE.md", "secret-guard.py")


def redact(value: str) -> str:
    """Show first 6 chars then asterisks so the pattern is identifiable but not leaked."""
    visible = min(6, len(value))
    return value[:visible] + "*" * max(4, len(value) - visible)


def extract_content(tool: str, inp: dict) -> tuple:
    """Return (file_path, content_to_scan) for the given tool, or ("", "") to skip."""
    if tool == "Write":
        return inp.get("file_path", ""), inp.get("content", "")
    if tool == "Edit":
        return inp.get("file_path", ""), inp.get("new_string", "")
    if tool == "NotebookEdit":
        return inp.get("notebook_path", ""), inp.get("new_source", "")
    return "", ""


def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    tool = data.get("tool_name", "")
    inp = data.get("tool_input", {})
    if not isinstance(inp, dict):
        sys.exit(0)

    file_path, content = extract_content(tool, inp)
    if not content:
        sys.exit(0)

    basename = os.path.basename(file_path) if file_path else ""

    # Skip safe files
    if basename in SAFE_NAMES or any(basename.endswith(s) for s in SAFE_SUFFIXES):
        sys.exit(0)

    hits = []
    for label, pattern in PATTERNS:
        try:
            match = re.search(pattern, content)
        except re.error:
            continue
        if match:
            hits.append((label, redact(match.group(0))))

    if hits:
        file_label = f" in {basename}" if basename else ""
        lines = [
            f"Secret guard blocked write{file_label}: hardcoded credential(s) detected.\n",
            "Detected:",
        ]
        for label, redacted in hits:
            lines.append(f"  • {label}: {redacted}")
        lines += [
            "",
            "Fix: store secrets in environment variables or a .env file.",
            "Never hardcode credentials in source files.",
        ]
        print("\n".join(lines), file=sys.stderr)
        sys.exit(2)

    sys.exit(0)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        # Fail open: unexpected errors must never block legitimate writes
        sys.exit(0)
