import { beforeEach, describe, expect, it, vi } from 'vitest'

const create = vi.fn()

vi.mock('payload', () => ({
  getPayload: vi.fn(async () => ({ create })),
}))

vi.mock('@payload-config', () => ({ default: Promise.resolve({}) }))

import {
  submitConstructionRequest,
  submitFundingPartnerRequest,
  submitLicensingRequest,
  submitOwnershipRegistration,
} from '@/actions/submissions'

describe('submission server actions', () => {
  beforeEach(() => {
    create.mockReset()
    create.mockResolvedValue({ id: 'request-id' })
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  it('creates a structured ownership registration with media relationships', async () => {
    const result = await submitOwnershipRegistration({
      fullName: 'محمد أحمد',
      governorate: 'القاهرة',
      phone: '01000000000',
      cooperative: 'الأمل',
      applicationStatus: 'لم يتم تقديم الأوراق للجهاز',
      areaUnit: 'feddan',
      feddanCount: '2',
      hasResidentialPlot: true,
      residentialPlotArea: '450',
      isBuilt: true,
      plotNumber: '12',
      sizeSelection: '2 فدان',
      buildingPhotos: ['building-media'],
      ownershipDocuments: ['document-media'],
      areaMaps: ['map-media'],
    })

    expect(result).toEqual({ success: true, data: { id: 'request-id' } })
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'ownership-registrations',
        data: expect.objectContaining({
          feddanCount: 2,
          residentialPlotArea: 450,
          buildingPhotos: ['building-media'],
          ownershipDocuments: ['document-media'],
          areaMaps: ['map-media'],
        }),
      }),
    )
  })

  it('rejects a meter-area registration missing the ownership chain', async () => {
    const result = await submitOwnershipRegistration({
      fullName: 'محمد أحمد',
      governorate: 'القاهرة',
      phone: '01000000000',
      cooperative: 'الأمل',
      applicationStatus: 'لم يتم تقديم الأوراق للجهاز',
      areaUnit: 'meter',
      meterArea: '450',
      sellerName: 'أحمد',
      plotNumber: '12',
      sizeSelection: '450 م²',
    })

    expect(result.success).toBe(false)
    expect(create).not.toHaveBeenCalled()
  })

  it('creates a licensing request and requires a power of attorney when applicable', async () => {
    const valid = await submitLicensingRequest({
      serviceType: 'استصدار رخصة',
      allocationNotices: ['allocation-media'],
      plotAreaSqm: '450',
      plotNumber: '12',
      districtNumber: '3',
      neighborhoodNumber: '5',
      fullName: 'محمد أحمد',
      nationalId: '12345678901234',
      nationalIdPhotos: ['id-media'],
      governorate: 'القاهرة',
      phone: '01000000000',
      ownerType: 'بتوكيل',
      powerOfAttorneyDocuments: ['poa-media'],
    })

    expect(valid.success).toBe(true)
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'licensing-requests',
        data: expect.objectContaining({
          allocationNotices: ['allocation-media'],
          nationalIdPhotos: ['id-media'],
          powerOfAttorneyDocuments: ['poa-media'],
        }),
      }),
    )

    create.mockClear()
    const invalid = await submitLicensingRequest({
      serviceType: 'استصدار رخصة',
      plotAreaSqm: '450',
      plotNumber: '12',
      districtNumber: '3',
      neighborhoodNumber: '5',
      fullName: 'محمد أحمد',
      nationalId: '12345678901234',
      governorate: 'القاهرة',
      phone: '01000000000',
      ownerType: 'بتوكيل',
    })

    expect(invalid.success).toBe(false)
    expect(create).not.toHaveBeenCalled()
  })

  it('creates a construction request with uploaded documents', async () => {
    const result = await submitConstructionRequest({
      allocationNotices: ['allocation-media'],
      receiptMinutes: ['receipt-media'],
      licenseDocuments: ['license-media'],
      workDescription: 'بناء فيلا',
      contactName: 'محمد أحمد',
      contactPhone: '01000000000',
    })

    expect(result.success).toBe(true)
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'construction-requests',
        data: expect.objectContaining({
          allocationNotices: ['allocation-media'],
          receiptMinutes: ['receipt-media'],
          licenseDocuments: ['license-media'],
        }),
      }),
    )

    create.mockClear()
    expect(
      (
        await submitConstructionRequest({
          workDescription: '',
          contactName: 'محمد أحمد',
          contactPhone: '01000000000',
        })
      ).success,
    ).toBe(false)
    expect(create).not.toHaveBeenCalled()
  })

  it('validates both funding request paths', async () => {
    const allocationPath = await submitFundingPartnerRequest({
      ownershipStatus: 'إخطار تخصيص',
      allocationNotices: ['allocation-media'],
      partnershipType: 'شراكة برسوم التقنين',
      contactName: 'محمد أحمد',
      contactPhone: '01000000000',
    })

    expect(allocationPath.success).toBe(true)
    expect(create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        collection: 'funding-partner-requests',
        data: expect.objectContaining({ allocationNotices: ['allocation-media'] }),
      }),
    )

    const devicePagePath = await submitFundingPartnerRequest({
      ownershipStatus: 'اسم على صفحة الجهاز',
      landAreaSqm: '600',
      tanqinSeriousnessPaid: false,
      partnershipType: 'شراكة بالمباني فقط',
      contactName: 'محمد أحمد',
      contactPhone: '01000000000',
    })

    expect(devicePagePath.success).toBe(true)
    expect(create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          landAreaSqm: 600,
          tanqinSeriousnessPaid: false,
        }),
      }),
    )

    create.mockClear()
    const invalid = await submitFundingPartnerRequest({
      ownershipStatus: 'إخطار تخصيص',
      partnershipType: 'شراكة برسوم التقنين',
      contactName: 'محمد أحمد',
      contactPhone: '01000000000',
    })

    expect(invalid.success).toBe(false)
    expect(create).not.toHaveBeenCalled()
  })
})
