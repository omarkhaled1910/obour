import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Suggestions: CollectionConfig = {
  slug: 'suggestions',
  labels: {
    singular: 'اقتراح',
    plural: 'الاقتراحات',
  },
  admin: {
    group: 'طلبات العملاء',
    useAsTitle: 'message',
    defaultColumns: ['message', 'name', 'contact', 'reviewStatus', 'createdAt'],
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'reviewStatus',
      label: 'حالة المراجعة',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'جديد', value: 'new' },
        { label: 'قيد المراجعة', value: 'in-review' },
        { label: 'تم التواصل', value: 'contacted' },
        { label: 'مغلق', value: 'closed' },
      ],
    },
    { name: 'message', label: 'الاقتراح', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'الاسم', type: 'text' },
        { name: 'contact', label: 'وسيلة التواصل', type: 'text' },
      ],
    },
  ],
  timestamps: true,
}
