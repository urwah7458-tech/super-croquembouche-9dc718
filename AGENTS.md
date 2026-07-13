# AGENTS.md

Architecture notes and conventions for this codebase, aimed at future agents (human or AI) working
on the Asma and Safi Skin and Dental Clinic site.

## Architecture

- **Frontend** (`src/`): Vite + React + TypeScript + Tailwind. Routing via `react-router-dom` in
  `src/App.tsx`. Public pages are wrapped in `PublicLayout` (Navbar + Footer); `/admin` is
  rendered standalone, outside that layout.
- **API client** (`src/lib/api.ts`): all `fetch` calls to Netlify Functions live here. Pages should
  not call `fetch` directly — add a function to `api.ts` instead.
- **Backend** (`netlify/functions/*.mts`): one file per endpoint, using the `export default` handler
  + `export const config` pattern with a friendly `path` (e.g. `/api/content`, `/api/book`).
- **Database** (`db/schema.ts`, `db/index.ts`): Drizzle ORM schema and client, using the
  `drizzle-orm/netlify-db` adapter (`@netlify/database` under the hood). Migrations are generated
  with `npx drizzle-kit generate` into `netlify/database/migrations/` and applied automatically by
  Netlify on deploy — never run `drizzle-kit migrate`/`push` or apply migrations by hand.

## Key directories

```
db/                          Drizzle schema + client
netlify/functions/           Netlify Functions (TypeScript, .mts)
netlify/database/migrations/ Generated SQL migrations (+ hand-added seed INSERTs)
src/pages/                   Route-level React components
src/components/              Shared UI (Navbar, Footer, DoctorCard)
src/lib/                     API client + shared hooks
```

## Data model

- `time_slots(id, date, time, service, is_booked, created_at)` — admin-published bookable slots.
- `appointments(id, slot_id -> time_slots.id, customer_name, contact, service, notes, created_at)`
  — customer bookings against a slot.
- `doctors(id, name, specialty, bio, photo_url, service, sort_order)` — team profiles, editable via
  admin, rendered on Home and the relevant service page.
- `page_content(id, page_key unique, title, description, services_json, updated_at)` — editable
  copy for `/skin` and `/dental`. `services_json` is a JSON-encoded array of `{ name, description }`.

Default doctors, page content, and a handful of sample time slots are seeded via hand-appended
`INSERT` statements at the bottom of the first migration file
(`netlify/database/migrations/20260712130136_needy_blackheart/migration.sql`), so the site isn't
empty on first load. Any future schema change must ship as a new migration (via
`drizzle-kit generate`), never by editing an already-applied migration.

## Booking / double-booking prevention

`netlify/functions/book.mts` does not use the Drizzle client for the write path. It opens a raw
`pg` transaction via `@netlify/database`'s `getDatabase().pool` and does a conditional
`UPDATE time_slots SET is_booked = true WHERE id = $1 AND is_booked = false RETURNING *`. If the
row count is 0 (already booked by a concurrent request), the transaction rolls back and the client
gets a 409. Only on a successful conditional update does it insert the `appointments` row and
commit. This is the mechanism that prevents double-booking under concurrent requests.

## Hidden `/admin` route and password

- `/admin` is a real route in `src/App.tsx`, but it is **never linked** from `Navbar`, `Footer`, or
  any public page/component. It's reachable only if you know the URL.
- The password (`urwah67`) lives only in `netlify/functions/_admin-auth.mts`, a server-side module
  imported by the admin functions — it is never sent to or embedded in the client bundle.
- `netlify/functions/admin-login.mts` accepts `{ password }` and, on match, returns a fixed
  `ADMIN_TOKEN` string (also defined in `_admin-auth.mts`).
- The browser stores that token in `sessionStorage` (`src/lib/api.ts`, `setAdminToken`/`getAdminToken`)
  and sends it as the `x-admin-token` header on every subsequent admin request.
- Every admin-only function (`admin-appointments.mts`, `admin-create-slot.mts`,
  `admin-update-content.mts`) calls `isAuthorized(req)` from `_admin-auth.mts`, which just compares
  the header against the constant token, before doing anything. There is no per-user session store
  or expiry — this is a deliberately simple shared-secret scheme, appropriate for a small clinic
  app, not a multi-admin or high-security system.
- If you ever need to rotate the password or token, edit the constants in
  `netlify/functions/_admin-auth.mts` — nothing else references the raw password.

## Conventions

- Netlify Functions use `.mts` extension, `export default` handler, `export const config: Config`.
- Import paths between functions/db files use explicit `.ts`/`.mts` extensions (ESM requirement).
- Drizzle column names are snake_case strings; TS field names are camelCase.
- All public-facing content (doctor bios, page copy) is fetched from the database via
  `src/lib/useClinicContent.ts` / `src/lib/api.ts` — never hardcode clinic copy directly into a
  page component. Fallback strings shown during loading are just loading-state UI, not the source
  of truth.
