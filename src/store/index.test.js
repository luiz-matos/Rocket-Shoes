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
  localStorage.clear()
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

describe('store com carrinho salvo', () => {
  it('começa com o carrinho salvo e salva cada mudança', async () => {
    const product = { id: 1, title: 'Tênis', price: 100, amount: 1 }
    localStorage.setItem('@RocketShoes:cart', JSON.stringify([product]))
    const { store } = await loadStore()
    const { removeFromCart } = await import('./modules/cart/actions')

    expect(store.getState().cart).toEqual([product])

    store.dispatch(removeFromCart(1))

    expect(JSON.parse(localStorage.getItem('@RocketShoes:cart'))).toEqual([])
  })
})
