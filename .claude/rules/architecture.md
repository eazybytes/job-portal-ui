---
description: High-level architecture overview — stack, context layers, and key libraries
---

# Architecture

React 19 SPA using Vite 7, Tailwind CSS 4, and React Router 7. No TypeScript — plain JSX throughout.

## Stack

| Layer   | Technology                        |
| ------- | --------------------------------- |
| UI      | React 19, Tailwind CSS 4          |
| Routing | React Router 7                    |
| Build   | Vite 7                            |
| Icons   | Font Awesome, Lucide React        |
| Toasts  | react-toastify                    |
| Data    | Mock data + localStorage (no API) |

## State Management

Two layers of React Context — keep them separate:

- **`src/context/`** — Core runtime state (auth, jobs, theme)
- **`src/contexts/`** — Data-fetching contexts with caching (jobs list, companies)

Provider nesting order (defined in `App.jsx`):
`AuthProvider → JobsDataProvider → JobProvider → CompaniesProvider → ThemeProvider`

Do not change this nesting order — consumers depend on it.

## Where to Look

| Task                    | Location                                       |
| ----------------------- | ---------------------------------------------- |
| Add a new page          | `src/pages/` + register route in `src/App.jsx` |
| Shared UI component     | `src/components/`                              |
| Auth logic              | `src/context/AuthContext.jsx`                  |
| Job / application logic | `src/context/JobContext.jsx`                   |
| Mock data changes       | `src/data/mockData.js`                         |
| API simulation          | `src/services/`                                |
