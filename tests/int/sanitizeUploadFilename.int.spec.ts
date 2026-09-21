import { describe, expect, it } from 'vitest'

import { sanitizeUploadFilename } from '@/utilities/sanitizeUploadFilename'

describe('sanitizeUploadFilename', () => {
  it('replaces the narrow no-break space macOS screenshots use', () => {
    expect(sanitizeUploadFilename('Screenshot 2026-08-23 at 5.53.55\u202FAM.png')).toBe(
      'Screenshot-2026-08-23-at-5.53.55-AM.png',
    )
  })

  it('keeps names that are already safe', () => {
    expect(sanitizeUploadFilename('allocation-notice_01.pdf')).toBe('allocation-notice_01.pdf')
  })

  it('normalizes the extension and strips unsupported characters', () => {
    expect(sanitizeUploadFilename('صورة الترخيص (نهائي).PNG')).toMatch(/^file-\d+\.png$/)
    expect(sanitizeUploadFilename('plan #3 & final.JPEG')).toBe('plan-3-final.jpeg')
  })

  it('produces only characters Supabase accepts in an object key', () => {
    const result = sanitizeUploadFilename('  محضر استلام الأرض 2026/08/23.pdf  ')
    expect(result).toMatch(/^[A-Za-z0-9._-]+$/)
  })
})
