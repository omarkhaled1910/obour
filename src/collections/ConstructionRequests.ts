import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const ConstructionRequests: CollectionConfig = {
  slug: 'construction-requests',
  labels: {
    singular: 'طلب تنفيذ مبانٍ',
    plural: 'طلبات تنفيذ المباني',
  },
  admin: {
    group: 'طلبات العملاء',
    useAsTitle: 'contactName',
    defaultColumns: ['contactName', 'contactPhone', 'reviewStatus', 'createdAt'],
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
    { name: 'workDescription', label: 'وصف الإنشاءات المطلوبة', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'contactName', label: 'الاسم بالكامل', type: 'text', required: true },
        { name: 'contactPhone', label: 'رقم الهاتف', type: 'text', required: true },
        { name: 'contactEmail', label: 'البريد الإلكتروني', type: 'email' },
      ],
    },
    {
      name: 'allocationNotices',
      label: 'إخطارات التخصيص',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'receiptMinutes',
      label: 'محاضر استلام الأرض',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'licenseDocuments',
      label: 'صور الترخيص',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
  ],
  timestamps: true,
}
