import type { BaseFeatures } from '../types/animal'

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v))
const scale = (v: number, fromMin: number, fromMax: number) => clamp(((v - fromMin) / (fromMax - fromMin)) * 100)

export async function extractFaceFeatures(image: HTMLImageElement): Promise<{features: BaseFeatures; multipleFaces: boolean}> {
  try {
    const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
    const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm')
    const landmarker = await FaceLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task' }, runningMode: 'IMAGE', numFaces: 3 })
    const res = landmarker.detect(image)
    if (!res.faceLandmarks.length) throw new Error('NO_FACE')

    const landmarks = res.faceLandmarks[0]
    const x=(i:number)=>landmarks[i].x, y=(i:number)=>landmarks[i].y
    const dist=(a:number,b:number)=>Math.hypot(x(a)-x(b),y(a)-y(b))
    const avg=(a:number,b:number)=> (a+b)/2

    const faceW=dist(234,454)
    const faceH=dist(10,152)
    const leftEyeOpen = dist(159,145)
    const rightEyeOpen = dist(386,374)
    const eyeOpen = avg(leftEyeOpen, rightEyeOpen)
    const leftEyeWidth = dist(33,133)
    const rightEyeWidth = dist(362,263)
    const eyeWidth = avg(leftEyeWidth, rightEyeWidth)
    const eyeSpacing = dist(133,362)
    const mouthWidth = dist(61,291)
    const upperLip = dist(13,0)
    const lowerLip = dist(17,14)
    const mouthOpen = upperLip + lowerLip
    const jawWidth = dist(172,397)
    const cheekWidth = dist(93,323)
    const browSlope = avg(Math.abs(y(70)-y(105)), Math.abs(y(336)-y(334)))
    const noseLength = dist(6,1)

    const symmetryDelta =
      Math.abs(dist(33,1)-dist(263,1)) +
      Math.abs(dist(61,1)-dist(291,1)) +
      Math.abs(dist(172,1)-dist(397,1))

    const features: BaseFeatures = {
      faceRoundness: scale(faceW / faceH, 0.72, 1.28),
      faceLength: scale(faceH / faceW, 0.78, 1.42),
      jawSharpness: scale((jawWidth / faceW) * (1 - (cheekWidth / faceW - 0.62)), 0.28, 0.62),
      eyeRoundness: scale(eyeOpen / eyeWidth, 0.16, 0.52),
      eyeSharpness: scale(eyeWidth / eyeOpen, 1.7, 4.9),
      eyeSpacing: scale(eyeSpacing / faceW, 0.26, 0.55),
      mouthSoftness: scale((mouthWidth / faceW) * (1 - mouthOpen / faceH), 0.18, 0.45),
      smileHint: scale(((y(61)+y(291))/2-y(13)) + mouthOpen * 0.22, -0.02, 0.11),
      symmetry: clamp(100 - scale(symmetryDelta / faceW, 0.02, 0.26)),
      overallSoftness: scale((eyeOpen / faceH) + (mouthOpen / faceH) + (cheekWidth / faceW), 0.5, 1.1),
      overallSharpness: scale((jawWidth / faceW) + browSlope * 4 + (noseLength / faceH), 0.55, 1.25),
    }
    return { features, multipleFaces: res.faceLandmarks.length > 1 }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    if (message === 'NO_FACE') {
      throw new Error('얼굴을 찾기 어려워요. 정면에 가까운 밝은 사진으로 다시 시도해 주세요.')
    }
    console.error('[face-analysis] extraction failed', { message, error: e })
    throw new Error('얼굴 분석 정확도가 낮아 결과를 만들지 못했어요. 조명이 밝은 정면 사진으로 다시 시도해 주세요.')
  }
}
