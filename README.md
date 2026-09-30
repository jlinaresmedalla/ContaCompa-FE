# Contacompa dashboard

React dashboard where an accountant uploads Peruvian purchase documents, reviews what the model extracted, corrects it, and exports it to Excel.

<!-- demo GIF placeholder: assets/demo.gif, record it after the first live run -->

## Overview

The dashboard is the accountant's side of Contacompa. They sign in with a company API key, upload PDFs or photos, follow the extraction jobs, and review the purchase records the model produced: only flagged records need attention, the original file sits next to the data, and header corrections take pencil, edit and save. A costs page shows what the model spends. English by default, Spanish written natively for a Peruvian accountant, light and dark themes.

The live URL opens on a public Home page that explains Contacompa without a key: how it works in four steps, the architecture diagram and stack, and links to both repositories. Both top-bar and hero buttons read "Go to app →" ("Ir a la app →" in Spanish), opening Purchase docs with a stored key or sign-in without one; it makes no request to the API. Unknown paths lead to Home without a key and to Purchase docs with one.

<!-- Home page screenshot placeholder: add after the next deploy -->
<!-- Dashboard screenshot: capture expanded sidebar, icon rail and company account menu after the next deploy. -->

Purchase document headers show four read-only groups: Supplier, Document, Amounts and Buyer. Each pencil opens only its group, with Save and Cancel; other open groups keep their drafts. Saves send only changed fields, empty saves send nothing, and failed saves keep the draft with an error toast. Document type and IGV use AppSelect.

The private sidebar collapses to a remembered icon rail on desktop. Module pages are nested when expanded and open in a menu from the rail, with the current page marked; there are no page tabs. The company initials avatar opens company details, key time left, language, theme and sign-out. Language and theme choices use menu radio items reachable with arrow keys, with full language names for accessibility; menu items show a semantic focus ring. Below tablet width navigation uses a drawer that closes on navigation, Escape or outside tap and restores focus to its menu button.

The public Design page (`/design`) renders the design system from the code itself: primitive and semantic tokens read live from the CSS (with the primitive each semantic token points to in the active theme), type, spacing, radius, shadow and motion, and every shared component in its states. Its token and component galleries load independently on demand with skeletons. It demonstrates IconButton tooltips, AppSelect states, company avatar initials, expanded sidebar navigation and icon rail menus, and the frosted Backdrop with live tokens. It makes no request to the API.

All seven route pages load on demand in separate JavaScript chunks. Page skeletons render inside the layout, so the public top bar and private sidebar stay visible during navigation. The purchase document file preview loads separately with its own skeleton. Shared `lazyPage` and `withSuspense` helpers keep these boundaries consistent. The session query provider, API runtime and toaster load only on sign-in and private routes; Design mounts its own toaster. The private guard and shell also load separately.

The API and worker live in [Contacompa-backend](https://github.com/jlinaresmedalla/ContaCompa).

## Architecture

Home renders a lazy interactive React SVG with all components, hosting boundaries and connections. Flow chips highlight Sign-in and keys, Upload path, Extraction job and Pure core; Overview restores everything. Nodes reveal their roles on hover, focus and tap, with a full text alternative in English and Spanish. The diagram uses semantic theme tokens and scrolls inside its card on phones.

`src/features/home/architecture-data.ts` is the typed copy of the backend’s `docs/architecture/architecture.archify.json` (coordinates, components, connections, views and cards). Any backend diagram change must update this frontend copy and its translated explanations.

## Tech stack

<p align="center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="React" title="React" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="TypeScript" title="TypeScript" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg" alt="Vite" title="Vite" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" title="Tailwind CSS" width="40" height="40"/>
  <img src="https://cdn.simpleicons.org/shadcnui" alt="shadcn/ui" title="shadcn/ui" width="40" height="40"/>
  <img src="https://cdn.simpleicons.org/reactrouter" alt="React Router" title="React Router" width="40" height="40"/>
  <img src="https://cdn.simpleicons.org/reactquery" alt="TanStack Query" title="TanStack Query" width="40" height="40"/>
  <img src="https://cdn.simpleicons.org/tanstack/000000/ECE8D1" alt="TanStack Table" title="TanStack Table" width="40" height="40"/>
  <img src="https://cdn.simpleicons.org/axios" alt="Axios" title="Axios" width="40" height="40"/>
  <img src="https://cdn.simpleicons.org/reacthookform" alt="React Hook Form" title="React Hook Form" width="40" height="40"/>
  <img src="https://cdn.simpleicons.org/zod" alt="Zod" title="Zod" width="40" height="40"/>
  <img src="https://cdn.simpleicons.org/i18next" alt="i18next" title="i18next" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/eslint/eslint-original.svg" alt="ESLint" title="ESLint" width="40" height="40"/>
  <img src="https://cdn.simpleicons.org/prettier" alt="Prettier" title="Prettier" width="40" height="40"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vitest/vitest-original.svg" alt="Vitest" title="Vitest" width="40" height="40"/>
  <img src="https://cdn.simpleicons.org/testinglibrary" alt="Testing Library" title="Testing Library" width="40" height="40"/>
  <img src="https://cdn.simpleicons.org/cloudflarepages" alt="Cloudflare Pages" title="Cloudflare Pages" width="40" height="40"/>
</p>

The design system is built on shadcn/ui (Radix primitives for keyboard and ARIA behavior, lucide-react icons), restyled with two token layers, primitive scales and semantic names, in `src/index.css`. Shared controls use shadcn primitives, except the typed `AppSelect` built on react-select (ADR 0027). AppSelect loads on demand with a control-sized skeleton, supports single and multi choice, search, form validation, and portalled menus in both themes. Segmented rows become AppSelect below a 480 px container width; public preferences retain EN / ES buttons and the three theme choices at every width, including 375 px. Costs offers 7-, 30- and 90-day report periods. Secondary dashboard actions use shared lucide IconButtons with translated hover/focus tooltips and matching accessible names; each private page keeps at most one labeled primary action with an icon. Public Home keeps its text controls. Both language switches show EN / ES with full-name tooltips. Design shows the IconButton variants and disabled state. The typeface is Inter, self-hosted (Latin subset).

<img src="public/favicon.svg" alt="Contacompa logo" width="32" height="32"/>

The brand is Contacompa: a stamped-receipt mark in terracotta on neutral grays. The mark and the mark with wordmark are React SVG components (`src/components/brand/`) drawn in `currentColor`, so they follow the theme. `public/` holds the favicon and the SVG sources of the Apple touch icon (180×180) and the link preview image (1200×630); their PNGs are rendered from those sources.

## Project structure

```text
src/
├── app/          # providers, router, i18n, env config, sidebar modules
├── components/   # app layout, brand (logo) and shared UI (button, card, table, select)
├── features/     # one folder per capability: api, hooks, types, pages, components
│   ├── documents/   # purchase docs list, detail, corrections, export
│   ├── jobs/        # upload, job status, retry
│   ├── costs/       # cost report
│   └── session/     # API key sign-in and route guard
└── lib/          # HTTP client, key storage, formatting, theme
```

## Environment variables

Create a `.env.local` file in the repository root:

```dotenv
# Base URL of the Contacompa API
VITE_API_URL=http://localhost:8000
```

It is read at build time, so a change needs a restart of `npm run dev` or a new build. Never commit `.env.local`.

## Getting started

Requires Node 22 (`.nvmrc`) and the API running locally.

```bash
nvm use
npm ci
npm run dev
```

Open `http://localhost:5173` and paste an API key minted by the API.

## Code rules

ESLint enforces at most 300 lines per source or test file (excluding blanks and comments), named meaningful numbers, and UPPER_CASE module constants. Functions, hooks and components keep their usual camelCase or PascalCase names. Numeric exceptions are 0, 1, -1, array indexes, enums and literal `as const` members; any rule suppression needs an inline reason.

Related values are grouped in dictionaries such as `PATHS`, `DOCUMENT_ENDPOINTS`, `DOCUMENT_KEYS` and `STORAGE_KEYS`. Components render and wire events; hooks own orchestration and React Query owns server state. Each module has one responsibility; HOCs and HOFs are added when they remove repetition. Sign-in logic lives in `useSignIn`, which stores a key only after `/v1/me` accepts it.

Messages live in `src/app/i18n/en/` and `es/`, split into common, navigation, home, session, documents, jobs, costs and design. English defines `Messages`; each Spanish area and the composed `ES` dictionary are checked against it, so missing keys fail typecheck.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Deployment

Static build on Cloudflare Pages: build command `npm run build`, output `dist`, and `VITE_API_URL` set at build time. `public/_redirects` sends every path to `index.html` so deep links work. The API must allow the Pages origin in `CORS_ORIGINS`.

## Purchase doc lines and detail views (spec 005, ticket 07)

The detail has Observations, Lines and History tabs, replaced by AppSelect below the 768 px tablet width. Lines uses one horizontally scrollable table with quantity, unit, description and unit prices and line totals with and without IGV; the printed columns are labeled and bold. Derived prices come from the API. Without the IGV flag, derived columns stay empty and separate printed columns retain the original values. Each row has its own pencil, Save and Cancel; saving sends only that line’s changed values, empty saves send nothing, and errors retain the draft. Tabs retain open drafts. The separate prices card and correction form are removed. The file preview stays beside the data on desktop and after it on phones.

Home’s hero and the sign-in card share a static terracotta and amber gradient `Backdrop`, using semantic tokens in light and dark themes (including system preference). Reduced transparency makes the frosted card solid. The Design page demonstrates the backdrop and its tokens.

## Spec 005 final pass

The compact shell and shared controls, read-first document review, static brand backdrop and interactive architecture are implemented. Motion uses transitions of at most 200 ms and stops under reduced motion; controls use the semantic focus ring. Validate all seven pages at 375, 768 and 1280 px in light and dark themes with no horizontal page scroll. Home’s first-visit JavaScript budget is 150 KB gzipped; mobile Lighthouse targets Performance ≥ 90 and Accessibility ≥ 95. These browser checks and the owner-run test suite remain separate from typecheck, lint and build.

Ticket 10 follow-up meets the build budget: the supplied measurement reports 137.2 KB gzip for entry + Home static imports, down from 164.0 KB. Including the active language dictionary and immediately rendered architecture gives 146.2 KB in English or 147.0 KB with stored Spanish, for both phone and desktop widths. Public preferences never load react-select; HTTP and React Query stay outside Home's dependency closure. BrowserRouter renders the same routes without the unused data-router runtime. Startup loads the active messages before rendering, and language changes load their dictionary before resolving; Spanish keys remain checked by TypeScript. Typecheck, lint and build pass. Browser navigation, width/theme checks, Lighthouse and owner-run tests remain unverified; spec 005 is not fully accepted.
