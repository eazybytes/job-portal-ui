# 🔎 Change Investigation Report

**Target**: `src/components/Footer.jsx:171-182`
**Investigation Date**: 2026-03-20
**Repository**: git@github.com:eazybytes/job-portal-ui.git
**Branch**: skills

---

## 📋 Investigation Summary

| Detail                  | Value                                         |
| ----------------------- | --------------------------------------------- |
| File(s) Analyzed        | `src/components/Footer.jsx`                   |
| Lines Investigated      | 171–182                                       |
| Total Commits on File   | 5 (4 non-merge)                               |
| Unique Authors          | 1 (eazybytes / Eazy Bytes — same person)      |
| File Age (First Commit) | 2026-03-14                                    |
| Last Modified           | 2026-03-14 by Eazy Bytes                      |

---

## 👥 Author Breakdown

| # | Author             | Email                  | Commits | Lines Owned | First Contribution | Last Contribution |
|---|--------------------|------------------------|---------|-------------|--------------------|-------------------|
| 1 | eazybytes          | tutor@eazybytes.com    | 4       | 179 (90%)   | 2026-03-14         | 2026-03-14        |
| 2 | Eazy Bytes         | tutor@eazybytes.com    | 1       | 20 (10%)    | 2026-03-14         | 2026-03-14        |

> Note: Both author names share the same email — this is the same person using different git user.name values (local vs GitHub OAuth).

**Primary Owner**: eazybytes (90% of current lines)
**Most Recent Contributor**: Eazy Bytes (via GitHub PR merge on 2026-03-14)
**CODEOWNERS**: Not configured

---

## 📅 Change Timeline

### `fd6f03e` — 2026-03-14 17:53:06 +0530

- **Author**: Eazy Bytes <tutor@eazybytes.com>
- **Committer**: GitHub <noreply@github.com> (merged via PR #10)
- **Message**: `fix: add hover tooltip text to Contact Us link in footer (#10)`
- **Body**: Co-authored-by claude[bot] and Eazy Bytes (GitHub OAuth)
- **Ticket References**: `#10` (GitHub PR)
- **Lines Changed**: +5 / -0
- **What Changed**:
  > Added a hover tooltip popup to the "Contact Us" footer link. The tooltip contains a bold "Contact Us" heading, a descriptive paragraph directing users to the contact page, and a CSS arrow (`border-t-gray-700`) pointing downward toward the link. The tooltip uses Tailwind's `opacity-0 group-hover:opacity-100` pattern to show/hide on hover. This was purely an additive UI enhancement — no existing code was removed or restructured.

---

### `5ed4d92` — 2026-03-14 11:03:01 +0530

- **Author**: eazybytes <tutor@eazybytes.com>
- **Message**: `Initial commit: Job Portal React UI App`
- **Body**: Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
- **Ticket References**: None found
- **Lines Changed**: Entire file created
- **What Changed**:
  > Created the Footer component from scratch as part of the initial project scaffolding. Lines 171–182 established the "Contact Us" `<Link>` with hover styling (`group relative`, gradient overlay) but **without** a tooltip — the link existed but had no descriptive popup text at this point.

---

## 🔬 Line-by-Line Blame (Lines 171–182)

| Line | Code (truncated to 80 chars)                                                      | Author     | Date       | Commit Message                                    |
|------|-----------------------------------------------------------------------------------|------------|------------|---------------------------------------------------|
| 171  | `<Link`                                                                           | eazybytes  | 2026-03-14 | Initial commit: Job Portal React UI App           |
| 172  | `  to="/contact"`                                                                 | eazybytes  | 2026-03-14 | Initial commit: Job Portal React UI App           |
| 173  | `  className="group relative hover:text-white transition-colors duration-300"`   | eazybytes  | 2026-03-14 | Initial commit: Job Portal React UI App           |
| 174  | `>`                                                                               | eazybytes  | 2026-03-14 | Initial commit: Job Portal React UI App           |
| 175  | `  <span className="relative z-10">Contact Us</span>`                            | eazybytes  | 2026-03-14 | Initial commit: Job Portal React UI App           |
| 176  | `  <div className="absolute inset-0 bg-gradient-to-r ..."></div>`                | eazybytes  | 2026-03-14 | Initial commit: Job Portal React UI App           |
| 177  | `  <div className="absolute bottom-full left-1/2 ... shadow-xl">`                | Eazy Bytes | 2026-03-14 | fix: add hover tooltip text to Contact Us link…   |
| 178  | `    <p className="font-semibold text-white mb-1">Contact Us</p>`                | Eazy Bytes | 2026-03-14 | fix: add hover tooltip text to Contact Us link…   |
| 179  | `    <p>Have a question or need assistance? ...</p>`                              | Eazy Bytes | 2026-03-14 | fix: add hover tooltip text to Contact Us link…   |
| 180  | `    <div className="absolute top-full ... border-t-gray-700"></div>`            | Eazy Bytes | 2026-03-14 | fix: add hover tooltip text to Contact Us link…   |
| 181  | `  </div>`                                                                        | Eazy Bytes | 2026-03-14 | fix: add hover tooltip text to Contact Us link…   |
| 182  | `</Link>`                                                                         | eazybytes  | 2026-03-14 | Initial commit: Job Portal React UI App           |

---

## 🎫 Linked Tickets & References

| Ticket ID | Commit    | Author     | Date       | Commit Subject                                         |
|-----------|-----------|------------|------------|--------------------------------------------------------|
| #10       | `fd6f03e` | Eazy Bytes | 2026-03-14 | fix: add hover tooltip text to Contact Us link in footer |

---

## 💡 Insights

- **Churn Assessment**: Low churn. The file has only 5 commits concentrated on a single day (2026-03-14). The project is brand new. Churn rate is not yet meaningful but the initial pattern is healthy — one foundational commit followed by targeted fixes.

- **Bus Factor**: High risk. A single author (tutor@eazybytes.com) owns 100% of this file under two git identity names. If this author were unavailable, no one else has context on the component.

- **Stale Code Risk**: Not applicable — file was created on 2026-03-14, less than a week ago.

- **Review Gaps**: The initial commit (`5ed4d92`) has no ticket reference, which is expected for an initial scaffolding commit. All subsequent changes reference PR #10. No undocumented hotfixes found.

- **AI Co-authorship**: Both commits in this range note Claude AI as a co-author (`claude[bot]` on PR #10, `Claude Sonnet 4.6` on the initial commit). This indicates the implementation was AI-assisted throughout.
