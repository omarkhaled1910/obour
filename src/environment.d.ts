declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PRIVATE_PAYLOAD_SECRET: string
      NEXT_PRIVATE_DATABASE_URL: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL?: string
      CRON_SECRET?: string
      NEXT_PUBLIC_SUPABASE_URL?: string
      NEXT_PRIVATE_SUPABASE_STORAGE_BUCKET_NAME?: string
      NEXT_PRIVATE_S3_ENDPOINT?: string
      NEXT_PRIVATE_S3_ACCESS_KEY_ID?: string
      NEXT_PRIVATE_S3_SECRET_ACCESS_KEY?: string
      NEXT_PRIVATE_S3_REGION?: string
    }
  }
}

export {}
