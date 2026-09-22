'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import {
  constructionRequestSchema,
  fundingPartnerRequestSchema,
  licensingRequestSchema,
  ownershipRegistrationSchema,
  parseOrThrow,
} from '@/lib/validation'

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
  basinNumber?: string
  lineNumber?: string
  sellerName?: string
  ownershipChain?: string
  sizeSelection: string
  buildingDescription?: string
  buildingPhotos?: string[]
  ownershipDocuments?: string[]
  areaMaps?: string[]
  ownerIdCard?: string[]
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
    const data = parseOrThrow(ownershipRegistrationSchema, input)

    const payload = await getPayload({ config })
    const record = await payload.create({
      collection: 'ownership-registrations',
      data: {
        fullName: data.fullName,
        governorate: data.governorate,
        phone: data.phone,
        email: data.email,
        reviewStatus: 'new',
        cooperative: data.cooperative,
        applicationStatus: data.applicationStatus,
        areaUnit: data.areaUnit,
        feddanCount: data.areaUnit === 'feddan' ? Number(data.feddanCount) : undefined,
        hasResidentialPlot: data.areaUnit === 'feddan' ? data.hasResidentialPlot : undefined,
        residentialPlotArea:
          data.areaUnit === 'feddan' && data.hasResidentialPlot
            ? Number(data.residentialPlotArea)
            : undefined,
        isBuilt: data.areaUnit === 'feddan' && data.hasResidentialPlot ? data.isBuilt : undefined,
        meterArea: data.areaUnit === 'meter' ? Number(data.meterArea) : undefined,
        plotNumber: data.plotNumber,
        basinNumber: data.basinNumber,
        lineNumber: data.lineNumber,
        sellerName: data.areaUnit === 'meter' ? data.sellerName : undefined,
        ownershipChain: data.areaUnit === 'meter' ? data.ownershipChain : undefined,
        sizeSelection: data.sizeSelection,
        buildingDescription: data.isBuilt ? data.buildingDescription : undefined,
        buildingPhotos: data.isBuilt ? data.buildingPhotos : [],
        ownershipDocuments: data.ownershipDocuments,
        areaMaps: data.areaMaps,
        ownerIdCard: data.ownerIdCard,
        notes: data.notes,
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
    const data = parseOrThrow(licensingRequestSchema, input)

    const payload = await getPayload({ config })
    const record = await payload.create({
      collection: 'licensing-requests',
      data: {
        reviewStatus: 'new',
        serviceType: data.serviceType,
        allocationNotices: data.allocationNotices,
        plotAreaSqm: Number(data.plotAreaSqm),
        plotNumber: data.plotNumber,
        districtNumber: data.districtNumber,
        neighborhoodNumber: data.neighborhoodNumber,
        fullName: data.fullName,
        nationalId: data.nationalId,
        nationalIdPhotos: data.nationalIdPhotos,
        governorate: data.governorate,
        phone: data.phone,
        email: data.email,
        ownerType: data.ownerType,
        powerOfAttorneyDocuments: data.ownerType === 'بتوكيل' ? data.powerOfAttorneyDocuments : [],
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
    const data = parseOrThrow(constructionRequestSchema, input)

    const payload = await getPayload({ config })
    const record = await payload.create({
      collection: 'construction-requests',
      data: {
        reviewStatus: 'new',
        allocationNotices: data.allocationNotices,
        receiptMinutes: data.receiptMinutes,
        licenseDocuments: data.licenseDocuments,
        workDescription: data.workDescription,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
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
    const data = parseOrThrow(fundingPartnerRequestSchema, input)

    const payload = await getPayload({ config })
    const record = await payload.create({
      collection: 'funding-partner-requests',
      data: {
        reviewStatus: 'new',
        ownershipStatus: data.ownershipStatus,
        allocationNotices: data.allocationNotices,
        receiptMinutes: data.receiptMinutes,
        licenseDocuments: data.licenseDocuments,
        landAreaSqm:
          data.ownershipStatus === 'اسم على صفحة الجهاز' ? Number(data.landAreaSqm) : undefined,
        tanqinSeriousnessPaid:
          data.ownershipStatus === 'اسم على صفحة الجهاز' ? data.tanqinSeriousnessPaid : undefined,
        partnershipType: data.partnershipType,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
      },
    })

    return { success: true, data: { id: String(record.id) } }
  } catch (error) {
    return failure<{ id: string }>(error)
  }
}
