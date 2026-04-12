#!/bin/bash
# protect-files.sh

INPUT=$(cat)
echo "$INPUT" >> /tmp/protect-files-debug.log
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

PROTECTED_PATTERNS=(".env" "package-lock.json" ".git/")

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    jq -n \
      --arg reason "Blocked: '$FILE_PATH' matches protected pattern '$pattern'" \
      '{decision: "block", reason: $reason}'
    exit 0
  fi
done
exit 0