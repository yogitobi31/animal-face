export type FeatureKey =
  | 'roundness' | 'sharpness' | 'softness' | 'eyeSize' | 'eyeSharpness' | 'eyeDroopiness' | 'eyeUpturn'
  | 'faceLength' | 'faceCompactness' | 'facialSpacing' | 'mouthWarmth' | 'smileEnergy' | 'calmness'
  | 'playfulness' | 'elegance' | 'wildness' | 'cuteness' | 'nobility' | 'approachability' | 'mysteriousness'

export type FeatureProfile = Record<FeatureKey, number>

const p = (v: FeatureProfile) => v

export const coreAnimalProfiles: Record<string, FeatureProfile> = {
  deer: p({ roundness: 52, sharpness: 44, softness: 70, eyeSize: 66, eyeSharpness: 42, eyeDroopiness: 36, eyeUpturn: 24, faceLength: 72, faceCompactness: 34, facialSpacing: 74, mouthWarmth: 64, smileEnergy: 46, calmness: 82, playfulness: 34, elegance: 80, wildness: 32, cuteness: 62, nobility: 76, approachability: 64, mysteriousness: 54 }),
  cat: p({ roundness: 44, sharpness: 78, softness: 46, eyeSize: 54, eyeSharpness: 82, eyeDroopiness: 20, eyeUpturn: 72, faceLength: 58, faceCompactness: 56, facialSpacing: 48, mouthWarmth: 38, smileEnergy: 34, calmness: 74, playfulness: 42, elegance: 68, wildness: 46, cuteness: 44, nobility: 70, approachability: 34, mysteriousness: 82 }),
  fox: p({ roundness: 34, sharpness: 88, softness: 38, eyeSize: 44, eyeSharpness: 84, eyeDroopiness: 18, eyeUpturn: 74, faceLength: 66, faceCompactness: 48, facialSpacing: 52, mouthWarmth: 40, smileEnergy: 42, calmness: 56, playfulness: 56, elegance: 64, wildness: 62, cuteness: 34, nobility: 58, approachability: 32, mysteriousness: 72 }),
  puppy: p({ roundness: 74, sharpness: 24, softness: 82, eyeSize: 72, eyeSharpness: 22, eyeDroopiness: 42, eyeUpturn: 20, faceLength: 42, faceCompactness: 76, facialSpacing: 46, mouthWarmth: 82, smileEnergy: 84, calmness: 46, playfulness: 86, elegance: 30, wildness: 18, cuteness: 84, nobility: 28, approachability: 92, mysteriousness: 14 }),
  rabbit: p({ roundness: 82, sharpness: 20, softness: 88, eyeSize: 86, eyeSharpness: 24, eyeDroopiness: 36, eyeUpturn: 24, faceLength: 38, faceCompactness: 82, facialSpacing: 58, mouthWarmth: 72, smileEnergy: 62, calmness: 66, playfulness: 62, elegance: 48, wildness: 12, cuteness: 92, nobility: 38, approachability: 84, mysteriousness: 26 }),

  bear: p({ roundness: 74, sharpness: 34, softness: 72, eyeSize: 48, eyeSharpness: 36, eyeDroopiness: 32, eyeUpturn: 18, faceLength: 44, faceCompactness: 72, facialSpacing: 52, mouthWarmth: 68, smileEnergy: 52, calmness: 72, playfulness: 38, elegance: 42, wildness: 44, cuteness: 66, nobility: 52, approachability: 72, mysteriousness: 34 }),
  wolf: p({ roundness: 30, sharpness: 86, softness: 30, eyeSize: 40, eyeSharpness: 78, eyeDroopiness: 16, eyeUpturn: 62, faceLength: 74, faceCompactness: 28, facialSpacing: 56, mouthWarmth: 30, smileEnergy: 26, calmness: 78, playfulness: 20, elegance: 58, wildness: 86, cuteness: 18, nobility: 66, approachability: 24, mysteriousness: 74 }),
  penguin: p({ roundness: 64, sharpness: 42, softness: 66, eyeSize: 56, eyeSharpness: 44, eyeDroopiness: 28, eyeUpturn: 30, faceLength: 48, faceCompactness: 62, facialSpacing: 52, mouthWarmth: 58, smileEnergy: 54, calmness: 76, playfulness: 44, elegance: 54, wildness: 18, cuteness: 64, nobility: 56, approachability: 66, mysteriousness: 40 }),
  otter: p({ roundness: 68, sharpness: 36, softness: 74, eyeSize: 64, eyeSharpness: 34, eyeDroopiness: 30, eyeUpturn: 32, faceLength: 42, faceCompactness: 70, facialSpacing: 44, mouthWarmth: 74, smileEnergy: 72, calmness: 54, playfulness: 82, elegance: 38, wildness: 24, cuteness: 78, nobility: 34, approachability: 86, mysteriousness: 22 }),
  squirrel: p({ roundness: 58, sharpness: 58, softness: 58, eyeSize: 62, eyeSharpness: 56, eyeDroopiness: 20, eyeUpturn: 52, faceLength: 50, faceCompactness: 66, facialSpacing: 42, mouthWarmth: 62, smileEnergy: 70, calmness: 38, playfulness: 84, elegance: 40, wildness: 36, cuteness: 74, nobility: 30, approachability: 76, mysteriousness: 34 }),
  raccoon: p({ roundness: 50, sharpness: 66, softness: 48, eyeSize: 52, eyeSharpness: 66, eyeDroopiness: 24, eyeUpturn: 56, faceLength: 54, faceCompactness: 52, facialSpacing: 48, mouthWarmth: 52, smileEnergy: 48, calmness: 52, playfulness: 66, elegance: 40, wildness: 52, cuteness: 52, nobility: 36, approachability: 54, mysteriousness: 62 }),
  tiger: p({ roundness: 34, sharpness: 92, softness: 24, eyeSize: 46, eyeSharpness: 90, eyeDroopiness: 10, eyeUpturn: 70, faceLength: 62, faceCompactness: 46, facialSpacing: 50, mouthWarmth: 24, smileEnergy: 20, calmness: 58, playfulness: 26, elegance: 54, wildness: 94, cuteness: 12, nobility: 68, approachability: 16, mysteriousness: 72 }),
  lion: p({ roundness: 46, sharpness: 82, softness: 36, eyeSize: 50, eyeSharpness: 76, eyeDroopiness: 14, eyeUpturn: 56, faceLength: 58, faceCompactness: 50, facialSpacing: 54, mouthWarmth: 40, smileEnergy: 36, calmness: 62, playfulness: 34, elegance: 66, wildness: 82, cuteness: 24, nobility: 86, approachability: 28, mysteriousness: 62 }),
  owl: p({ roundness: 60, sharpness: 70, softness: 50, eyeSize: 82, eyeSharpness: 68, eyeDroopiness: 22, eyeUpturn: 44, faceLength: 52, faceCompactness: 58, facialSpacing: 60, mouthWarmth: 42, smileEnergy: 24, calmness: 88, playfulness: 18, elegance: 70, wildness: 34, cuteness: 46, nobility: 74, approachability: 30, mysteriousness: 84 }),
  dolphin: p({ roundness: 58, sharpness: 46, softness: 68, eyeSize: 54, eyeSharpness: 46, eyeDroopiness: 26, eyeUpturn: 38, faceLength: 56, faceCompactness: 54, facialSpacing: 62, mouthWarmth: 76, smileEnergy: 78, calmness: 72, playfulness: 74, elegance: 62, wildness: 26, cuteness: 58, nobility: 64, approachability: 82, mysteriousness: 34 }),
  seal: p({ roundness: 72, sharpness: 24, softness: 84, eyeSize: 70, eyeSharpness: 24, eyeDroopiness: 38, eyeUpturn: 18, faceLength: 40, faceCompactness: 78, facialSpacing: 56, mouthWarmth: 72, smileEnergy: 58, calmness: 74, playfulness: 44, elegance: 42, wildness: 14, cuteness: 86, nobility: 34, approachability: 84, mysteriousness: 24 }),
  panda: p({ roundness: 78, sharpness: 20, softness: 88, eyeSize: 64, eyeSharpness: 30, eyeDroopiness: 34, eyeUpturn: 22, faceLength: 42, faceCompactness: 80, facialSpacing: 52, mouthWarmth: 70, smileEnergy: 48, calmness: 78, playfulness: 36, elegance: 44, wildness: 12, cuteness: 82, nobility: 46, approachability: 78, mysteriousness: 30 }),
  hamster: p({ roundness: 86, sharpness: 14, softness: 90, eyeSize: 68, eyeSharpness: 18, eyeDroopiness: 34, eyeUpturn: 14, faceLength: 34, faceCompactness: 90, facialSpacing: 44, mouthWarmth: 78, smileEnergy: 64, calmness: 56, playfulness: 72, elegance: 20, wildness: 8, cuteness: 96, nobility: 16, approachability: 90, mysteriousness: 10 }),
  horse: p({ roundness: 32, sharpness: 72, softness: 42, eyeSize: 52, eyeSharpness: 62, eyeDroopiness: 20, eyeUpturn: 40, faceLength: 82, faceCompactness: 24, facialSpacing: 70, mouthWarmth: 46, smileEnergy: 30, calmness: 74, playfulness: 22, elegance: 82, wildness: 58, cuteness: 20, nobility: 88, approachability: 34, mysteriousness: 58 }),
  swan: p({ roundness: 44, sharpness: 58, softness: 66, eyeSize: 50, eyeSharpness: 54, eyeDroopiness: 18, eyeUpturn: 42, faceLength: 78, faceCompactness: 26, facialSpacing: 76, mouthWarmth: 54, smileEnergy: 32, calmness: 90, playfulness: 14, elegance: 94, wildness: 20, cuteness: 34, nobility: 92, approachability: 38, mysteriousness: 66 }),
  sheep: p({ roundness: 80, sharpness: 18, softness: 92, eyeSize: 62, eyeSharpness: 20, eyeDroopiness: 40, eyeUpturn: 16, faceLength: 38, faceCompactness: 84, facialSpacing: 54, mouthWarmth: 74, smileEnergy: 56, calmness: 80, playfulness: 34, elegance: 36, wildness: 10, cuteness: 88, nobility: 30, approachability: 88, mysteriousness: 16 }),
  meerkat: p({ roundness: 52, sharpness: 62, softness: 52, eyeSize: 58, eyeSharpness: 60, eyeDroopiness: 18, eyeUpturn: 46, faceLength: 62, faceCompactness: 50, facialSpacing: 48, mouthWarmth: 56, smileEnergy: 52, calmness: 48, playfulness: 68, elegance: 42, wildness: 40, cuteness: 60, nobility: 32, approachability: 62, mysteriousness: 44 }),
  hedgehog: p({ roundness: 66, sharpness: 54, softness: 54, eyeSize: 48, eyeSharpness: 50, eyeDroopiness: 26, eyeUpturn: 34, faceLength: 46, faceCompactness: 66, facialSpacing: 50, mouthWarmth: 48, smileEnergy: 36, calmness: 70, playfulness: 30, elegance: 34, wildness: 46, cuteness: 56, nobility: 28, approachability: 42, mysteriousness: 52 }),
  ferret: p({ roundness: 42, sharpness: 74, softness: 40, eyeSize: 46, eyeSharpness: 70, eyeDroopiness: 16, eyeUpturn: 54, faceLength: 68, faceCompactness: 42, facialSpacing: 46, mouthWarmth: 42, smileEnergy: 40, calmness: 50, playfulness: 62, elegance: 52, wildness: 54, cuteness: 36, nobility: 46, approachability: 44, mysteriousness: 64 }),
}


const fallback = coreAnimalProfiles.cat

export function profileForBaseAnimal(baseAnimal: string): FeatureProfile {
  const s = baseAnimal.toLowerCase()
  if (s.includes('사슴') || s.includes('deer') || s.includes('stag')) return coreAnimalProfiles.deer
  if (s.includes('고양이') || s.includes('cat')) return coreAnimalProfiles.cat
  if (s.includes('여우') || s.includes('fox')) return coreAnimalProfiles.fox
  if (s.includes('강아지') || s.includes('dog') || s.includes('puppy')) return coreAnimalProfiles.puppy
  if (s.includes('토끼') || s.includes('rabbit')) return coreAnimalProfiles.rabbit
  return fallback
}
