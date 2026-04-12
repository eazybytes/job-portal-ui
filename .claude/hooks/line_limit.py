#!/usr/bin/env python3
"""
PreToolUse hook — blocks Write/Edit calls that would result in a file exceeding 500 lines.

Exit codes:
  0 → allowed
  2 → blocked (stderr message fed back to Claude)
"""

import json
import sys

LINE_LIMIT = 500


def get_resulting_content(tool_name, tool_input):
    """Return the final file content after the tool call, or None to skip."""
    if tool_name == "Write":
        return tool_input.get("file_path", ""), tool_input.get("content", "")

    if tool_name == "Edit":
        filepath = tool_input.get("file_path", "")
        old_string = tool_input.get("old_string", "")
        new_string = tool_input.get("new_string", "")
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                current = f.read()
            return filepath, current.replace(old_string, new_string, 1)
        except OSError:
            return filepath, None  # file unreadable — skip

    return "", None


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    tool_name = data.get("tool_name", "")
    if tool_name not in ("Write", "Edit"):
        sys.exit(0)

    filepath, content = get_resulting_content(tool_name, data.get("tool_input", {}))
    if not content:
        sys.exit(0)

    lines = len(content.splitlines())
    if lines > LINE_LIMIT:
        print(
            f"Blocked: '{filepath}' would be {lines} lines (limit: {LINE_LIMIT}).\n"
            f"Split it into smaller, focused modules before writing.",
            file=sys.stderr,
        )
        sys.exit(2)

    sys.exit(0)


if __name__ == "__main__":
    main()
