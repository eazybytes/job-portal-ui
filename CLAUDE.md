# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build
- `npm run lint` — ESLint (flat config, JS/JSX only)
- `npm run preview` — Preview production build

## Repository Structure

```
job-portal-ui/
├── public/               # Static assets (favicons, company logos)
├── src/
│   ├── components/       # Reusable UI components (Navbar, Footer, Layout, ProtectedRoute, etc.)
│   ├── context/          # Core React contexts: AuthContext, JobContext, ThemeContext
│   ├── contexts/         # Data-fetching contexts: JobsDataContext, CompaniesContext
│   ├── data/             # mockData.js — all seed data (jobs, companies, users)
│   ├── pages/            # Route-level page components
│   │   └── admin/        # Admin-only pages (Dashboard, CompanyManagement, etc.)
│   ├── services/         # Simulated async API service functions
│   ├── utils/            # Shared utilities (delay.js)
│   ├── App.jsx           # Root component — router + provider tree
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles (Tailwind imports)
├── eslint.config.js      # ESLint flat config
├── vite.config.js        # Vite configuration
└── index.html            # HTML entry point
```
