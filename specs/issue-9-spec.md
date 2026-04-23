# Technical Specification — Issue #9

## 1. Issue Overview

| Field       | Value                                                                 |
|-------------|-----------------------------------------------------------------------|
| Title       | Inside the footer, when user hovers on "Contact Us" no text displayed |
| Description | The "Contact Us" footer link lacked a hover tooltip, unlike the other three footer links (Privacy Policy, Terms of Service, Cookie Policy) which all had one. |
| Labels      | None                                                                  |
| Priority    | Low                                                                   |
| State       | **Closed** (already fixed in PR #10)                                  |

## 2. Problem Analysis

The `Footer.jsx` component renders four legal/info links at the bottom:
- Privacy Policy
- Terms of Service
- Cookie Policy
- Contact Us

The first three links used a CSS group-hover tooltip pattern — a `<div>` absolutely positioned above the link, visible only on hover. The "Contact Us" link was missing this tooltip block entirely, so hovering over it displayed no contextual text.

Root cause: **omission** — the tooltip div was not added when "Contact Us" was originally added to the footer.

## 3. Proposed Solution

Add the same tooltip pattern used by the other three footer links to the "Contact Us" `<Link>` element. No architectural change is required — this is a pure markup addition.

Pattern used by existing links:
```jsx
<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 bg-gray-900 border border-gray-700 rounded-xl p-4 text-xs text-gray-300 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 shadow-xl">
  <p className="font-semibold text-white mb-1">Contact Us</p>
  <p>Have a question or facing an issue? Reach out to our support team...</p>
</div>
```

Trade-offs: none — this is additive only, zero risk of regression.

## 4. Step-by-Step Implementation

1. **Locate the Contact Us link** — `src/components/Footer.jsx`, near the bottom legal links section.
2. **Add `group relative` classes** to the `<Link>` element if not already present.
3. **Insert tooltip markup** — Add a background highlight div and the tooltip popup div as siblings to the link text, mirroring the pattern from Privacy Policy / Terms of Service / Cookie Policy links.
4. **Write tooltip copy** — Explain that users can send a message to the admin about problems they are facing.

## 5. Verification Strategy

### Manual Checks
- Hover over "Contact Us" in the footer → tooltip popup appears with descriptive text.
- Hover over Privacy Policy, Terms of Service, Cookie Policy → tooltips still appear (no regression).
- Tooltip disappears when mouse leaves the link.
- Tooltip renders correctly on mobile (no overflow/clipping).

### Unit Tests
- Not applicable — this is a pure visual/markup change with no logic.

### Integration Tests
- Not applicable — no data flow or state is involved.

## 6. Files to Modify

| File Path                    | Nature of Change                                      |
|------------------------------|-------------------------------------------------------|
| `src/components/Footer.jsx`  | Add hover tooltip markup to the "Contact Us" `<Link>` |

## 7. New Files to Create

None.

## 8. Existing Utilities to Leverage

| Utility                         | Benefit                                                  |
|----------------------------------|----------------------------------------------------------|
| Tailwind `group` / `group-hover` | Already used by other footer links — reuse exact pattern |
| Existing tooltip div structure   | Copy-paste from Privacy Policy link, adjust copy only    |

## 9. Acceptance Criteria

- Hovering over "Contact Us" in the footer displays a tooltip with descriptive help text.
- Tooltip copy communicates that users can contact the support/admin team about problems.
- All other footer link tooltips remain unaffected.
- No new dependencies introduced.

## 10. Out of Scope

- Styling changes to the tooltip (must match existing footer link tooltips).
- Adding actual navigation or form logic to the Contact Us page.
- Any changes outside `Footer.jsx`.
