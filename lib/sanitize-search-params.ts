export function sanitizeSearchParam(search?: string): string | null {
  if (!search) return null

  const cleaned = search.trim().toLowerCase()

  if (cleaned.length === 0 || cleaned.length > 100) return null

  const sanitized = cleaned.replace(/[%_;$]/g, '')

  return sanitized || null
}
