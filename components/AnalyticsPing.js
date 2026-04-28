'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsPing() {
  const pathname = usePathname()

  useEffect(() => {
    // Fire-and-forget
    fetch('/api/public/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'page_view', path: pathname }),
      keepalive: true,
    }).catch(() => {})
  }, [pathname])

  return null
}

