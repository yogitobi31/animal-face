const EXPORT_BG = '#f8f5ef'

function waitForNextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

async function waitForImages(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll('img'))
  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve()
      return new Promise<void>((resolve, reject) => {
        const onLoad = () => {
          cleanup()
          resolve()
        }
        const onError = () => {
          cleanup()
          reject(new Error(`[save-card-image] image load failed: ${img.currentSrc || img.src}`))
        }
        const cleanup = () => {
          img.removeEventListener('load', onLoad)
          img.removeEventListener('error', onError)
        }
        img.addEventListener('load', onLoad, { once: true })
        img.addEventListener('error', onError, { once: true })
      })
    }),
  )
}

function createExportNode(element: HTMLElement) {
  const clone = element.cloneNode(true) as HTMLElement
  clone.style.width = `${element.offsetWidth}px`
  clone.style.maxWidth = `${element.offsetWidth}px`
  const wrapper = document.createElement('div')
  wrapper.style.position = 'fixed'
  wrapper.style.left = '-99999px'
  wrapper.style.top = '0'
  wrapper.style.pointerEvents = 'none'
  wrapper.style.opacity = '1'
  wrapper.style.background = EXPORT_BG
  wrapper.appendChild(clone)
  document.body.appendChild(wrapper)
  return { wrapper, clone }
}

export async function saveCardImage(element: HTMLElement) {
  const { default: html2canvas } = await import('html2canvas')

  const { wrapper, clone } = createExportNode(element)

  try {
    await waitForNextFrame()
    if (document.fonts?.ready) await document.fonts.ready
    await waitForImages(clone)

    const canvas = await html2canvas(clone, {
      backgroundColor: EXPORT_BG,
      scale: Math.min(3, Math.max(2, window.devicePixelRatio || 2)),
      useCORS: true,
      imageTimeout: 15000,
      logging: false,
    })

    const a = document.createElement('a')
    a.download = 'animal-face-archive-card.png'
    a.href = canvas.toDataURL('image/png')
    a.click()
  } catch (error) {
    console.error('[save-card-image] export failed', {
      reason: error instanceof Error ? error.message : String(error),
      error,
    })
    throw error
  } finally {
    wrapper.remove()
  }
}
