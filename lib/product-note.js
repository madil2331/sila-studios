const NOTE_OPEN = '[PRODUCT_NOTE]'
const NOTE_CLOSE = '[/PRODUCT_NOTE]'

export function packDescriptionAndNote(description, note) {
  const cleaned = unpackDescriptionAndNote(description, '').description
  const cleanNote = String(note || '').trim()
  if (!cleanNote) return cleaned
  const spacer = cleaned ? '\n\n' : ''
  return `${cleaned}${spacer}${NOTE_OPEN}${cleanNote}${NOTE_CLOSE}`
}

export function unpackDescriptionAndNote(description, productNote) {
  const raw = String(description || '')
  const start = raw.indexOf(NOTE_OPEN)
  const end = start >= 0 ? raw.indexOf(NOTE_CLOSE, start + NOTE_OPEN.length) : -1

  let extractedNote = ''
  let cleanDescription = raw

  if (start >= 0 && end > start) {
    extractedNote = raw.slice(start + NOTE_OPEN.length, end).trim()
    cleanDescription = `${raw.slice(0, start)}${raw.slice(end + NOTE_CLOSE.length)}`.trim()
  }

  return {
    description: cleanDescription.trim(),
    product_note: String(productNote || extractedNote || '').trim(),
  }
}
