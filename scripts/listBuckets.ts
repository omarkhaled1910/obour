import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const { data, error } = await supabase.storage.listBuckets()

if (error) {
  console.error('Error:', error.message)
} else {
  console.log('Your buckets:')
  data?.forEach((bucket) => {
    console.log(`  - ${bucket.name} (public: ${bucket.public})`)
  })
}
