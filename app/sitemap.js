export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'

export default async function sitemap() {
  const base = 'https://www.silastudios.store'
  const urls = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
  ]

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) return urls

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
  const { data: products } = await supabase.from('products').select('id,handle,updated_at')
  ;(products || []).forEach((p) => {
    urls.push({ url: `${base}/products/${encodeURIComponent(p.handle || p.id)}`, lastModified: p.updated_at || new Date() })
  })

  try {
    const { data: categories } = await supabase.from('categories').select('slug,updated_at')
    ;(categories || []).forEach((c) => {
      if (c?.slug) urls.push({ url: `${base}/collections?category=${encodeURIComponent(c.slug)}`, lastModified: c.updated_at || new Date() })
    })
  } catch {}

  return urls
}
