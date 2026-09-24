import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'

export const Members: CollectionConfig = {
  slug: 'members',
  labels: {
    singular: 'عضو',
    plural: 'الأعضاء',
  },
  admin: {
    group: 'طلبات العملاء',
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'username', 'governorate', 'createdAt'],
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: false,
      requireEmail: false,
      requireUsername: true,
    },
  },
  access: {
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'fullName', label: 'الاسم بالكامل', type: 'text', required: true },
    { name: 'age', label: 'السن', type: 'number' },
    { name: 'job', label: 'الوظيفة', type: 'text' },
    { name: 'governorate', label: 'المحافظة', type: 'text' },
  ],
  timestamps: true,
}
