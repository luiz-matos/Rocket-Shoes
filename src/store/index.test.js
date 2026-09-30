import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(async url =>
      url.startsWith('/stock')
        ? { data: { id: 1, amount: 3 } }
        : { data: { id: 1, title: 'Tênis', price: 100 } }
    ),
  },
}))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

async function loadStore() {
  const { default: store } = await import('./index')
  const { addToCartRequest } = await import('./modules/cart/actions')
  return { store, addToCartRequest }
}

describe.each([
  ['desenvolvimento', true],
  ['produção', false],
])('store em %s', (_, dev) => {
  it('carrega e executa os sagas', async () => {
    vi.stubEnv('DEV', dev)
    const { store, addToCartRequest } = await loadStore()

    store.dispatch(addToCartRequest(1))

    await vi.waitFor(() => expect(store.getState().cart).toHaveLength(1))
  })
})
