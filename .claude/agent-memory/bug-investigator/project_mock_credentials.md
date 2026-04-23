---
name: Mock user credentials reference
description: All DUMMY_USERS credentials defined in AuthContext.jsx for testing login across all roles
type: project
---

All credentials live in the `DUMMY_USERS` constant inside `src/context/AuthContext.jsx` (lines 7–121). mockData.js does NOT define auth users — it only generates jobs, companies, and salary data.

| Role             | Email                   | Password      | Name          |
| ---------------- | ----------------------- | ------------- | ------------- |
| ROLE_EMPLOYER    | employer@company.com    | employer123   | John Smith    |
| ROLE_EMPLOYER    | hr@startup.com          | hr123         | Sarah Johnson |
| ROLE_JOB_SEEKER  | jobseeker@email.com     | jobseeker123  | Alex Brown    |
| ROLE_JOB_SEEKER  | candidate@email.com     | candidate123  | Emma Davis    |
| ROLE_ADMIN       | admin@portal.com        | admin123      | Admin User    |

Additional users can be registered at runtime — they are stored in localStorage under the key `registeredUsers` as an array of user objects with `role: "ROLE_JOB_SEEKER"`.

**Why:** Auth does not use mockData.js at all. The credentials are self-contained in AuthContext. Searching mockData.js for login credentials will always come up empty.

**How to apply:** When asked about valid test credentials, reference this table directly rather than reading mockData.js.
