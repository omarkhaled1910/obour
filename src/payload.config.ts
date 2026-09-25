import { mongooseAdapter } from '@payloadcms/db-mongodb'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { CallbackRequests } from './collections/CallbackRequests'
import { ConstructionRequests } from './collections/ConstructionRequests'
import { FundingPartnerRequests } from './collections/FundingPartnerRequests'
import { LicensingRequests } from './collections/LicensingRequests'
import { Members } from './collections/Members'
import { OwnershipRegistrations } from './collections/OwnershipRegistrations'
import { Suggestions } from './collections/Suggestions'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.NEXT_PRIVATE_DATABASE_URL || '',
    transactionOptions: false,
    connectOptions: {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 120000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      ...(process.env.NEXT_PRIVATE_DATABASE_URL?.includes('mongodb+srv') ||
      process.env.NEXT_PRIVATE_DATABASE_URL?.includes('ssl=true')
        ? { tls: true }
        : {}),
    },
  }),
  collections: [
    OwnershipRegistrations,
    LicensingRequests,
    ConstructionRequests,
    FundingPartnerRequests,
    CallbackRequests,
    Members,
    Suggestions,
    Media,
    Users,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  plugins,
  secret: process.env.NEXT_PRIVATE_PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
