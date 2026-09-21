# منصة ملاك مدينة العبور الجديدة

Arabic RTL site for owners of New Obour City, plus a Payload CMS admin for reviewing submissions. Public forms write into MongoDB through Next.js server actions; uploaded files go to Supabase Storage via Payload’s S3 adapter.

## Stack

- Next.js 15 (App Router) + Payload CMS 3
- MongoDB (`@payloadcms/db-mongodb`)
- Supabase Storage (S3-compatible) for `media`
- Tailwind CSS 4, Cairo, `lucide-react`

## Public routes

| Path | Page |
|------|------|
| `/` | Home |
| `/city-story` | About the city |
| `/about` | About the platform |
| `/register` | Ownership legalization wizard |
| `/licensing` | Drawings and licensing wizard |
| `/construction` | Construction request wizard |
| `/funding-partner` | Funding partner wizard |
| `/calculator` | Client-side tanqin calculator (no submit) |
| `/contact`, `/status` | Placeholders |
| `/admin` | Payload admin |

## How submissions work

Each wizard validates on the client, then calls a server action in [`src/actions/submissions.ts`](src/actions/submissions.ts). The action:

1. Re-validates required and conditional fields
2. Uploads files through Payload Local API into `media` (Supabase)
3. Creates a request document in MongoDB

Uploads sanitize filenames before they hit S3 so macOS screenshot names and Arabic filenames do not fail Supabase `InvalidKey`.

Admin staff review requests in `/admin`. Public REST create on those collections is closed; only authenticated users can read or mutate them in the CMS.

## Collections

| Slug | Use |
|------|-----|
| `ownership-registrations` | تقنين الملكية |
| `licensing-requests` | رسومات وتراخيص |
| `construction-requests` | تنفيذ المباني |
| `funding-partner-requests` | الشريك الممول |
| `media` | Attachments |
| `users` | Admin accounts |

## Setup

1. Copy env vars into `.env` (see below).
2. Install and generate Payload artifacts:

```bash
pnpm install
pnpm generate:types
pnpm generate:importmap
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) and [http://localhost:3000/admin](http://localhost:3000/admin). Create the first admin user if the database has none.

If `pnpm generate:*` fails on ignored build scripts, run:

```bash
node --import tsx ./node_modules/payload/bin.js generate:types
node --import tsx ./node_modules/payload/bin.js generate:importmap
```

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PRIVATE_DATABASE_URL` | MongoDB connection string |
| `NEXT_PRIVATE_PAYLOAD_SECRET` | Payload secret |
| `NEXT_PUBLIC_SERVER_URL` | Canonical public origin, without a trailing slash |
| `GOOGLE_SITE_VERIFICATION` | Optional Google Search Console verification token |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL used for public file URLs |
| `NEXT_PRIVATE_SUPABASE_STORAGE_BUCKET_NAME` | Storage bucket |
| `NEXT_PRIVATE_S3_ENDPOINT` | `https://<ref>.storage.supabase.co/storage/v1/s3` |
| `NEXT_PRIVATE_S3_ACCESS_KEY_ID` | Supabase S3 access key |
| `NEXT_PRIVATE_S3_SECRET_ACCESS_KEY` | Supabase S3 secret |
| `NEXT_PRIVATE_S3_REGION` | Usually `eu-west-1` or the region shown in the dashboard |

S3 keys come from **Supabase Dashboard → Storage → S3 connection**, not the anon/service JWT.

## SEO

The App Router generates canonical metadata, Arabic Open Graph/Twitter tags, JSON-LD organization and service data, a social sharing image, `/robots.txt`, and `/sitemap.xml`.

Before deploying, set `NEXT_PUBLIC_SERVER_URL` to the final HTTPS domain. After deployment, submit `/sitemap.xml` in Google Search Console and optionally add its verification token to `GOOGLE_SITE_VERIFICATION`.

## Scripts

```bash
pnpm dev          # development
pnpm build        # production build
pnpm start        # serve production build
pnpm lint
pnpm test:int     # vitest
pnpm generate:types
pnpm generate:importmap
```

## Layout

```
src/
  actions/          Server actions for forms and uploads
  app/(frontend)/   Public Arabic site
  app/(payload)/    Admin + REST/GraphQL
  collections/      Payload schemas
  components/       Shared UI (sidebar, placeholders)
  lib/              Governorates, calculator helpers
```
