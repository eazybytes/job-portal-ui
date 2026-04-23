---
name: Auth & Registration Security State
description: Key security weaknesses found in AuthContext and Register.jsx — plaintext passwords, localStorage session trust, privilege escalation via updateProfile
type: project
---

All auth credentials (DUMMY_USERS and registeredUsers) are stored as plaintext passwords in source code and localStorage respectively. No hashing is used anywhere.

The `register()` function in AuthContext hard-codes `role: "ROLE_JOB_SEEKER"` for new users — good — but the `updateProfile()` function at lines 317-319 does an unconstrained spread (`...user, ...profileData`) that lets any caller elevate the `role` field to ROLE_ADMIN or ROLE_EMPLOYER without any server-side check.

Auth state is restored purely from `localStorage.getItem("jobPortalUser")` at startup (line 137-155). An attacker who can write to localStorage (via XSS or physical access) can inject any user object including role fields and bypass all ProtectedRoute guards.

The fake token is `"mock-jwt-" + Date.now()` (line 204) — it is never validated on any subsequent request; it only serves as a truthy presence check.

Register.jsx collects `userType` (jobSeeker/employer) from the form but AuthContext.register() ignores it entirely — employer registrations silently get ROLE_JOB_SEEKER. This is both a UX bug and a latent authz inconsistency.

The `registeredUsers` array stored in localStorage at key `registeredUsers` contains plaintext passwords for all self-registered users.

**Why:** First audit of this codebase — establishing baseline security posture.
**How to apply:** Reference these specifics when reviewing any future changes to AuthContext, profileService, or registration flows. Flag any new code that spreads arbitrary props into the user object or reads role from client storage without re-validation.
