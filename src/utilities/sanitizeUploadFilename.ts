const MAX_BASE_LENGTH = 80

// Supabase Storage rejects object keys containing characters outside a narrow ASCII
// set, so names like macOS screenshots (which use U+202F before AM/PM) or Arabic
// filenames fail with InvalidKey. Payload's own sanitizer only removes characters
// that are illegal on a filesystem, so keys must be narrowed further here.
function toAsciiSlug(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[-._]+|[-._]+$/g, '')
}

export function sanitizeUploadFilename(originalName: string): string {
  const trimmed = (originalName ?? '').trim()
  const lastDot = trimmed.lastIndexOf('.')
  const hasExtension = lastDot > 0 && lastDot < trimmed.length - 1

  const base = toAsciiSlug(hasExtension ? trimmed.slice(0, lastDot) : trimmed).slice(
    0,
    MAX_BASE_LENGTH,
  )
  const extension = hasExtension ? toAsciiSlug(trimmed.slice(lastDot + 1)).toLowerCase() : ''

  const safeBase = base || `file-${Date.now()}`

  return extension ? `${safeBase}.${extension}` : safeBase
}
