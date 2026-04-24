import { createClient } from '@supabase/supabase-js'
import CollectionsClient from './CollectionsClient'

export const metadata = {
  title: 'Collections — Sila Studios',
  description: 'Browse our curated ladies fashion collections. Formal wear, casual kurtas, embroidered suits. Order via WhatsApp with COD delivery across Pakistan.',
}

async function getProducts() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  } catch (e) {
    console.error('Failed to fetch products:', e)
    return []
  }
}

export default async function CollectionsPage() {
  const products = await getProducts()
  return <CollectionsClient products={products} />
}
