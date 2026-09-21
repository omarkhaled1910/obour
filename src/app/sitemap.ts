import type { MetadataRoute } from 'next'

import { getServerSideURL } from '@/utilities/getURL'

const routes = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/register', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/licensing', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/construction', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/funding-partner', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/calculator', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/city-story', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const url = getServerSideURL()
  const lastModified = new Date()

  return routes.map((route) => ({
    url: `${url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
