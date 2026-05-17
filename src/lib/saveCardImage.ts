export async function saveCardImage(element: HTMLElement) {
  const { default: html2canvas } = await import('html2canvas')
  const canvas = await html2canvas(element, { backgroundColor: '#f8f5ef', scale: 2 })
  const a = document.createElement('a')
  a.download = 'animal-face-archive-card.png'
  a.href = canvas.toDataURL('image/png')
  a.click()
}
