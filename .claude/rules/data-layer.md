---
paths:
  - "src/services/**"
  - "src/context/**"
  - "src/contexts/**"
  - "src/data/**"
description: Data flow, state management, and localStorage conventions
---

# Data Layer Rules

## Context Architecture

Two layers of React Context exist — keep them separate:

- `src/context/` — Core runtime state:
  - `AuthContext` — authentication, dummy users, localStorage persistence
  - `JobContext` — applications, saved jobs, employer CRUD
  - `ThemeContext` — dark/light mode toggle
- `src/contexts/` — Data-fetching with caching:
  - `JobsDataContext` — cached job list with a 5-minute TTL
  - `CompaniesContext` — company list

**Provider nesting order** (defined in `App.jsx`):
`AuthProvider → JobsDataProvider → JobProvider → CompaniesProvider → ThemeProvider`

## Service Layer Rules

- All async service functions must call `delay()` from `src/utils/delay.js` to simulate latency.
- Page components must NOT fetch data directly — use services in `src/services/`.
- Mock data originates from `src/data/mockData.js`.

## localStorage Key Patterns

| Key                        | What it stores                   |
| -------------------------- | -------------------------------- |
| `jobPortalUser`            | Currently logged-in user object  |
| `authToken`                | Session auth token               |
| `registeredUsers`          | All registered user accounts     |
| `globalPostedJobs`         | All employer-posted jobs         |
| `jobApplications_{userId}` | Applications submitted by a user |
| `savedJobs_{userId}`       | Jobs saved/bookmarked by a user  |
| `postedJobs_{userId}`      | Jobs posted by an employer       |

The `{userId}` suffix is always the logged-in user's ID — never omit it for user-specific keys.
