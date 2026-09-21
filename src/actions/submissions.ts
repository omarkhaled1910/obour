'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string }

export type UploadedMedia = {
  id: string
  url: string | null
  filename: string | null
}

type Cooperative =
  | 'الطلائع'
  | 'مصر الجديدة'
  | 'أحمد عرابي'
  | 'الأمل'
  | 'القادسية'
  | 'مصر التعاونية'
  | 'اتحاد الوفاق'

export type OwnershipRegistrationInput = {
  fullName: string
  nationalId: string
  governorate: string
  phone: string
  email?: string
  cooperative: Cooperative
  applicationStatus: string
  areaUnit: 'feddan' | 'meter'
  feddanCount?: string
  hasResidentialPlot?: boolean
  residentialPlotArea?: string
  isBuilt?: boolean
  meterArea?: string
  plotNumber: string
  sellerName?: string
  sizeSelection: string
  buildingDescription?: string
  buildingPhotos?: string[]
  ownershipDocuments?: string[]
  areaMaps?: string[]
  notes?: string
}

export type LicensingRequestInput = {
  serviceType: 'محضر استلام أرض' | 'استصدار رخصة'
  allocationNotices?: string[]
  plotAreaSqm: string
  plotNumber: string
  districtNumber: string
  neighborhoodNumber: string
  fullName: string
  nationalId: string
  nationalIdPhotos?: string[]
  governorate: string
  phone: string
  email?: string
  ownerType: 'مالك أساسي' | 'بتوكيل'
  powerOfAttorneyDocuments?: string[]
}

export type ConstructionRequestInput = {
  allocationNotices?: string[]
  receiptMinutes?: string[]
  licenseDocuments?: string[]
  workDescription: string
  contactName: string
  contactPhone: string
  contactEmail?: string
}

export type FundingPartnerRequestInput = {
  ownershipStatus: 'اسم على صفحة الجهاز' | 'إخطار تخصيص'
  allocationNotices?: string[]
  receiptMinutes?: string[]
  licenseDocuments?: string[]
  landAreaSqm?: string
  tanqinSeriousnessPaid?: boolean
  partnershipType:
    | 'شراكة برسوم التقنين'
    | 'شراكة برسوم التقنين والمباني'
    | 'شراكة بالمباني فقط'
  contactName: string
  contactPhone: string
  contactEmail?: string
}

const MAX_FILES = 6
const MAX_FILE_SIZE = 8 * 1024 * 1024
const ALLOWED_FILE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
])

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function optional(value: unknown): string | undefined {
  const result = clean(value)
  return result || undefined
}

function positiveNumber(value: unknown, label: string): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`من فضلك أدخل ${label} بشكل صحيح`)
  }
  return parsed
}

function validateContact(name: unknown, phone: unknown, email?: unknown) {
  if (!clean(name) || !clean(phone)) {
    throw new Error('من فضلك أكمل الاسم ورقم الهاتف')
  }
  const normalizedEmail = optional(email)
  if (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('من فضلك أدخل بريدًا إلكترونيًا صحيحًا')
  }
}

function validateNationalId(value: unknown) {
  if (!/^\d{14}$/.test(clean(value))) {
    throw new Error('الرقم القومي يجب أن يتكون من 14 رقمًا')
  }
}

function mediaIDs(value?: string[]): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0)
}

function failure<T = undefined>(error: unknown): ActionResult<T> {
  console.error(error)
  const message = error instanceof Error ? error.message : ''
  return {
    success: false,
    error: /[\u0600-\u06ff]/.test(message)
      ? message
      : 'حدث خطأ غير متوقع، حاول مرة أخرى',
  }
}

export async function uploadFilesAction(formData: FormData): Promise<ActionResult<UploadedMedia[]>> {
  try {
    const files = formData.getAll('files').filter((item): item is File => item instanceof File)

    if (files.length === 0) throw new Error('اختر ملفًا واحدًا على الأقل')
    if (files.length > MAX_FILES) throw new Error(`يمكن رفع ${MAX_FILES} ملفات كحد أقصى في المرة`)

    const payload = await getPayload({ config })
    const uploaded: UploadedMedia[] = []

    for (const file of files) {
      if (!ALLOWED_FILE_TYPES.has(file.type)) {
        throw new Error(`نوع الملف غير مدعوم: ${file.name}`)
      }
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`حجم الملف ${file.name} أكبر من 8 ميجابايت`)
      }

      const media = await payload.create({
        collection: 'media',
        data: { alt: file.name },
        file: {
          data: Buffer.from(await file.arrayBuffer()),
          mimetype: file.type,
          name: file.name,
          size: file.size,
        },
      })

      uploaded.push({
        id: String(media.id),
        url: media.url ?? null,
        filename: media.filename ?? null,
      })
    }

    return { success: true, data: uploaded }
  } catch (error) {
    return failure<UploadedMedia[]>(error)
  }
}

export async function submitOwnershipRegistration(
  input: OwnershipRegistrationInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    validateContact(input.fullName, input.phone, input.email)
    validateNationalId(input.nationalId)

    if (!clean(input.governorate) || !clean(input.cooperative) || !clean(input.applicationStatus)) {
      throw new Error('من فضلك أكمل كل الحقول المطلوبة')
    }
    if (!clean(input.plotNumber) || !clean(input.sizeSelection)) {
      throw new Error('من فضلك أكمل بيانات المساحة ورقم القطعة')
    }
    if (input.areaUnit === 'feddan') {
      positiveNumber(input.feddanCount, 'عدد الأفدنة')
      if (typeof input.hasResidentialPlot !== 'boolean') {
        throw new Error('حدّد هل توجد قطعة سكنية')
      }
      if (input.hasResidentialPlot) {
        positiveNumber(input.residentialPlotArea, 'مساحة القطعة السكنية')
        if (typeof input.isBuilt !== 'boolean') throw new Error('حدّد هل القطعة مبنية')
      }
    } else if (input.areaUnit === 'meter') {
      positiveNumber(input.meterArea, 'المساحة بالمتر')
      if (!clean(input.sellerName)) throw new Error('من فضلك أدخل اسم البائع أو صاحب القطعة')
    } else {
      throw new Error('من فضلك اختر وحدة المساحة')
    }

    const payload = await getPayload({ config })
    const record = await payload.create({
      collection: 'ownership-registrations',
      data: {
        fullName: clean(input.fullName),
        nationalId: clean(input.nationalId),
        governorate: clean(input.governorate),
        phone: clean(input.phone),
        email: optional(input.email),
        reviewStatus: 'new',
        cooperative: input.cooperative,
        applicationStatus: clean(input.applicationStatus),
        areaUnit: input.areaUnit,
        feddanCount:
          input.areaUnit === 'feddan' ? positiveNumber(input.feddanCount, 'عدد الأفدنة') : undefined,
        hasResidentialPlot: input.areaUnit === 'feddan' ? input.hasResidentialPlot : undefined,
        residentialPlotArea:
          input.areaUnit === 'feddan' && input.hasResidentialPlot
            ? positiveNumber(input.residentialPlotArea, 'مساحة القطعة السكنية')
            : undefined,
        isBuilt:
          input.areaUnit === 'feddan' && input.hasResidentialPlot ? input.isBuilt : undefined,
        meterArea:
          input.areaUnit === 'meter' ? positiveNumber(input.meterArea, 'المساحة بالمتر') : undefined,
        plotNumber: clean(input.plotNumber),
        sellerName: input.areaUnit === 'meter' ? clean(input.sellerName) : undefined,
        sizeSelection: clean(input.sizeSelection),
        buildingDescription: input.isBuilt ? optional(input.buildingDescription) : undefined,
        buildingPhotos: input.isBuilt ? mediaIDs(input.buildingPhotos) : [],
        ownershipDocuments: mediaIDs(input.ownershipDocuments),
        areaMaps: mediaIDs(input.areaMaps),
        notes: optional(input.notes),
      },
    })

    return { success: true, data: { id: String(record.id) } }
  } catch (error) {
    return failure<{ id: string }>(error)
  }
}

export async function submitLicensingRequest(
  input: LicensingRequestInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    validateContact(input.fullName, input.phone, input.email)
    validateNationalId(input.nationalId)
    if (
      !input.serviceType ||
      !clean(input.plotNumber) ||
      !clean(input.districtNumber) ||
      !clean(input.neighborhoodNumber) ||
      !clean(input.governorate) ||
      !input.ownerType
    ) {
      throw new Error('من فضلك أكمل كل الحقول المطلوبة')
    }
    const powerOfAttorneyDocuments = mediaIDs(input.powerOfAttorneyDocuments)
    if (input.ownerType === 'بتوكيل' && powerOfAttorneyDocuments.length === 0) {
      throw new Error('من فضلك ارفع صورة التوكيل')
    }

    const payload = await getPayload({ config })
    const record = await payload.create({
      collection: 'licensing-requests',
      data: {
        reviewStatus: 'new',
        serviceType: input.serviceType,
        allocationNotices: mediaIDs(input.allocationNotices),
        plotAreaSqm: positiveNumber(input.plotAreaSqm, 'مساحة القطعة'),
        plotNumber: clean(input.plotNumber),
        districtNumber: clean(input.districtNumber),
        neighborhoodNumber: clean(input.neighborhoodNumber),
        fullName: clean(input.fullName),
        nationalId: clean(input.nationalId),
        nationalIdPhotos: mediaIDs(input.nationalIdPhotos),
        governorate: clean(input.governorate),
        phone: clean(input.phone),
        email: optional(input.email),
        ownerType: input.ownerType,
        powerOfAttorneyDocuments:
          input.ownerType === 'بتوكيل' ? powerOfAttorneyDocuments : [],
      },
    })

    return { success: true, data: { id: String(record.id) } }
  } catch (error) {
    return failure<{ id: string }>(error)
  }
}

export async function submitConstructionRequest(
  input: ConstructionRequestInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    validateContact(input.contactName, input.contactPhone, input.contactEmail)
    if (!clean(input.workDescription)) {
      throw new Error('من فضلك اكتب وصف الإنشاءات المراد تنفيذها')
    }

    const payload = await getPayload({ config })
    const record = await payload.create({
      collection: 'construction-requests',
      data: {
        reviewStatus: 'new',
        allocationNotices: mediaIDs(input.allocationNotices),
        receiptMinutes: mediaIDs(input.receiptMinutes),
        licenseDocuments: mediaIDs(input.licenseDocuments),
        workDescription: clean(input.workDescription),
        contactName: clean(input.contactName),
        contactPhone: clean(input.contactPhone),
        contactEmail: optional(input.contactEmail),
      },
    })

    return { success: true, data: { id: String(record.id) } }
  } catch (error) {
    return failure<{ id: string }>(error)
  }
}

export async function submitFundingPartnerRequest(
  input: FundingPartnerRequestInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    validateContact(input.contactName, input.contactPhone, input.contactEmail)
    if (!input.ownershipStatus || !input.partnershipType) {
      throw new Error('من فضلك أكمل كل الحقول المطلوبة')
    }

    const allocationNotices = mediaIDs(input.allocationNotices)
    const receiptMinutes = mediaIDs(input.receiptMinutes)
    const licenseDocuments = mediaIDs(input.licenseDocuments)

    if (
      input.ownershipStatus === 'إخطار تخصيص' &&
      allocationNotices.length + receiptMinutes.length + licenseDocuments.length === 0
    ) {
      throw new Error('من فضلك ارفع مستند ملكية واحدًا على الأقل')
    }
    if (input.ownershipStatus === 'اسم على صفحة الجهاز') {
      positiveNumber(input.landAreaSqm, 'مساحة الأرض')
      if (typeof input.tanqinSeriousnessPaid !== 'boolean') {
        throw new Error('حدّد حالة سداد جدية التقنين')
      }
    }

    const payload = await getPayload({ config })
    const record = await payload.create({
      collection: 'funding-partner-requests',
      data: {
        reviewStatus: 'new',
        ownershipStatus: input.ownershipStatus,
        allocationNotices,
        receiptMinutes,
        licenseDocuments,
        landAreaSqm:
          input.ownershipStatus === 'اسم على صفحة الجهاز'
            ? positiveNumber(input.landAreaSqm, 'مساحة الأرض')
            : undefined,
        tanqinSeriousnessPaid:
          input.ownershipStatus === 'اسم على صفحة الجهاز'
            ? input.tanqinSeriousnessPaid
            : undefined,
        partnershipType: input.partnershipType,
        contactName: clean(input.contactName),
        contactPhone: clean(input.contactPhone),
        contactEmail: optional(input.contactEmail),
      },
    })

    return { success: true, data: { id: String(record.id) } }
  } catch (error) {
    return failure<{ id: string }>(error)
  }
}
