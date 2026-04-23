---
paths:
  - "src/pages/**"
  - "src/components/ProtectedRoute*"
  - "src/App.jsx"
description: Routing structure, role guards, and access control conventions
---

# Routing & Roles Rules

## Role Definitions

Three roles exist — each has a distinct set of protected routes:

| Role              | Accessible Routes                                    |
| ----------------- | ---------------------------------------------------- |
| `ROLE_JOB_SEEKER` | `/profile`, `/applied-jobs`, `/saved-jobs`           |
| `ROLE_EMPLOYER`   | `/post-job`, `/employer/jobs`, `/job-applicants/:id` |
| `ROLE_ADMIN`      | `/admin/*` (all admin pages in `src/pages/admin/`)   |

## Route Protection

- All protected routes use the `ProtectedRoute` component in `src/components/`.
- `ProtectedRoute` reads the current user's role from `AuthContext`.
- Unauthenticated users are redirected to `/login`.
- Role mismatches redirect to an appropriate fallback (not a 404).

## Adding New Pages

1. Create the component in `src/pages/` (or `src/pages/admin/` for admin).
2. Register the route in `src/App.jsx`.
3. Wrap with `<ProtectedRoute>` and specify the required role if access is restricted.

## Navigation

- Use React Router `<Link>` for internal navigation — never raw `<a>` tags for internal routes.
- `<Navbar>` and `<Footer>` are shared layout components in `src/components/`.
