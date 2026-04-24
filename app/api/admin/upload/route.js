import { NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request) {
  const session = await getSessionFromCookies()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Validate type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG and WebP images allowed' }, { status: 400 })
    }

    // Validate size — max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = new Uint8Array(bytes)

    // Unique filename: timestamp + random + original extension
    const ext = file.name.split('.').pop().toLowerCase()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const db = getSupabaseAdmin()
    const { data, error } = await db.storage
      .from('product-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Get public URL
    const { data: urlData } = db.storage
      .from('product-images')
      .getPublicUrl(filename)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
