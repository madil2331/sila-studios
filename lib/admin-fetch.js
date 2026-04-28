/** Avoid stale admin data: browsers may cache GET /api/admin/* without this. */
export function adminFetch(input, init = {}) {
  return fetch(input, { ...init, cache: 'no-store' })
}
