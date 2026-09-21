import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY!
const bucketName = process.env.NEXT_PRIVATE_SUPABASE_STORAGE_BUCKET_NAME || 'media'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createBucket() {
  // Check if bucket already exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    console.error('Error listing buckets:', listError.message)
    process.exit(1)
  }

  const existingBucket = buckets?.find((b) => b.name === bucketName)

  if (existingBucket) {
    console.log(`✓ Bucket "${bucketName}" already exists`)
    if (!existingBucket.public) {
      console.log('  Making bucket public...')
      const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
        public: true,
      })
      if (updateError) {
        console.error('  Error making bucket public:', updateError.message)
      } else {
        console.log('  ✓ Bucket is now public')
      }
    }
    return
  }

  // Create the bucket
  const { data, error } = await supabase.storage.createBucket(bucketName, {
    public: true,
    allowedMimeTypes: ['image/*', 'video/*', 'application/pdf'],
    fileSizeLimit: 10485760, // 10MB
  })

  if (error) {
    console.error('❌ Error creating bucket:', error.message)
    process.exit(1)
  }

  console.log(`✓ Created bucket "${bucketName}" successfully`)
  console.log(`  Public: Yes`)
  console.log(`  URL: ${supabaseUrl}/storage/v1/object/public/${bucketName}/`)
}

createBucket()
