function env(name) {
  return process.env[name] || ''
}

/**
 * Payment provider abstraction.
 * Current business model is COD + WhatsApp, so default is "disabled".
 * When you finalize a gateway, implement `createPaymentIntent` + `verifyWebhook`.
 */
export function getPaymentProvider() {
  const provider = (env('PAYMENT_PROVIDER') || 'disabled').toLowerCase()

  if (provider === 'disabled') {
    return {
      name: 'disabled',
      async createPaymentIntent() {
        return { status: 'disabled', message: 'Online payments are not enabled yet.' }
      },
      async verifyWebhook() {
        return { status: 'disabled' }
      },
    }
  }

  if (provider === 'safepay') return createStubProvider('safepay')
  if (provider === 'postex') return createStubProvider('postex')

  return createStubProvider(provider)
}

function createStubProvider(name) {
  return {
    name,
    async createPaymentIntent() {
      return { status: 'not_implemented', message: `Payment provider "${name}" selected but not implemented yet.` }
    },
    async verifyWebhook() {
      return { status: 'not_implemented' }
    },
  }
}

