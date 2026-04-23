# Technical Specification — Issue #5

## 1. Issue Overview

| Field       | Value                                                                         |
|-------------|-------------------------------------------------------------------------------|
| Title       | Inside the footer, when hover onto the "Privacy Policy" nothing being displayed |
| Description | The "Privacy Policy" footer link had no hover tooltip, so hovering over it showed nothing. All other footer links (Terms of Service, Cookie Policy, Contact Us) had the same gap at the time. |
| Labels      | None                                                                          |
| Priority    | Low                                                                           |
| State       | **Closed** (fixed in PR #6)                                                   |

## 2. Problem Analysis

`src/components/Footer.jsx` renders four legal/info links in the bottom bar:
- Privacy Policy
- Terms of Service
- Cookie Policy
- Contact Us

Each link uses a Tailwind `group` / `group-hover` pattern to show a tooltip popup positioned above the link on hover. At the time of the issue, the **Privacy Policy** `<a>` element was missing the tooltip `<div>` block entirely — only the link text was rendered. The hover highlight background div may also have been absent.

Root cause: **omission** — the tooltip markup was not included when the Privacy Policy link was first added to the footer. No logic or data flow is involved.

## 3. Proposed Solution

Add the tooltip markup to the Privacy Policy `<a>` element, mirroring the pattern already used by the other footer links. No architectural change needed — this is a pure markup addition of ~5 lines.

Structure to add (inside the `<a>` element):
1. Background highlight div — fades in on hover via `group-hover:opacity-100`
2. Tooltip popup div — absolutely positioned above the link, also fades in on hover
3. Tooltip caret div — small triangle at the bottom of the popup pointing down to the link

Copy: short summary of the privacy policy commitment (data collected, no third-party sales).

## 4. Step-by-Step Implementation

1. **Locate the Privacy Policy link** — `src/components/Footer.jsx` ~line 144, inside the bottom legal links `<div>`.
2. **Verify `group relative` classes** — ensure the `<a>` has `group relative` in its `className` so child `group-hover:` utilities work.
3. **Add background highlight div** — same gradient/opacity pattern as the other three links.
4. **Add tooltip popup div** — `absolute bottom-full` positioned, `w-72`, fades in on `group-hover:opacity-100`, `pointer-events-none`.
5. **Write tooltip copy** — privacy-policy-relevant text: data collected, no third-party sales, refer users to full policy.
6. **Add tooltip caret** — small `border-t-gray-700` triangle anchored at `top-full` of the popup div.

## 5. Verification Strategy

### Unit Tests
- Not applicable — pure markup addition with no logic.

### Integration Tests
- Not applicable — no state or data flow involved.

### Manual Checks
- Hover over "Privacy Policy" → tooltip popup appears with privacy-related copy.
- Tooltip disappears when mouse leaves the link.
- Terms of Service, Cookie Policy, Contact Us tooltips still appear (no regression).
- Tooltip does not overflow viewport on small screens.
- Dark background of the tooltip (`bg-gray-900`) is readable against the footer background.

## 6. Files to Modify

| File Path                   | Nature of Change                                               |
|-----------------------------|----------------------------------------------------------------|
| `src/components/Footer.jsx` | Add hover tooltip markup to the "Privacy Policy" `<a>` element |

## 7. New Files to Create

None.

## 8. Existing Utilities to Leverage

| Utility                              | Benefit                                                          |
|--------------------------------------|------------------------------------------------------------------|
| Tailwind `group` / `group-hover`     | Already used by the other three footer links — reuse exact classes |
| Existing tooltip div structure       | Copy from Terms of Service or Cookie Policy link, adjust copy only |

## 9. Acceptance Criteria

- Hovering over "Privacy Policy" in the footer displays a tooltip with descriptive privacy-related text.
- Visual style (size, position, animation) matches the other footer link tooltips exactly.
- No other footer links are affected.
- No new dependencies or components introduced.

## 10. Out of Scope

- Linking Privacy Policy to an actual policy page.
- Any changes to other footer links.
- Styling changes beyond matching the existing tooltip pattern.
- Any backend or data changes.
