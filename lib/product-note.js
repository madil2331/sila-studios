const NOTE_OPEN = '[PRODUCT_NOTE]'
const NOTE_CLOSE = '[/PRODUCT_NOTE]'

export function packDescriptionAndNote(description, note) {
  const cleanDescription = String(description || '').replace(new RegExp(`\\n?${NOTE_OPEN}[\\s\\S]*?${NOTE_CLOSE}`, 'g'), '').trim()
  const cleanNote = String(note || '').trim()
  if (!cleanNote) return cleanDescription
  const spacer = cleanDescription ? '\n\n' : ''
  return `${cleanDescription}${spacer}${NOTE_OPEN}${cleanNote}${NOTE_CLOSE}`
}

export function unpackDescriptionAndNote(description, productNote) {
  const rawDescription = String(description || '')
  const markerRegex = new RegExp(`${NOTE_OPEN}([\\s\\S]*?)${NOTE_CLOSE}`)
  const match = rawDescription.match(markerRegex)

  const extractedNote = match?.[1]?.trim() || ''
  const cleanDescription = rawDescription.replace(new RegExp(`\\n?${NOTE_OPEN}[\\s\\S]*?${NOTE_CLOSE}`, 'g'), '').trim()

  return {
    description: cleanDescription,
    product_note: String(productNote || extractedNote || '').trim(),
  }
}
