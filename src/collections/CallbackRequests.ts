import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const CallbackRequests: CollectionConfig = {
  slug: 'callback-requests',
  labels: {
    singular: 'طلب تواصل تليفوني',
    plural: 'طلبات التواصل التليفوني',
  },
  admin: {
    group: 'طلبات العملاء',
    useAsTitle: 'phone',
    defaultColumns: ['phone', 'cooperative', 'landArea', 'reviewStatus', 'createdAt'],
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
    {
      name: 'cooperative',
      label: 'الجمعية',
      type: 'select',
      required: true,
      options: ['الطلائع', 'مصر الجديدة', 'أحمد عرابي', 'الأمل', 'القادسية', 'مصر التعاونية', 'اتحاد الوفاق'],
    },
    {
      type: 'row',
      fields: [
        { name: 'landArea', label: 'مساحة الأرض', type: 'text', required: true },
        { name: 'phone', label: 'رقم الهاتف', type: 'text', required: true },
      ],
    },
    { name: 'notes', label: 'ملاحظات', type: 'textarea' },
  ],
  timestamps: true,
}
