import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const OwnershipRegistrations: CollectionConfig = {
  slug: 'ownership-registrations',
  labels: {
    singular: 'طلب تقنين ملكية',
    plural: 'طلبات تقنين الملكية',
  },
  admin: {
    group: 'طلبات العملاء',
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'phone', 'cooperative', 'reviewStatus', 'createdAt'],
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
    { name: 'fullName', label: 'الاسم بالكامل', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'governorate', label: 'المحافظة', type: 'text', required: true },
        { name: 'phone', label: 'رقم الهاتف', type: 'text', required: true },
        { name: 'email', label: 'البريد الإلكتروني', type: 'email' },
      ],
    },
    {
      name: 'cooperative',
      label: 'الجمعية',
      type: 'select',
      required: true,
      options: ['الطلائع', 'مصر الجديدة', 'أحمد عرابي', 'الأمل', 'القادسية', 'مصر التعاونية', 'اتحاد الوفاق'],
    },
    { name: 'applicationStatus', label: 'الموقف الحالي', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'areaUnit',
          label: 'وحدة المساحة',
          type: 'select',
          required: true,
          options: [
            { label: 'فدان', value: 'feddan' },
            { label: 'متر مربع', value: 'meter' },
          ],
        },
        { name: 'plotNumber', label: 'رقم القطعة', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'basinNumber', label: 'رقم الحوض', type: 'text' },
        { name: 'lineNumber', label: 'رقم الخط', type: 'text' },
      ],
    },
    { name: 'feddanCount', label: 'عدد الأفدنة', type: 'number' },
    { name: 'hasResidentialPlot', label: 'مع قطعة سكنية', type: 'checkbox' },
    { name: 'residentialPlotArea', label: 'مساحة القطعة السكنية', type: 'number' },
    { name: 'isBuilt', label: 'القطعة مبنية', type: 'checkbox' },
    { name: 'meterArea', label: 'المساحة بالمتر', type: 'number' },
    { name: 'sellerName', label: 'البائع / صاحب القطعة', type: 'text' },
    { name: 'ownershipChain', label: 'تسلسل الملكية', type: 'text' },
    {
      name: 'ownershipChainDocuments',
      label: 'مستندات تسلسل الملكية',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    { name: 'sizeSelection', label: 'ملخص المساحة', type: 'text', required: true },
    { name: 'buildingDescription', label: 'وصف المبنى', type: 'textarea' },
    {
      name: 'buildingPhotos',
      label: 'صور المبنى',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'ownershipDocuments',
      label: 'مستندات الملكية',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'areaMaps',
      label: 'خرائط المساحة',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    { name: 'notes', label: 'ملاحظات', type: 'textarea' },
    {
      name: 'ownerIdCard',
      label: 'صورة بطاقة المالك',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
  ],
  timestamps: true,
}
