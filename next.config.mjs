/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    const catalog = [
      { key: 'Cache-Control', value: 'private, no-cache, no-store, max-age=0, must-revalidate' },
    ]
    return [
      { source: '/', headers: catalog },
      { source: '/collections', headers: catalog },
    ]
  },
}

export default nextConfig
