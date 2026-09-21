import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY!
const bucketName = 'news_24'

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixPolicies() {
  console.log('Checking bucket policies...\n')

  // Get all policies for objects in the bucket
  const { data: policies, error } = await supabase
    .from('storage.policies')
    .select('*')
    .eq('bucket_id', bucketName)

  if (error) {
    console.error('Error fetching policies:', error.message)
    console.log('\n⚠️ You may need to set up policies manually in Supabase Dashboard:')
    console.log(`   Go to: Storage > news_24 > Policies > Create a new policy`)
    console.log('\nFor PUBLIC access (allow anyone to view files):')
    console.log('   Policy name: "Public Access"')
    console.log('   Allowed operation: SELECT')
    console.log('   Target roles: authenticated, anon')
    console.log('   USING expression: (true)')
    return
  }

  console.log(`Current policies for "${bucketName}":`)
  if (policies && policies.length > 0) {
    policies.forEach((p) => {
      console.log(`  - ${p.name} (${p.operation}): ${p.definition?.using || 'no expression'}`)
    })
  } else {
    console.log('  No policies found!')
  }

  // Check bucket info
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucket = buckets?.find((b) => b.name === bucketName)
  console.log(`\nBucket info:`)
  console.log(`  Name: ${bucket?.name}`)
  console.log(`  Public: ${bucket?.public}`)

  console.log('\n⚠️ If you still get "Bucket not found", go to Supabase Dashboard:')
  console.log(`   https://supabase.com/dashboard > Storage > ${bucketName} > Policies`)
  console.log('\nAdd these policies:')
  console.log('\n1. Public Read Policy (for viewing images):')
  console.log('   - Name: "Public Read"')
  console.log('   - Allowed operation: SELECT')
  console.log('   - Allowed roles: anon, authenticated')
  console.log('   - USING: true')
  console.log('\n2. Authenticated Upload Policy (for uploading):')
  console.log('   - Name: "Authenticated Upload"')
  console.log('   - Allowed operation: INSERT')
  console.log('   - Allowed roles: authenticated')
  console.log('   - WITH CHECK: true')
}

fixPolicies()
