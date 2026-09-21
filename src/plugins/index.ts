import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'

export const plugins: Plugin[] = [
  s3Storage({
    enabled: Boolean(process.env.NEXT_PRIVATE_SUPABASE_STORAGE_BUCKET_NAME),
    bucket: process.env.NEXT_PRIVATE_SUPABASE_STORAGE_BUCKET_NAME || '',
    collections: {
      media: {
        disablePayloadAccessControl: true,
        generateFileURL: ({ filename, prefix }) => {
          const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
          const bucket = process.env.NEXT_PRIVATE_SUPABASE_STORAGE_BUCKET_NAME
          const key = prefix ? `${prefix}/${filename}` : filename
          return `${base}/storage/v1/object/public/${bucket}/${key}`
        },
      },
    },
    config: {
      credentials: {
        accessKeyId: process.env.NEXT_PRIVATE_S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.NEXT_PRIVATE_S3_SECRET_ACCESS_KEY || '',
      },
      region: process.env.NEXT_PRIVATE_S3_REGION || 'us-east-1',
      endpoint: process.env.NEXT_PRIVATE_S3_ENDPOINT,
      forcePathStyle: true,
    },
  }),
]
