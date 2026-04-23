---
name: Project Architecture: Employer CRUD Pattern
description: How postJob/updateJob/deleteJob interact with React state and localStorage in JobContext — includes known bugs
type: project
---

Employer job mutation functions in `src/context/JobContext.jsx` use a dual-storage pattern: React state (`postedJobs`) is persisted via a `useEffect` sync to `postedJobs_{userId}` localStorage, while the global listing key `globalPostedJobs` is updated inline within `postJob` and `deleteJob`.

Known issues found during April 2026 review:

- `updateJob` only updates React state — it does NOT update `globalPostedJobs` in localStorage, so edits are invisible to the main job listing until a page refresh re-reads state (which it won't, because the listing reads localStorage at `fetchAllJobs` time).
- `postJob` and `deleteJob` update `globalPostedJobs` inline (synchronously), but `postedJobs_{userId}` is updated asynchronously via `useEffect`. This creates a brief window of divergence.
- `postJob` sets `companyLogo` to the hardcoded emoji `'🏢'` instead of the path format used in `mockData.js` (e.g., `/logos/techcorp.png`). Shape mismatch breaks any component that renders a logo `<img>` tag conditionally.
- IDs for new jobs are generated with `Date.now()` — integer milliseconds. Low collision risk for a single user but not safe under rapid successive posts.
- All three functions are synchronous (no `async`/`await`) despite job-seeker equivalents (`applyForJob`, `saveJob`) all being async. Inconsistent pattern.
- `postJob` and `deleteJob` read `globalPostedJobs` directly via `JSON.parse(localStorage.getItem(...))` instead of going through the service layer.

**Why:** Functions were written before the service layer convention was established.
**How to apply:** When reviewing or extending employer CRUD, flag the updateJob/globalPostedJobs gap and the companyLogo shape mismatch as the two highest-priority bugs.
