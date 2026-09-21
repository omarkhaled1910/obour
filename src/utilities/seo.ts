import type { Metadata } from 'next'

import { getServerSideURL } from './getURL'

export const SITE_NAME = 'منصة ملاك مدينة العبور الجديدة'
export const SITE_DESCRIPTION =
  'منصة لخدمة ملاك أراضي مدينة العبور الجديدة في تقنين الملكية، الرسومات الهندسية، تراخيص البناء، تنفيذ المباني، وحساب مستحقات التقنين.'

export const SITE_KEYWORDS = [
  'مدينة العبور الجديدة',
  'العبور الجديدة',
  'تقنين أراضي العبور الجديدة',
  'ملاك مدينة العبور الجديدة',
  'جهاز مدينة العبور الجديدة',
  'تراخيص البناء',
  'رسومات هندسية',
  'تنفيذ مباني',
  'حساب التقنين',
]

type PageMetadataInput = {
  title: string
  description: string
  path: `/${string}` | '/'
  keywords?: string[]
  noIndex?: boolean
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    keywords: [...SITE_KEYWORDS, ...keywords],
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      locale: 'ar_EG',
      url: path,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          noarchive: true,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  }
}

export function getOrganizationJsonLd() {
  const url = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${url}/#organization`,
        name: SITE_NAME,
        url,
        description: SITE_DESCRIPTION,
        areaServed: {
          '@type': 'City',
          name: 'مدينة العبور الجديدة',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: 'ar-EG',
        publisher: {
          '@id': `${url}/#organization`,
        },
      },
    ],
  }
}
