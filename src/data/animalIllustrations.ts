export type AnimalIllustrationEntry = {
  illustrationKey: string
  path: string
}

export const animalIllustrationRegistry: Record<string, AnimalIllustrationEntry> = {
  'proud-cat': { illustrationKey: 'proud-cat', path: '/animals/proud-cat.webp' },
  'sunny-dog': { illustrationKey: 'sunny-dog', path: '/animals/sunny-dog.webp' },
  'snow-arctic-fox': { illustrationKey: 'snow-arctic-fox', path: '/animals/snow-arctic-fox.webp' },
  'moon-fox-cat': { illustrationKey: 'moon-fox-cat', path: '/animals/moon-fox-cat.webp' },
}

export const getIllustrationPath = (illustrationKey: string): string | null => {
  return animalIllustrationRegistry[illustrationKey]?.path ?? null
}
