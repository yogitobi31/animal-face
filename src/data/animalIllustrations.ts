export type AnimalIllustrationEntry = {
  illustrationKey: string
  path: string
}

const illustrationAliases: Record<string, string> = {
  proud_cat: 'proud-cat',
  sunny_dog: 'sunlit-dog',
  snow_arctic_fox: 'snow-arctic-fox',
  moon_fox_cat: 'moon-shadow-fox-cat',
  silver_wolf_cat: 'silver-wolf',
  morning_deer: 'dawn-deer',
  mist_rabbit: 'mist-rabbit',
  golden_lion: 'golden-lion',
  starlight_swan: 'starlight-swan',
  forest_shadow_bear: 'forest-shadow-bear',
  silk_weasel: 'silk-weasel',
  blue_dolphin: 'blue-dolphin',
  cold_leopard: 'cold-leopard',
  sunset_fox: 'sunset-fox',
  lake_otter: 'lake-otter',
  black_raven: 'black-raven',
}

export const animalIllustrationRegistry: Record<string, AnimalIllustrationEntry> = Object.fromEntries(
  Object.entries(illustrationAliases).map(([illustrationKey, fileName]) => [
    illustrationKey,
    { illustrationKey, path: `/animals/${fileName}.png` },
  ]),
)

const normalizeIllustrationKey = (illustrationKey: string) => illustrationKey.trim().toLowerCase().replace(/-/g, '_')

export const getIllustrationPath = (illustrationKey: string): string | null => {
  const normalizedKey = normalizeIllustrationKey(illustrationKey)
  const registryMatch = animalIllustrationRegistry[normalizedKey]?.path

  if (registryMatch) {
    return registryMatch
  }

  const kebabCaseKey = normalizedKey.replace(/_/g, '-')
  return `/animals/${kebabCaseKey}.png`
}
