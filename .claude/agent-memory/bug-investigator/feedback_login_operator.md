---
name: Auth login comparison operator bug pattern
description: AuthContext.login used !== instead of === for password comparison, causing every login to fail with "Invalid email or password"
type: feedback
---

The `login` function in `src/context/AuthContext.jsx` had an inverted comparison operator on the credential lookup:

```js
// WRONG — finds users where password does NOT match
const foundUser = searchPool.find(
  (u) => u.email === email && u.password !== password,
);
```

Should be `===` for password, not `!==`.

**Why:** This is a single-character typo (`!` instead of nothing) that completely inverts the predicate logic. The `find` call returns a match only when the password is wrong — so correct credentials always return `undefined`, and the function always returns the error path.

**How to apply:** Whenever login always fails (100% failure rate, no users can authenticate), check the predicate inside `searchPool.find()` in AuthContext first. Confirm both the email and password conditions use `===`.
