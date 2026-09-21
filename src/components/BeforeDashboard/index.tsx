import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Blank project</h4>
      </Banner>
      <p>
        Users, media, MongoDB, and Supabase storage are ready. Add collections in{' '}
        <code>src/payload.config.ts</code> when the new idea is defined.
      </p>
    </div>
  )
}

export default BeforeDashboard
