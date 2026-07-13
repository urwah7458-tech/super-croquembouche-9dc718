# Asma and Safi Skin and Dental Clinic

A marketing site and lightweight booking system for a two-specialty clinic (dermatology +
dentistry), with a hidden admin panel for managing content, publishing appointment slots, and
viewing bookings.

## Tech stack

- **Frontend:** Vite + React + TypeScript + Tailwind CSS, client-side routing via `react-router-dom`
- **Backend:** Netlify Functions (TypeScript, `netlify/functions/*.mts`)
- **Database:** Netlify Database (managed Postgres) via Drizzle ORM (`drizzle-orm@beta`, `drizzle-kit@beta`)

## Pages

- `/` — Home: hero, intro, skin/dental service overview, team section, footer
- `/skin` — Skin treatments and services (content pulled from the database)
- `/dental` — Dental treatments and services (content pulled from the database)
- `/booking` — Pick an open time slot and book an appointment
- `/admin` — Hidden admin panel (password gated, not linked anywhere in the public UI)

## Data model

- `time_slots` — bookable date/time slots per service (`skin` | `dental`), with an `is_booked` flag
- `appointments` — a customer booking tied to a specific slot (name, contact, service, notes)
- `doctors` — team member profiles (name, specialty, bio, photo URL, which service they belong to)
- `page_content` — editable copy for the Skin and Dental pages (title, description, services JSON)

## Running locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the site with the Netlify CLI so functions and the database work locally:

   ```bash
   netlify dev
   ```

   This serves the Vite frontend and Netlify Functions together, and connects to your linked
   Netlify Database branch automatically.

3. Database schema changes live in `db/schema.ts`. After changing it, generate a migration:

   ```bash
   npx drizzle-kit generate
   ```

   Migrations are applied automatically by Netlify on deploy — never run `drizzle-kit migrate`
   or `drizzle-kit push` yourself.

## Admin panel

Visit `/admin` directly (it is not linked from any page). Enter the clinic password to sign in.
See `AGENTS.md` for details on the auth scheme.
