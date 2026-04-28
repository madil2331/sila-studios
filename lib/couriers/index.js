function env(name) {
  return process.env[name] || ''
}

/**
 * Courier provider interface (plug-in style).
 * When you finalize a courier, implement `bookShipment` and `getTracking`.
 */
export function getCourierProvider() {
  const provider = (env('COURIER_PROVIDER') || 'manual').toLowerCase()

  if (provider === 'manual') {
    return {
      name: 'manual',
      async bookShipment() {
        return {
          booking_ref: null,
          tracking_number: null,
          status: 'manual',
          message: 'Courier not configured. Book shipment manually and update order in admin.',
        }
      },
      async getTracking() {
        return { status: 'unknown', message: 'Courier not configured.' }
      },
    }
  }

  // Future providers (stubs)
  if (provider === 'postex') {
    return createStubProvider('postex')
  }
  if (provider === 'leopard') {
    return createStubProvider('leopard')
  }

  return createStubProvider(provider)
}

function createStubProvider(name) {
  return {
    name,
    async bookShipment() {
      return {
        booking_ref: null,
        tracking_number: null,
        status: 'not_implemented',
        message: `Courier provider "${name}" is selected but not implemented yet.`,
      }
    },
    async getTracking() {
      return { status: 'not_implemented', message: `Tracking for "${name}" not implemented yet.` }
    },
  }
}

