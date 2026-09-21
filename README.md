# o-j-payload

Blank Payload CMS starter with MongoDB and Supabase Storage (S3).

## Stack

- Next.js 15 + Payload 3
- MongoDB via `@payloadcms/db-mongodb`
- Media uploads via `@payloadcms/storage-s3` (Supabase)

Collections: `users`, `media`.

## Setup

Copy `.env` values for MongoDB, Payload secret, and Supabase S3 credentials. Then:

```bash
pnpm install
pnpm generate:types
pnpm generate:importmap
pnpm dev
```

Admin: `/admin`
