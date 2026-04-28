/**
 * Next.js 15+ may pass `params` as a Promise; Next 14 uses a plain object.
 * @param {Record<string, string> | Promise<Record<string, string>>} raw
 * @returns {Promise<Record<string, string>>}
 */
export async function resolveRouteParams(raw) {
  if (raw != null && typeof raw.then === 'function') return await raw
  return raw ?? {}
}
