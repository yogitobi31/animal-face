import { matchAnimal } from '../src/lib/matchAnimal.ts'
import { toEmotionVector } from '../src/lib/featureExtraction.ts'

const profiles={
roundSoft:{faceRoundness:85,faceLength:30,jawSharpness:20,eyeRoundness:80,eyeSharpness:25,eyeSpacing:52,mouthSoftness:82,smileHint:74,symmetry:68,overallSoftness:86,overallSharpness:20},
longElegant:{faceRoundness:30,faceLength:84,jawSharpness:46,eyeRoundness:50,eyeSharpness:56,eyeSpacing:46,mouthSoftness:58,smileHint:38,symmetry:88,overallSoftness:56,overallSharpness:58},
sharpIntense:{faceRoundness:28,faceLength:76,jawSharpness:88,eyeRoundness:24,eyeSharpness:92,eyeSpacing:44,mouthSoftness:24,smileHint:18,symmetry:76,overallSoftness:24,overallSharpness:92},
playfulBright:{faceRoundness:70,faceLength:44,jawSharpness:30,eyeRoundness:78,eyeSharpness:34,eyeSpacing:48,mouthSoftness:74,smileHint:86,symmetry:70,overallSoftness:76,overallSharpness:30},
calmMysterious:{faceRoundness:44,faceLength:72,jawSharpness:62,eyeRoundness:42,eyeSharpness:66,eyeSpacing:45,mouthSoftness:40,smileHint:28,symmetry:90,overallSoftness:44,overallSharpness:70}
}
for (const [name,b] of Object.entries(profiles)) { const r=matchAnimal(toEmotionVector(b),b); console.log(name,'=>',r.mainResult.name,'/',r.candidates.map(c=>c.name).join(', ')) }
