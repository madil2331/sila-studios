function normalizeWhatsAppNumber(input) {
  const raw = String(input || '')
  const digits = raw.replace(/\D/g, '')

  // Accept common Pakistan formats:
  // - 0316...  -> 92316...
  // - +92 316... / 92 316... -> 92316...
  if (digits.length === 11 && digits.startsWith('0')) return `92${digits.slice(1)}`
  return digits
}

export function getWhatsAppLink(message, number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) {
  const normalized = normalizeWhatsAppNumber(number)
  const text = encodeURIComponent(message || '')
  return `https://wa.me/${normalized}?text=${text}`
}

