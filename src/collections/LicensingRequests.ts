import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const LicensingRequests: CollectionConfig = {
  slug: 'licensing-requests',
  labels: {
    singular: 'طلب ترخيص',
    plural: 'طلبات الرسومات والتراخيص',
  },
  admin: {
    group: 'طلبات العملاء',
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'serviceType', 'phone', 'reviewStatus', 'createdAt'],
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
      name: 'serviceType',
      label: 'نوع الخدمة',
      type: 'select',
      required: true,
      options: ['تصميم هندسي', 'استصدار رخصة'],
    },
    {
      type: 'row',
      fields: [
        { name: 'plotAreaSqm', label: 'مساحة القطعة بالمتر', type: 'number', required: true },
        { name: 'plotNumber', label: 'رقم القطعة', type: 'text', required: true },
        { name: 'districtNumber', label: 'رقم الحي', type: 'text', required: true },
        { name: 'neighborhoodNumber', label: 'رقم المجاورة', type: 'text', required: true },
      ],
    },
    {
      name: 'allocationNotices',
      label: 'إخطار / محضر التخصيص',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'fullName', label: 'الاسم بالكامل', type: 'text', required: true },
        { name: 'nationalId', label: 'الرقم القومي', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'governorate', label: 'المحافظة', type: 'text', required: true },
        { name: 'phone', label: 'رقم الهاتف', type: 'text', required: true },
        { name: 'email', label: 'البريد الإلكتروني', type: 'email' },
      ],
    },
    {
      name: 'ownerType',
      label: 'صفة مقدم الطلب',
      type: 'select',
      required: true,
      options: ['مالك أساسي', 'بتوكيل'],
    },
    {
      name: 'nationalIdPhotos',
      label: 'صور بطاقة الرقم القومي',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'powerOfAttorneyDocuments',
      label: 'مستندات التوكيل',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
  ],
  timestamps: true,
}
