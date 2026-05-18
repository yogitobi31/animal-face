export type AnimalIllustrationEntry = {
  illustrationKey: string
  path: string
}

const sanitizeIllustrationKey = (illustrationKey: string) => illustrationKey.trim().toLowerCase()

export const getIllustrationPath = (illustrationKey: string): string | null => {
  const sanitizedKey = sanitizeIllustrationKey(illustrationKey)

  if (!sanitizedKey) {
    return null
  }

  return `/animals/${sanitizedKey}.png`
}
