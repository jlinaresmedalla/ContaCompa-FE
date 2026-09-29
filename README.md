# Contacompa dashboard

React dashboard for the separate `Contacompa-backend` API repository. A fixed sidebar lists the modules (a static list in `src/app/modules.tsx`, the same for every company; language and theme switches sit at its bottom, and below `md` it collapses to icons). Extraction operations holds the purchase docs list and detail (observations, the original file, corrections, 50-record pages, Excel export) and a Jobs tab (upload, job status, retry); Monitor holds Costs (billed and list-price usage); Assistant is in the list but hidden. Every page except `/sign-in` needs a company API key (see Sign-in); the sidebar bottom shows the company, the time left on the key and sign-out.

## Local setup

Start PostgreSQL, the API, and worker in `../Contacompa-backend` first. Then:

```bash
nvm use
npm ci
# Create .env.local with VITE_API_URL=http://localhost:8000
npm run dev
```

Open `http://localhost:5173`; it asks for an API key (see Sign-in).

## Sign-in

There are no usernames or passwords (backend ADR 0015). The owner mints a 12-hour API key for a company with the admin key, `POST /v1/api-keys` (Swagger at `<API>/docs`, or the `curl` in the backend `docs/quickstart.md`), and hands it to the accountant, who pastes it on `/sign-in`.

- The page checks the key with `GET /v1/me` before storing it. An invalid or expired key shows an error and stores nothing.
- The key lives in this browser's localStorage (`doc-extraction.api-key`), so it survives reloads and is readable by any script on the page. On reload a loading state shows while `/v1/me` re-checks it.
- Opening any page without a valid key goes to `/sign-in?next=<path>`; after sign-in the dashboard returns to `next` only if it is a path inside the dashboard, otherwise to Purchase docs.
- Any 401 (for example the key expired) clears the key and every cached query and returns to sign-in with the current path as `next`. A 403 shows the error and keeps the session.
- Sign-out in the sidebar does the same clearing. The time left shown there is display only; the next request after expiry gets the 401.

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

## Routes

| Path                            | Page                                                     |
| ------------------------------- | -------------------------------------------------------- |
| `/sign-in`                      | Sign-in with the API key (the only public page)          |
| `/extraction/purchase-docs`     | Extraction operations: purchase docs list (landing page) |
| `/extraction/purchase-docs/:id` | Extraction operations: purchase doc detail               |
| `/extraction/jobs`              | Extraction operations: Jobs tab                          |
| `/monitor/costs`                | Monitor: Costs                                           |

`/`, `/extraction`, `/monitor` and unknown paths redirect to a landing page (`/extraction`: purchase docs, `/monitor`: Costs, everything else: purchase docs).

## Deployment

**Live:** `<pages-url>` on Cloudflare Pages (free plan), talking to the API at `<render-url>` (Render Free; the first request after idle is slow because the service sleeps). It needs a 12-hour API key minted by the owner; there is no demo mode.

![Demo: sign in, upload, extraction, corrections](assets/demo.gif) <!-- demo GIF placeholder: record it after the first live run -->

```text
Browser ──► Cloudflare Pages (static build of this repo) ──HTTPS + X-API-Key──► Render API + worker ──► Neon Postgres + Object Storage
```

Pages settings: build command `npm run build`, output directory `dist`, Node from `.nvmrc`, and the environment variable `VITE_API_URL=<render-url>`. It is read at build time (`src/app/config/env.ts`), so changing it needs a new build. `public/_redirects` (`/* /index.html 200`) is copied to `dist` so deep links such as `/extraction/purchase-docs/<id>` load the app instead of a 404. The API must list the Pages origin in its `CORS_ORIGINS` (a JSON list, for example `["<pages-url>"]`); see the backend repository's deployment notes.

The app groups API calls, query keys, hooks, and page components under `src/features/{documents,jobs,costs,session}` (`documents` and `jobs` belong to Extraction operations, `costs` to Monitor, `session` owns the stored key, `/v1/me`, sign-in, the private-route guard and the sidebar session panel). The `/v1/monitor` endpoint keeps its name; the `jobs` feature reads it. Shared UI lives in `src/components`; HTTP and formatting helpers live in `src/lib`.
