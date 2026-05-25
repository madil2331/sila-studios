export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
      { userAgent: 'GPTBot', allow: '/', disallow: ['/admin', '/api'] },
    ],
    sitemap: 'https://www.silastudios.store/sitemap.xml',
  }
}
