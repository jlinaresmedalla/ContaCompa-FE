# Contacompa dashboard

React dashboard where an accountant uploads Peruvian purchase documents, reviews what the model extracted, corrects it, and exports it to Excel.

<!-- demo GIF placeholder: assets/demo.gif, record it after the first live run -->

## Overview

The dashboard is the accountant's side of Contacompa. They sign in with a company API key, upload PDFs or photos, follow the extraction jobs, and review the purchase records the model produced: only flagged records need attention, the original file can be shown beside the data with the eye toggle, and header values appear in one invoice card with a single edit mode. A costs page shows what the model spends. Jobs shows five status counts in one row, the dropzone as its only upload control, the current processing file and one recent-file list with status/search/observation filters, sorting and retry. The overview API supplies duration and attempts; supplier, amounts, tokens and percentage progress are unavailable. English by default, Spanish written natively for a Peruvian accountant, light and dark themes.

Purchase docs shows one row of global observation stats, a toolbar with observation filters, search by number/supplier/RUC on the loaded page, and Excel export, followed by a table and right-aligned pagination. Every column is headed, amounts align right, and the number column stays pinned while the table scrolls inside its own frame on phones. No records offers upload; filters or search with no matches offer Clear filters. The observation report card is removed; existing observation-code URLs still filter records. Expand Items, Open and Delete share one Actions column, and observations use one count/status chip. Search covers the current page; export keeps its existing scope.

Costs keeps the 7-, 30- and 90-day select beside the title, four stats in one row (scrolling on phones), and a daily chart card and a framed model table with its label and record count above it. They sit side by side when their container can fit the model table, and stack otherwise. Every model column remains available, with scrolling inside the table frame and Model pinned when needed. All costs use four decimal places and purchase doc counts use native plurals. Compact stat subtext puts billed amounts on a separate line; phone cards grow to fit two lines inside the scrolling row. Numeric model columns reserve 7 rem each, headers wrap at spaces, and the chart/table stack below a 100 rem page container. The chart has no empty-day stubs or repeated period; an info tooltip beside List price explains billed versus list cost. Initial loads keep skeletons, refetches retain data, and no costs offers upload.

The live URL opens on a public Home page that explains Contacompa without a key: how it works in four steps, the architecture diagram and stack, and links to both repositories. The top-bar button alone reads "Go to app →" ("Ir a la app →" in Spanish), opening Purchase docs with a stored key or sign-in without one; it makes no request to the API. Unknown paths lead to Home without a key and to Purchase docs with one.

<!-- Screenshots pending Juan: Home and Sign-in at 375, 768 and 1280 px in light/dark themes after the next deploy (spec 006 ticket 13). -->
<!-- Screenshots: after Juan confirms the approved boards, capture Home, Sign-in, Jobs, Costs, purchase doc view/edit, Items, History, account menu and Design at desktop and phone widths. Visual acceptance and npm test remain owner checks. -->

Purchase document headers appear in one invoice card with stable auto-fit read-only columns (12 rem minimum). Editing keeps three desktop columns with the preview shown, four with it hidden, and a two-column Supplier field. The eye button has a translated label and pressed state. Preview is hidden by default; the last choice is stored under `contacompa.documents.preview-visible`, with guarded reads/writes for private mode. Its component and file request start only when shown, retaining the lazy and request skeletons. From 768 px data and sticky preview use a 3:2 layout; Items remains below the invoice and History starts collapsed. The header pencil edits every field together, with per-field undo, change/error counts and schema validation. Save sends only changed values; Cancel discards the draft and failures retain it. Navigation and tab close warn about unsaved changes; sign-out clears the session and leaves immediately. Below 768 px the fields become label/value rows; editing uses touch-size controls and a fixed bottom bar with change/error counts, the eye, Cancel and Save. The header eye and bar eye open the lazy preview sheet only on tap; phones ignore stored visibility on load. Photos pinch to zoom (1–4×) inside their scrolling viewport; PDF zoom uses the native viewer. Closing the sheet preserves drafts.

The private sidebar is a drawer below 1024 px, a forced icon rail at 1024–1279 px, and follows the remembered expansion from 1280 px. The forced rail preserves that choice. Module pages are nested when expanded and open in a menu from the rail, with the current page marked; there are no page tabs. The company initials avatar opens company details, key time left, language, theme and sign-out. Language and theme choices use menu radio items reachable with arrow keys, with full language names for accessibility; menu items show a semantic focus ring. Below 1024 px navigation uses a drawer that closes on navigation, Escape or outside tap and restores focus to its menu button.

The public Design page (`/design`) groups its live gallery into atoms, molecules, organisms and templates. Each level and the token gallery loads independently through `lazyPage` with a skeleton. It shows the real shared controls, their disabled/error/loading/empty states, shell previews, preferences and account menus, plus feature-owned invoice field states, Yes/No icons, action bars and list/status patterns. These patterns stay in their owning features. Size tokens (controls, rows, cards, shell, radii and focus) join the colors, typography, spacing, shadows and motion read live from CSS. Gallery interactions use local state and make no API requests.

All seven route pages load on demand in separate JavaScript chunks. Page skeletons render inside the layout, so the public top bar and private sidebar stay visible during navigation. The purchase document file preview loads separately with its own skeleton. Shared `lazyPage` and `withSuspense` helpers keep these boundaries consistent. The session query provider, API runtime and toaster load only on sign-in and private routes; Design mounts its own toaster. The private guard and session-owned PrivateLayout wrapper also load separately. The wrapper supplies company, initials, time left and sign-out to the shared AppLayout and AccountMenu through props.

The API and worker live in [Contacompa-backend](https://github.com/jlinaresmedalla/ContaCompa).

## Architecture

Home renders a lazy interactive React SVG with all components, hosting boundaries and connections. Flow chips highlight Sign-in and keys, Upload path, Extraction job and Pure core; Overview restores everything. Nodes reveal their roles on hover, focus and tap, with a full text alternative in English and Spanish. Phones show the complete text version; wider screens show a fluid diagram using the card surface, with an optional text view. Tech chips and the text toggle stay inside the card. Public header, content and footer share a centered 160 rem cap and fluid padding; top-bar actions remain available at every width.

`src/features/home/utils/architectureData.ts` is the typed copy of the backend’s `docs/architecture/architecture.archify.json` (coordinates, components, connections, views and cards). Any backend diagram change must update this frontend copy and its translated explanations.

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

The design system is built on shadcn/ui (Radix primitives for keyboard and ARIA behavior, lucide-react icons), restyled with two token layers, primitive scales and semantic names, in `src/index.css`. Shared controls use shadcn primitives, except the typed `AppSelect` built on react-select (ADR 0027). AppSelect loads on demand with a control-sized skeleton, supports single and multi choice, search, form validation, and portalled menus in both themes. Segmented rows become AppSelect below a 480 px container width; public preferences lazily render a globe and the current theme icon at every width, each opening a small radio menu; below 768 px these have touch-sized targets. Costs offers 7-, 30- and 90-day report periods. Secondary dashboard actions use shared lucide IconButtons with translated hover/focus tooltips and matching accessible names; each private page keeps at most one labeled primary action with an icon. Public Home keeps its text controls. Language menus show both codes and native language names. The account menu uses the same two icon preference menus without visible mode labels. Design shows the IconButton variants and disabled state. The typeface is Inter, self-hosted (Latin subset).

<img src="public/favicon.svg" alt="Contacompa logo" width="32" height="32"/>

The brand is Contacompa: a stamped-receipt mark in terracotta on neutral grays. The mark and the mark with wordmark are React SVG components (`src/components/atoms/LogoMark.tsx` and `src/components/molecules/Logo.tsx`) drawn in `currentColor`, so they follow the theme. `public/` holds the favicon and the SVG sources of the Apple touch icon (180×180) and the link preview image (1200×630); their PNGs are rendered from those sources.

Shared controls use semantic rem sizes on a 14 px root: standard controls are 2.625 rem, compact controls 2.25 rem, and standard controls grow to 3.25 rem below 768 px. Cards use 1.375 rem padding and a 0.875 rem radius without shadows. Table loading and populated rows share the 3.75 rem row height. Dense avatars and row icon actions are available through `Avatar dense` and `IconButton size="row"`. Text starts at 0.875 rem; focus uses a 0.125 rem accent outline and offset. The Design gallery lists these size tokens with their live CSS values.

## Project structure

```text
src/
├── app/          # providers, Data Mode router, i18n, env config, sidebar modules
├── components/   # downward imports; one public barrel per level
│   ├── atoms/        # standalone controls and marks
│   ├── molecules/    # fields, selects, stats, icon actions, loading feedback
│   ├── organisms/    # table, sidebar, preferences, account menu, bottom sheet
│   └── templates/    # public/private shells; account data comes through props
├── features/     # one folder per capability; populated kind folders below
│   ├── documents/   # purchase docs list, detail, corrections, export
│   ├── jobs/        # upload, stat cards, recent-file list, filters, retry
│   ├── costs/       # cost report
│   ├── home/        # public Home and lazy architecture
│   ├── design/      # tokens and four lazy component-level galleries
│   └── session/     # API key sign-in, route guard, account data and private-shell wrapper
└── lib/          # HTTP client, key storage, formatting, theme
```

Features use `api/`, `hooks/`, `components/`, `schemas/`, `types/` and `utils/` as needed, with one file per resource or concern and no empty folders. API modules use `<resource>Api.ts`; hooks use `useCamelCase.ts`. Pages, page tests and the feature `index.ts` stay at the feature root.

A component with companions uses a PascalCase folder containing `ComponentName.tsx`, its tests, exclusive hooks, `types.ts` when needed, and a public `index.ts`. Components without companions stay flat. Shared feature hooks and page-owned hooks go in `hooks/`; shared component hooks stay at their atomic level. Home diagram data and layout and Design token names live in their feature’s `utils/`. Lazy pages and Design galleries retain separate chunks. The file-name lint rule remains a warning.

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

The invoice card includes its observations strip (or No observations). Items stays visible below it; History is collapsible and initially closed, preserving line drafts. The table retains every column, with its first column pinned and scrolling inside its own frame. Printed and derived unit prices use four decimals; totals use two. Desktop rows edit in place; below 768 px the pencil opens a bottom sheet. Saves send only changed values and errors retain drafts. From 768 px the shown preview is sticky beside both invoice and Items in a 3:2 grid; phones ignore the stored choice on load and open the sheet only on request. The inline back arrow, title and actions share one header; Delete lives in a more-actions menu with a confirmation dialog. Cancel keeps the record.

Home uses a 3.375 rem desktop marketing title (2.25 rem on phones), desktop step cards and phone step rows. Sign-in uses a 30 rem card, a 1.75 rem title and a reveal-key button; errors and checking status are linked to and shown beside the key input. The lazy architecture includes the board’s four-node summary plus the interactive view. Visual acceptance and the owner-run tests remain pending.

Home’s hero and the sign-in card share a static terracotta and amber gradient `Backdrop`, using semantic tokens in light and dark themes (including system preference). Reduced transparency makes the frosted card solid. The Design page demonstrates the backdrop and its tokens.

## Spec 005 final pass

The compact shell and shared controls, read-first document review, static brand backdrop and interactive architecture are implemented. Motion uses transitions of at most 200 ms and stops under reduced motion; controls use the semantic focus ring. Validate all seven pages at 375, 768 and 1280 px in light and dark themes with no horizontal page scroll. Home’s first-visit JavaScript budget is 150 KB gzipped; mobile Lighthouse targets Performance ≥ 90 and Accessibility ≥ 95. These browser checks and the owner-run test suite remain separate from typecheck, lint and build.

Ticket 10 follow-up meets the build budget: the supplied measurement reports 137.2 KB gzip for entry + Home static imports, down from 164.0 KB. Including the active language dictionary and immediately rendered architecture gives 146.2 KB in English or 147.0 KB with stored Spanish, for both phone and desktop widths. Public preferences never load react-select; HTTP and React Query stay outside Home's dependency closure. BrowserRouter renders the same routes without the unused data-router runtime. Startup loads the active messages before rendering, and language changes load their dictionary before resolving; Spanish keys remain checked by TypeScript. Typecheck, lint and build pass. Browser navigation, width/theme checks, Lighthouse and owner-run tests remain unverified; spec 005 is not fully accepted.

Routing uses React Router Data Mode: `createBrowserRouter` over the existing route objects and `RouterProvider` in `AppProviders`. Pages retain lazy skeleton boundaries inside layout outlets; the session runtime loads only for sign-in and private routes. TanStack Query owns server data; routes have no loaders or actions (spec 006, ADR 0029). Spec 006 does not measure bundle size; the spec 005 figures above describe the earlier implementation.

## Responsive foundations (spec 007, ticket 01)

Private content fills the available width up to 160 rem, centered beyond it, with side padding scaling from 1 to 3.5 rem. Enabled controls show a pointer. Cards and table wrappers expose named containers for container queries; DataTable retains all columns, an 8 rem minimum width per column, sticky first column and wrapping only between words.

The shared molecule barrel exports StatRow (equal shares in a single row, scrolling on phones) and FilterPills (controlled, scrolling loose pills at standard control height). Design demonstrates both at wide and narrow widths and lists the new size tokens. Purchase docs, Jobs and Costs use StatRow; Purchase docs and Jobs use FilterPills. Shared money helpers use two decimals, up to four when needed, for printed/derived unit prices, four for costs and two for totals; currency and number stay joined by a non-breaking space. Items reserves 9 rem per price column and gives Description the remaining width; English/Spanish document counts have singular and plural keys. Browser appearance and owner-run tests remain pending.

## Responsive patterns (spec 007, ticket 06)

Public header, content and footer share the centered 160 rem cap and fluid padding. The sidebar is a drawer below 1024 px, forced rail at 1024–1279 px and follows the saved expansion from 1280 px. Jobs uploads only through its dropzone; Purchase docs uses the Observations filter without a separate report card. Costs explains list price in an info tooltip. Home keeps Go to app in the top bar and presents architecture as text on phones.

Design uses local samples without API calls: equal stat rows, fitting/scrolling filter pills, populated/loading/empty pinned tables, enabled/disabled more-actions controls and their confirmation dialog, language/theme menus, clean/warning observation strips and hidden/loading preview compositions, at wide and narrow container widths. The preview is a placeholder rather than a fetched file; narrow samples stack. Approved boards remain design references; screenshots and browser acceptance at 375, 768, 1024, 1280, 1568 and 2560 px in both themes require Juan’s review.

Tables own one hairline border and the card radius, with no card wrapper or outer padding. Items and Costs by model have small labels with record counts above their frames; the Items explanation is an accessible info tooltip on the right. History remains collapsible and Jobs uses the same framed style for its list. Design demonstrates tables without gallery card wrappers. StatRow and FilterPills fade only the edges with hidden content, updating as the row scrolls or resizes.
