import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import React from 'react'

import { Sidebar } from '@/components/Sidebar'
import { getServerSideURL } from '@/utilities/getURL'
import {
  getOrganizationJsonLd,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
} from '@/utilities/seo'

import './globals.css'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = getOrganizationJsonLd()

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <Sidebar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
          نسخة أولى تجريبية (MVP) — منصة ملاك مدينة العبور الجديدة
        </footer>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'real estate',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      }
    : undefined,
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
}
