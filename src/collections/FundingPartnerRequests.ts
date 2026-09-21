import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const FundingPartnerRequests: CollectionConfig = {
  slug: 'funding-partner-requests',
  labels: {
    singular: 'طلب شريك ممول',
    plural: 'طلبات الشريك الممول',
  },
  admin: {
    group: 'طلبات العملاء',
    useAsTitle: 'contactName',
    defaultColumns: ['contactName', 'ownershipStatus', 'partnershipType', 'reviewStatus', 'createdAt'],
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
      name: 'ownershipStatus',
      label: 'موقف الملكية',
      type: 'select',
      required: true,
      options: ['اسم على صفحة الجهاز', 'إخطار تخصيص'],
    },
    {
      name: 'partnershipType',
      label: 'نوع الشراكة',
      type: 'select',
      required: true,
      options: ['شراكة برسوم التقنين', 'شراكة برسوم التقنين والمباني', 'شراكة بالمباني فقط'],
    },
    {
      type: 'row',
      fields: [
        { name: 'landAreaSqm', label: 'مساحة الأرض بالمتر', type: 'number' },
        { name: 'tanqinSeriousnessPaid', label: 'تم سداد جدية التقنين', type: 'checkbox' },
      ],
    },
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
