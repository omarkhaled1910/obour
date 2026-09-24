import { z } from 'zod'

function emptyToUndefined(value: unknown) {
  const trimmed = typeof value === 'string' ? value.trim() : value
  return trimmed === '' ? undefined : trimmed
}

export const requiredText = (message: string) => z.string().trim().min(1, message)

export const optionalText = z.preprocess(emptyToUndefined, z.string().optional())

export const emailField = z.preprocess(
  emptyToUndefined,
  z.string().email('من فضلك أدخل بريدًا إلكترونيًا صحيحًا').optional(),
)

export const nationalIdField = z
  .string()
  .trim()
  .regex(/^\d{14}$/, 'الرقم القومي يجب أن يتكون من 14 رقمًا')

export const mediaIdsField = z
  .array(z.string().min(1))
  .optional()
  .transform((value) => value ?? [])

export function positiveNumberString(label: string) {
  return z.string().superRefine((value, ctx) => {
    const parsed = Number(value)
    if (!value.trim() || !Number.isFinite(parsed) || parsed <= 0) {
      ctx.addIssue({ code: 'custom', message: `من فضلك أدخل ${label} بشكل صحيح` })
    }
  })
}

function addIssue(ctx: z.RefinementCtx, message: string, path: (string | number)[]) {
  ctx.addIssue({ code: 'custom', message, path })
}

const COOPERATIVES = [
  'الطلائع',
  'مصر الجديدة',
  'أحمد عرابي',
  'الأمل',
  'القادسية',
  'مصر التعاونية',
  'اتحاد الوفاق',
] as const

export const ownershipRegistrationSchema = z
  .object({
    fullName: requiredText('من فضلك أكمل الاسم ورقم الهاتف'),
    governorate: requiredText('من فضلك أكمل كل الحقول المطلوبة'),
    phone: requiredText('من فضلك أكمل الاسم ورقم الهاتف'),
    email: emailField,
    cooperative: z.enum(COOPERATIVES, 'من فضلك أكمل كل الحقول المطلوبة'),
    applicationStatus: requiredText('من فضلك أكمل كل الحقول المطلوبة'),
    areaUnit: z.enum(['feddan', 'meter'], 'من فضلك اختر وحدة المساحة'),
    feddanCount: z.string().optional(),
    hasResidentialPlot: z.boolean().optional(),
    residentialPlotArea: z.string().optional(),
    isBuilt: z.boolean().optional(),
    meterArea: z.string().optional(),
    plotNumber: requiredText('من فضلك أكمل بيانات المساحة ورقم القطعة'),
    basinNumber: optionalText,
    lineNumber: optionalText,
    sellerName: optionalText,
    ownershipChain: optionalText,
    ownershipChainDocuments: mediaIdsField,
    sizeSelection: requiredText('من فضلك أكمل بيانات المساحة ورقم القطعة'),
    buildingDescription: optionalText,
    buildingPhotos: mediaIdsField,
    ownershipDocuments: mediaIdsField,
    areaMaps: mediaIdsField,
    ownerIdCard: mediaIdsField,
    notes: optionalText,
  })
  .superRefine((data, ctx) => {
    if (data.areaUnit === 'feddan') {
      const feddan = Number(data.feddanCount)
      if (!data.feddanCount?.trim() || !Number.isFinite(feddan) || feddan <= 0) {
        addIssue(ctx, 'من فضلك أدخل عدد الأفدنة بشكل صحيح', ['feddanCount'])
      }
      if (typeof data.hasResidentialPlot !== 'boolean') {
        addIssue(ctx, 'حدّد هل توجد قطعة سكنية', ['hasResidentialPlot'])
      } else if (data.hasResidentialPlot) {
        const residentialArea = Number(data.residentialPlotArea)
        if (
          !data.residentialPlotArea?.trim() ||
          !Number.isFinite(residentialArea) ||
          residentialArea <= 0
        ) {
          addIssue(ctx, 'من فضلك أدخل مساحة القطعة السكنية بشكل صحيح', ['residentialPlotArea'])
        }
        if (typeof data.isBuilt !== 'boolean') {
          addIssue(ctx, 'حدّد هل القطعة مبنية', ['isBuilt'])
        }
      }
    } else if (data.areaUnit === 'meter') {
      const meter = Number(data.meterArea)
      if (!data.meterArea?.trim() || !Number.isFinite(meter) || meter <= 0) {
        addIssue(ctx, 'من فضلك أدخل المساحة بالمتر بشكل صحيح', ['meterArea'])
      }
      if (!data.sellerName?.trim()) {
        addIssue(ctx, 'من فضلك أدخل اسم البائع أو صاحب القطعة', ['sellerName'])
      }
      if (!data.ownershipChain?.trim()) {
        addIssue(ctx, 'من فضلك أدخل تسلسل الملكية', ['ownershipChain'])
      }
    }
  })

export type OwnershipRegistrationParsed = z.infer<typeof ownershipRegistrationSchema>

export const callbackRequestSchema = z.object({
  cooperative: z.enum(COOPERATIVES, 'من فضلك أكمل كل الحقول المطلوبة'),
  landArea: requiredText('من فضلك اكتب مساحة الأرض'),
  phone: requiredText('من فضلك اكتب رقم الهاتف'),
  notes: optionalText,
})

export type CallbackRequestParsed = z.infer<typeof callbackRequestSchema>

export const licensingRequestSchema = z
  .object({
    serviceType: z.enum(['تصميم هندسي', 'استصدار رخصة'], 'من فضلك أكمل كل الحقول المطلوبة'),
    allocationNotices: mediaIdsField,
    plotAreaSqm: positiveNumberString('مساحة القطعة'),
    plotNumber: requiredText('من فضلك أكمل كل الحقول المطلوبة'),
    districtNumber: requiredText('من فضلك أكمل كل الحقول المطلوبة'),
    neighborhoodNumber: requiredText('من فضلك أكمل كل الحقول المطلوبة'),
    fullName: requiredText('من فضلك أكمل الاسم ورقم الهاتف'),
    nationalId: nationalIdField,
    nationalIdPhotos: mediaIdsField,
    governorate: requiredText('من فضلك أكمل كل الحقول المطلوبة'),
    phone: requiredText('من فضلك أكمل الاسم ورقم الهاتف'),
    email: emailField,
    ownerType: z.enum(['مالك أساسي', 'بتوكيل'], 'من فضلك أكمل كل الحقول المطلوبة'),
    powerOfAttorneyDocuments: mediaIdsField,
  })
  .superRefine((data, ctx) => {
    if (data.ownerType === 'بتوكيل' && data.powerOfAttorneyDocuments.length === 0) {
      addIssue(ctx, 'من فضلك ارفع صورة التوكيل', ['powerOfAttorneyDocuments'])
    }
  })

export type LicensingRequestParsed = z.infer<typeof licensingRequestSchema>

export const constructionRequestSchema = z.object({
  allocationNotices: mediaIdsField,
  receiptMinutes: mediaIdsField,
  licenseDocuments: mediaIdsField,
  setbackLetters: mediaIdsField,
  workDescription: requiredText('من فضلك اكتب وصف الإنشاءات المراد تنفيذها'),
  contactName: requiredText('من فضلك أكمل الاسم ورقم الهاتف'),
  contactPhone: requiredText('من فضلك أكمل الاسم ورقم الهاتف'),
  contactEmail: emailField,
})

export type ConstructionRequestParsed = z.infer<typeof constructionRequestSchema>

export const fundingPartnerRequestSchema = z
  .object({
    ownershipStatus: z.enum(
      ['اسم على صفحة الجهاز', 'إخطار تخصيص'],
      'من فضلك أكمل كل الحقول المطلوبة',
    ),
    allocationNotices: mediaIdsField,
    receiptMinutes: mediaIdsField,
    licenseDocuments: mediaIdsField,
    landAreaSqm: z.string().optional(),
    tanqinSeriousnessPaid: z.boolean().optional(),
    partnershipType: z.enum(
      ['شراكة برسوم التقنين', 'شراكة برسوم التقنين والمباني', 'شراكة بالمباني فقط'],
      'من فضلك أكمل كل الحقول المطلوبة',
    ),
    contactName: requiredText('من فضلك اكتب الاسم ورقم الهاتف'),
    contactPhone: requiredText('من فضلك اكتب الاسم ورقم الهاتف'),
    contactEmail: emailField,
  })
  .superRefine((data, ctx) => {
    if (data.ownershipStatus === 'إخطار تخصيص') {
      const total =
        data.allocationNotices.length + data.receiptMinutes.length + data.licenseDocuments.length
      if (total === 0) {
        addIssue(ctx, 'من فضلك ارفع مستند ملكية واحدًا على الأقل', ['allocationNotices'])
      }
    }
    if (data.ownershipStatus === 'اسم على صفحة الجهاز') {
      const area = Number(data.landAreaSqm)
      if (!data.landAreaSqm?.trim() || !Number.isFinite(area) || area <= 0) {
        addIssue(ctx, 'من فضلك أدخل مساحة الأرض بشكل صحيح', ['landAreaSqm'])
      }
      if (typeof data.tanqinSeriousnessPaid !== 'boolean') {
        addIssue(ctx, 'حدّد حالة سداد جدية التقنين', ['tanqinSeriousnessPaid'])
      }
    }
  })

export type FundingPartnerRequestParsed = z.infer<typeof fundingPartnerRequestSchema>

export const memberSignUpSchema = z.object({
  fullName: requiredText('من فضلك اكتب الاسم بالكامل'),
  phone: requiredText('من فضلك اكتب رقم الهاتف'),
  password: z.string().min(6, 'كلمة السر لازم تكون 6 حروف/أرقام على الأقل'),
  age: optionalText,
  job: optionalText,
  email: emailField,
  governorate: optionalText,
})

export type MemberSignUpParsed = z.infer<typeof memberSignUpSchema>

export const memberLoginSchema = z.object({
  phone: requiredText('من فضلك اكتب رقم الهاتف'),
  password: requiredText('من فضلك اكتب كلمة السر'),
})

export type MemberLoginParsed = z.infer<typeof memberLoginSchema>

export function parseOrThrow<T extends z.ZodTypeAny>(schema: T, input: unknown): z.infer<T> {
  const result = schema.safeParse(input)
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message || 'من فضلك راجع بيانات النموذج')
  }
  return result.data
}
