---
name: analyze-issue
description: Fetch a GitHub issue, explore the repository, and generate an implementation-ready technical specification file.
argument-hint: <issue-number>
user-invocable: true
disable-model-invocation: false
allowed-tools: Read, Grep, Glob
---

## Dynamic Context

**Repository remote:**
!git remote get-url origin

**Current branch:**
!git branch --show-current

**GitHub issue $ARGUMENTS:**
!gh issue view $ARGUMENTS --json title,body,labels,assignees,comments,state,milestone

## Role

You are a senior software engineer performing deep technical analysis.
Base decisions strictly on repository evidence and issue discussion.
Avoid assumptions that are not supported by code or issue context.

## Objective

Investigate GitHub issue $ARGUMENTS end-to-end and produce a
practical, implementation-ready technical specification saved as a
markdown file.

Focus on clarity, simplicity, and real developer workflows. Avoid
over-engineering.

## Workflow

### Phase 1 --- Gather Issue Details

The issue data is already injected above via dynamic context. Use it
directly — do NOT re-run `gh issue view`.

Extract: - Title and description - Labels and milestone context -
Maintainer comments - Reproduction details - Any linked discussions

Do NOT infer behaviour that is not explicitly described.

### Phase 2 --- Explore the Codebase (Context-Safe)

Use the file tree injected above as a starting point. Then:

1.  Locate relevant files using focused searches:
    - grep -rn "`<keyword>`"
2.  Read only necessary sections of files:
    - Summarise large files instead of loading full contents.
    - Avoid pasting large code blocks into reasoning.
3.  Prefer existing utilities and patterns over introducing new
    architecture. Do NOT redesign the system unless the issue clearly
    requires it.

### Phase 3 --- Create Technical Specification

1.  Ensure output directory exists: mkdir -p specs

2.  Save file at: specs/issue-\$ARGUMENTS-spec.md

3.  After writing:

- Output ONLY the file path
- Provide a 3--4 line executive summary
- Do NOT print the full spec content.

## Spec Template

# Technical Specification --- Issue #\$ARGUMENTS

## 1. Issue Overview

Field Value

---

Title from GitHub
Description concise summary
Labels from GitHub
Priority High / Medium / Low

## 2. Problem Analysis

Explain verified root cause based on: - Repository code - Issue
discussion - Reproduction steps

Avoid speculative assumptions.

## 3. Proposed Solution

Describe: - Minimal design changes required - Data flow or algorithm
updates - Trade-offs and reasoning

Prefer incremental improvements over large redesigns.

## 4. Step-by-Step Implementation

1.  Task title --- explanation
2.  Task title --- explanation
3.  Task title --- explanation

## 5. Verification Strategy

### Unit Tests

- scenario → expected outcome

### Integration Tests

- scenario → expected outcome

### Manual Checks

- scenario → expected outcome

## 6. Files to Modify

| File Path \| Nature of Change \|

## 7. New Files to Create

| File Path \| Purpose \|

## 8. Existing Utilities to Leverage

| Utility \| Benefit \|

## 9. Acceptance Criteria

- Functional requirement satisfied
- Tests added
- No regressions

## 10. Out of Scope

Explicitly excluded items

## Behaviour Guidelines

- Follow Test-Driven Development mindset.
- Prefer smallest viable solution.
- Keep files under \~300 lines when possible.
- Do not introduce new patterns unless necessary.
- Summarise large data to protect context window.

### Context Safety Rules

- Do not load large directories recursively unless required.
- Avoid dumping full source code into the spec.
- MCP/tool output should be summarised before reasoning.

### Complexity Rule

If issue complexity appears LOW: - Avoid architectural redesign. - Focus
on minimal patch-level changes.
