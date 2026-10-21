import { SITE } from '../config/site'

// Для режима "random" — выбираем менеджера один раз на посетителя
let randomIndex: number | null = null

function pickIndex(): number {
  if (SITE.whatsappMode === 'first') return 0
  if (randomIndex === null) {
    try {
      const saved = sessionStorage.getItem('bb-wa')
      randomIndex = saved !== null ? Number(saved) : Math.floor(Math.random() * SITE.whatsapp.length)
      sessionStorage.setItem('bb-wa', String(randomIndex))
    } catch {
      randomIndex = Math.floor(Math.random() * SITE.whatsapp.length)
    }
    if (!SITE.whatsapp[randomIndex]) randomIndex = 0
  }
  return randomIndex
}

/** Ссылка на WhatsApp с готовым текстом. manager — конкретный номер (0 или 1), иначе по whatsappMode */
export function waLink(text: string, manager?: number): string {
  const idx = manager ?? pickIndex()
  const { number } = SITE.whatsapp[idx] ?? SITE.whatsapp[0]
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}
