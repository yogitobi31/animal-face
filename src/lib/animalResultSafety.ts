import type { AnimalResult, AnimalFeatureWeights } from '../data/animalResults';

const DEFAULT_PALETTE = ['#F4ECE1', '#D8C2AD', '#6F5D50'] as const;
const HEX_COLOR_RE = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const DEFAULT_FEATURE_WEIGHTS: AnimalFeatureWeights = {
  softness: 0.5,
  sharpness: 0.5,
  brightness: 0.5,
  calmness: 0.5,
  mystique: 0.5,
  playfulness: 0.5,
};

const asNonEmptyString = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim() ? value : fallback;

export function normalizePalette(input: unknown, contextId: string): string[] {
  if (!Array.isArray(input)) {
    console.error(`[animal-result] invalid palette(non-array) for id=${contextId}`);
    return [...DEFAULT_PALETTE];
  }

  const cleaned = input
    .filter((v): v is string => typeof v === 'string')
    .map((v) => v.trim())
    .filter((v) => HEX_COLOR_RE.test(v));

  if (cleaned.length < 2) {
    console.error(`[animal-result] invalid palette(length/hex) for id=${contextId}`, input);
    return [...DEFAULT_PALETTE];
  }

  return [cleaned[0], cleaned[1], cleaned[2] ?? DEFAULT_PALETTE[2]];
}

export function normalizeAnimalResult(input: Partial<AnimalResult> | null | undefined, fallbackId = 'unknown'): AnimalResult {
  const id = asNonEmptyString(input?.id, fallbackId);
  const baseAnimal = asNonEmptyString(input?.baseAnimal, '동물상');

  if (!Array.isArray(input?.moodTags)) {
    console.error(`[animal-result] invalid moodTags(non-array) for id=${id}`);
  }

  const moodTags = Array.isArray(input?.moodTags)
    ? input.moodTags.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
    : [];

  const illustrationKey = asNonEmptyString(
    input?.illustrationKey,
    `${baseAnimal}-${id}`.replace(/\s+/g, '_').toLowerCase(),
  );

  const normalized: AnimalResult = {
    id,
    name: asNonEmptyString(input?.name, '알 수 없는 동물상'),
    baseAnimal,
    category: asNonEmptyString(input?.category, 'unknown'),
    moodTags,
    tagline: asNonEmptyString(input?.tagline, '분석 결과를 준비 중입니다.'),
    description: asNonEmptyString(input?.description, '잠시 후 다시 확인해 주세요.'),
    palette: normalizePalette(input?.palette, id),
    illustrationKey,
    featureWeights: input?.featureWeights ?? DEFAULT_FEATURE_WEIGHTS,
  };

  return normalized;
}

export function validateAnimalResultsDataset(results: Array<Partial<AnimalResult>>) {
  return results.map((item, index) => normalizeAnimalResult(item, `dataset-${index}`));
}
