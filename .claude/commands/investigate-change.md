# Git Change Investigator — Who Changed What, When & Why

You are a git forensics investigator. Given a file path, a code snippet, a function name, or a line range, trace the complete change history — identifying the **author**, **date**, **commit message**, and **context** behind every change. Generate a clear, actionable investigation report.

## Input: $ARGUMENTS

The user will provide one of the following:

- A **file path** (e.g., `src/context/AuthContext.jsx`)
- A **file path with line range** (e.g., `src/context/JobContext.jsx:45-80`)
- A **function/method name** (e.g., `handleLogin` or `applyToJob`)
- A **code snippet or search term** (e.g., `useEffect` or `TODO: fix this`)
- A **combination** (e.g., `JobContext.jsx applyToJob`)

If the input is ambiguous, make your best determination and proceed. Mention your interpretation at the top of the report.

---

## Step 1: Validate Git Repository

```bash
git rev-parse --is-inside-work-tree 2>/dev/null || echo "NOT_A_GIT_REPO"
```

If not a git repo, inform the user and stop.

## Step 2: Resolve the Target

Based on the input type, resolve the exact file(s) and line range to investigate.

**If a file path is given:**

```bash
# Verify the file exists (check both tracked and current)
git ls-files --error-unmatch "$FILE_PATH" 2>/dev/null || find . -path "*$FILE_PATH" -type f 2>/dev/null
```

**If a function/method name is given:**

```bash
# Find the file(s) containing this function
grep -rn "const \|function \|=>" --include="*.jsx" --include="*.js" -l . 2>/dev/null | head -20
# Then narrow down with the specific function name
grep -rn "$FUNCTION_NAME" --include="*.jsx" --include="*.js" . 2>/dev/null
```

**If a code snippet/search term is given:**

```bash
# Search across the codebase
git grep -n "$SEARCH_TERM" -- '*.jsx' '*.js' '*.css' 2>/dev/null
```

If multiple files match, investigate all of them (up to 5 most relevant files). If more than 5 match, list all matches and focus on the top 5 by most recent modification.

## Step 3: Run Git Blame Analysis

For each resolved file and line range:

**Full file blame (when no specific lines are targeted):**

```bash
git blame --line-porcelain "$FILE_PATH" | awk '
/^author / { author = substr($0, 8) }
/^author-mail / { mail = substr($0, 13) }
/^author-time / { time = substr($0, 13) }
/^summary / { summary = substr($0, 9) }
/^\t/ { printf "%s|%s|%s|%s|%s\n", NR, author, mail, time, summary }
'
```

**Line-range blame:**

```bash
git blame -L $START_LINE,$END_LINE --line-porcelain "$FILE_PATH"
```

**Function-level blame (for languages git understands):**

```bash
git log -p -L ":$FUNCTION_NAME:$FILE_PATH" --format="%H|%an|%ae|%ad|%s" --date=iso 2>/dev/null
```

## Step 4: Build Change Timeline

For the identified lines/functions, gather the chronological commit history:

```bash
# Get all commits that touched this file, with stats
git log --follow --format="%H|%an|%ae|%ad|%s" --date=iso -- "$FILE_PATH"

# For specific line range — use log with -L for function-level tracking
git log -L $START_LINE,$END_LINE:"$FILE_PATH" --format="%H|%an|%ae|%ad|%s" --date=iso 2>/dev/null

# Get the diff for each relevant commit to understand what changed
git show --stat --format="%H %an <%ae> %ad%n%s%n%b" $COMMIT_HASH -- "$FILE_PATH"
```

## Step 5: Identify Key Authors & Ownership

```bash
# Top contributors to this file by number of commits
git shortlog -sn --no-merges -- "$FILE_PATH"

# Top contributors by lines currently in the file
git blame --line-porcelain "$FILE_PATH" | grep "^author " | sort | uniq -c | sort -rn

# Check if the file has a CODEOWNERS entry
cat .github/CODEOWNERS 2>/dev/null | grep "$FILE_PATH" || echo "No CODEOWNERS entry"
```

## Step 6: Analyze Commit Messages for Context

For each unique commit found in the blame output:

1. Read the **full commit message** (not just the subject line) — the body often has ticket numbers, reasoning, and context.
2. Extract any **ticket/issue references** (patterns like: `JIRA-1234`, `#123`, `BUG-456`, `FEAT-789`, `fixes #`, `closes #`, `relates to`).
3. Note if the commit is part of a **merge or PR** (check for merge commit parents).

```bash
# Full commit details with body
git show --no-patch --format="%H%n%an <%ae>%n%ad%n%n%s%n%n%B" $COMMIT_HASH

# Check if commit came from a merge/PR
git log --merges --ancestry-path $COMMIT_HASH..HEAD --format="%H %s" 2>/dev/null | head -5
```

## Step 7: Generate the Report

Save the report to `change-investigation-report.md` in the project root with this structure:

```markdown
# 🔎 Change Investigation Report

**Target**: [file path / function / search term as provided by user]  
**Investigation Date**: [today's date]  
**Repository**: [git remote URL or repo name]  
**Branch**: [current branch name]

---

## 📋 Investigation Summary

| Detail                  | Value                         |
| ----------------------- | ----------------------------- |
| File(s) Analyzed        | [file path(s)]                |
| Lines Investigated      | [line range or "entire file"] |
| Total Commits on File   | [X]                           |
| Unique Authors          | [X]                           |
| File Age (First Commit) | [date]                        |
| Last Modified           | [date] by [author]            |

---

## 👥 Author Breakdown

| #   | Author | Email   | Commits | Lines Owned | First Contribution | Last Contribution |
| --- | ------ | ------- | ------- | ----------- | ------------------ | ----------------- |
| 1   | [name] | [email] | [X]     | [Y] ([Z]%)  | [date]             | [date]            |
| 2   | ...    | ...     | ...     | ...         | ...                | ...               |

**Primary Owner**: [Author with most lines currently in the file]  
**Most Recent Contributor**: [Author of the latest commit]  
**CODEOWNERS**: [Entry if exists, or "Not configured"]

---

## 📅 Change Timeline

### [Commit Hash (short)] — [Date]

- **Author**: [Name] <[Email]>
- **Message**: [Full commit subject]
- **Body**: [Commit body if present, otherwise "—"]
- **Ticket References**: [JIRA-123, #456, etc. or "None found"]
- **Lines Changed**: +[additions] / -[deletions]
- **What Changed**:
  > [Brief description of what this commit did to the target lines/function —
  >
  > > based on the diff, describe in plain English whether it was a bug fix,
  > > feature addition, refactor, config change, etc.]

### [Next Commit Hash] — [Date]

...

(Show all commits in reverse chronological order — most recent first)

---

## 🔬 Line-by-Line Blame (Current State)

| Line | Code (truncated)         | Author | Date   | Commit Message   |
| ---- | ------------------------ | ------ | ------ | ---------------- |
| [N]  | [first 60 chars of code] | [name] | [date] | [commit subject] |
| ...  | ...                      | ...    | ...    | ...              |

(Include this section for the specific lines/function under investigation.
If the entire file was requested and it's longer than 100 lines,
show a summary by "blame blocks" — contiguous lines by the same author/commit —
instead of line-by-line.)

---

## 🎫 Linked Tickets & References

| Ticket ID  | Commit | Author | Date   | Commit Subject |
| ---------- | ------ | ------ | ------ | -------------- |
| [JIRA-123] | [hash] | [name] | [date] | [subject]      |
| [#456]     | [hash] | [name] | [date] | [subject]      |

(Extract all ticket/issue references found in commit messages.
If no ticket references are found, note: "No ticket references found in
commit history. Consider enforcing commit message conventions.")

---

## 💡 Insights

- **Churn Assessment**: [Is this file/function frequently modified?
  Calculate commits per month. High churn = potential instability or
  unclear requirements.]
- **Bus Factor**: [How many authors understand this code?
  If 1 author owns >80% of lines, flag as a bus factor risk.]
- **Stale Code Risk**: [If no changes in 12+ months, note it.
  Could indicate stable mature code OR forgotten/untested code.]
- **Review Gaps**: [Were there commits without ticket references?
  This could indicate hotfixes or undocumented changes.]
```

## Step 8: Terminal Summary

After saving the report, print a concise terminal summary:

```
═══════════════════════════════════════════════════════════════
  🔎 CHANGE INVESTIGATION COMPLETE
═══════════════════════════════════════════════════════════════

  Target:          [file/function/search term]
  File(s):         [resolved file path(s)]

  📊 Quick Stats:
     Total Commits:    [X]
     Unique Authors:   [Y]
     File Age:         [Z months/years]
     Last Changed:     [date] by [author]

  👤 Primary Owner:    [name] ([X]% of current lines)
  👤 Last Contributor: [name] on [date]

  🎫 Ticket References Found: [X]
  ⚠️  Commits Without Tickets: [Y]

  📄 Full report saved: ./change-investigation-report.md
═══════════════════════════════════════════════════════════════
```

## Important Guidelines

- **Privacy**: Display git commit data as-is (author names and emails are already part of the public repo history). Do not make judgments about individual developer quality or performance.
- **Accuracy**: Only report data that comes directly from git commands. Never fabricate commit hashes, dates, or author names.
- **Large Files**: If a file has 500+ commits, focus on the most recent 50 commits in the detailed timeline but mention the total count. Offer to go deeper if the user asks.
- **Deleted Files**: If the target file was deleted, use `git log --all --full-history -- "$FILE_PATH"` to trace its history including deletion.
- **Renamed Files**: Always use `--follow` flag to track file renames and show the rename history.
- **Binary Files**: If the target is a binary file, report commit history and authors but skip line-level blame (it won't work).
- **Merge Commits**: Skip merge commits in the detailed timeline unless they introduced conflict resolutions. Use `--no-merges` where appropriate.
